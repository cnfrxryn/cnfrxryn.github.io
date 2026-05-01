let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;

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
  tbody.innerHTML = "";

  tasks.forEach(task => {
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

    // 🔥 CLICK ROW → OPEN MODAL
    row.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT") return; // ignore checkbox click
      openViewModal(task.id);
    });

    tbody.appendChild(row);
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}