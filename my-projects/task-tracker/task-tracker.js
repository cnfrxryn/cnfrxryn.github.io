let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;
let currentPage = 1;
const rowsPerPage = 10;
let isEditMode = false;
let selectedTaskIds = new Set();

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

  if (isEditMode) {
    // 🔄 UPDATE EXISTING TASK
    const task = tasks.find(t => t.id === selectedTaskId);

    if (task) {
      task.title = title;
      task.description = description;
      task.priority = priority;
      task.deadline = deadline;
      task.status = status;
    }

    isEditMode = false;
  } else {
    // ➕ CREATE NEW TASK
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
  }

  // SAVE
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // RESET
  document.getElementById("taskForm").reset();

  // RESET BUTTON TEXT
  document.querySelector("#taskForm button").textContent = "Create";

  // CLOSE
  closeModal();

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
  document.getElementById("viewCreated").textContent = "Task created on " + formatDate(task.createdAt);
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
      <td><input type="checkbox" ${selectedTaskIds.has(task.id) ? "checked" : ""} onclick="toggleTaskSelection(event, ${task.id})"></td>
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

function editTask() {
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;

  // PREFILL FORM
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDeadline").value = task.deadline;
  document.getElementById("taskStatus").value = task.status;

  // SWITCH MODE
  isEditMode = true;

  // CHANGE BUTTON TEXT
  document.querySelector("#taskForm button").textContent = "Update";

  // CLOSE VIEW → OPEN FORM
  closeViewModal();
  openModal();
}

function toggleTaskSelection(e, taskId) {
  e.stopPropagation();

  if (selectedTaskIds.has(taskId)) {
    selectedTaskIds.delete(taskId);
  } else {
    selectedTaskIds.add(taskId);
  }

  updateCompleteButton();
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();

  const selectAll = document.getElementById("selectAll");

  selectAll.addEventListener("change", () => {
    if (selectAll.checked) {
      tasks.forEach(task => selectedTaskIds.add(task.id));
    } else {
      selectedTaskIds.clear();
    }

    renderTasks();
    updateCompleteButton();
  });

  document.querySelector(".btn-complete").addEventListener("click", () => {
    tasks.forEach(task => {
      if (selectedTaskIds.has(task.id)) {
        task.status = "Completed";
      }
    });

    // SAVE
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // RESET SELECTION
    selectedTaskIds.clear();

    // RELOAD
    renderTasks();
    updateCompleteButton();
  });
});

function updateCompleteButton() {
  const btn = document.querySelector(".btn-complete");

  if (selectedTaskIds.size > 0) {
    btn.classList.remove("hidden");
  } else {
    btn.classList.add("hidden");
  }
}