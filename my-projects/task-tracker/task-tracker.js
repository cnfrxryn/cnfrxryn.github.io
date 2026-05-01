let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;
let currentPage = 1;
const rowsPerPage = 10;

function createTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const priority = document.getElementById("taskPriority").value;
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  if (!title || !priority || !deadline || !status) {
    alert("Please fill all required fields.");
    return;
  }

  const newTask = {
    id: Date.now(),
    title,
    description,
    priority,
    deadline,
    status,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  // SAVE
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("New task:", newTask);
  console.log("All tasks:", tasks);

  // RESET FORM
  document.getElementById("taskForm").reset();

  // CLOSE MODAL
  closeModal();

  // RE-RENDER TABLE
  renderTasks();
}

function openModal() {
  document.getElementById("taskModal").classList.add("active");
}

function closeModal() {
  document.getElementById("taskModal").classList.remove("active");
}

function openViewModal(taskId) {
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;

  selectedTaskId = taskId;

  document.getElementById("viewTitle").textContent = task.title;
  document.getElementById("viewDescription").textContent = task.description || "";

  document.getElementById("viewPriority").textContent = task.priority;
  document.getElementById("viewStatus").textContent = task.status;
  document.getElementById("viewDeadline").textContent = formatDate(task.deadline);

  document.getElementById("viewModal").classList.add("active");
}

function closeViewModal() {
  document.getElementById("viewModal").classList.remove("active");
}

function renderTasks() {
  const tbody = document.querySelector("tbody");
  const pagination = document.getElementById("pagination");

  tbody.innerHTML = "";
  pagination.innerHTML = "";

  const totalPages = Math.ceil(tasks.length / rowsPerPage);

  // 🧠 slice data for current page
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedTasks = tasks.slice(start, end);

  // 🔁 render rows
  paginatedTasks.forEach(task => {
    const row = document.createElement("tr");
    row.classList.add("task-row");

    row.innerHTML = `
      <td><input type="checkbox"></td>
      <td><img src="/assets/icons/edit-task.png" class="edit-icon"></td>
      <td>${task.title}</td>
      <td>${task.priority}</td>
      <td>${formatDate(task.deadline)}</td>
      <td>${task.status}</td>
    `;

    row.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT") return;
      openViewModal(task.id);
    });

    tbody.appendChild(row);
  });

  // 🧭 render pagination
  renderPagination(totalPages);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});

function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");

  // ⬅ PREVIOUS
  if (currentPage > 1) {
    const prev = document.createElement("span");
    prev.textContent = "<";
    prev.classList.add("page");
    prev.onclick = () => {
      currentPage--;
      renderTasks();
    };
    pagination.appendChild(prev);
  }

  // 🔢 PAGE NUMBERS
  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement("span");
    page.textContent = i;
    page.classList.add("page");

    if (i === currentPage) {
      page.classList.add("active");
    }

    page.onclick = () => {
      currentPage = i;
      renderTasks();
    };

    pagination.appendChild(page);
  }

  // ➡ NEXT
  if (currentPage < totalPages) {
    const next = document.createElement("span");
    next.textContent = ">";
    next.classList.add("page");
    next.onclick = () => {
      currentPage++;
      renderTasks();
    };
    pagination.appendChild(next);
  }
}