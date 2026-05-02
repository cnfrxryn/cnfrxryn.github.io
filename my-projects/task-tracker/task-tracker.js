let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;
let currentPage = 1;
const rowsPerPage = 10;
let isEditMode = false;
let selectedTaskIds = new Set();
let currentView = "active"; // active | completed
let filters = JSON.parse(localStorage.getItem("filters")) || {
  priority: "",
  status: ""
};

/* =========================
   CREATE / UPDATE TASK
========================= */
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
    tasks.push({
      id: Date.now(),
      title,
      description,
      priority,
      deadline,
      status,
      createdAt: new Date().toISOString()
    });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskForm").reset();
  document.querySelector("#taskForm button").textContent = "Create";

  closeModal();
  renderTasks();
}

/* =========================
   MODALS
========================= */
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
  document.getElementById("viewCreated").textContent =
    "Task created on " + formatDate(task.createdAt);

  document.getElementById("viewModal").classList.add("active");
}

function closeViewModal() {
  document.getElementById("viewModal").classList.remove("active");
}

/* =========================
   EDIT MODE
========================= */
function editTask() {
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;

  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDeadline").value = task.deadline;
  document.getElementById("taskStatus").value = task.status;

  isEditMode = true;
  document.querySelector("#taskForm button").textContent = "Update";

  closeViewModal();
  openModal();
}

/* =========================
   RENDER TABLE
========================= */
function renderTasks() {
  const tbody = document.querySelector("tbody");
  const pagination = document.getElementById("pagination");

  tbody.innerHTML = "";
  pagination.innerHTML = "";

  // 🔥 FILTER FIRST
  let filteredTasks =
    currentView === "active"
      ? tasks.filter(t => t.status !== "Completed")
      : tasks.filter(t => t.status === "Completed");

  // APPLY FILTERS
  if (filters.priority) {
    filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
  }

  if (filters.status) {
    filteredTasks = filteredTasks.filter(t => t.status === filters.status);
  }

  // 🔥 PAGINATION
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedTasks = filteredTasks.slice(start, end);

  // 🔁 RENDER ROWS
  paginatedTasks.forEach(task => {
    const row = document.createElement("tr");
    row.classList.add("task-row");

    row.innerHTML = `
      <td>
        <input 
          type="checkbox"
          ${selectedTaskIds.has(task.id) ? "checked" : ""}
          onclick="toggleTaskSelection(event, ${task.id})"
        >
      </td>
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

  renderPagination(totalPages);

  const selectAll = document.getElementById("selectAll");
  if (selectAll) selectAll.checked = false;
}

/* =========================
   PAGINATION
========================= */
function renderPagination(totalPages) {
  const pagination = document.getElementById("pagination");

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

  for (let i = 1; i <= totalPages; i++) {
    const page = document.createElement("span");
    page.textContent = i;
    page.classList.add("page");

    if (i === currentPage) page.classList.add("active");

    page.onclick = () => {
      currentPage = i;
      renderTasks();
    };

    pagination.appendChild(page);
  }

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

/* =========================
   CHECKBOX LOGIC
========================= */
function toggleTaskSelection(e, taskId) {
  e.stopPropagation();

  if (selectedTaskIds.has(taskId)) {
    selectedTaskIds.delete(taskId);
  } else {
    selectedTaskIds.add(taskId);
  }

  updateCompleteButton();
}

function updateCompleteButton() {
  const btn = document.querySelector(".btn-complete");

  if (selectedTaskIds.size > 0) {
    btn.classList.remove("hidden");
  } else {
    btn.classList.add("hidden");
  }
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  updateActionButtonText();

  // SELECT ALL
  document.getElementById("selectAll").addEventListener("change", (e) => {
    selectedTaskIds.clear();

    if (e.target.checked) {
      let visibleTasks =
        currentView === "active"
          ? tasks.filter(t => t.status !== "Completed")
          : tasks.filter(t => t.status === "Completed");

      if (filters.priority) {
        visibleTasks = visibleTasks.filter(t => t.priority === filters.priority);
      }

      if (filters.status) {
        visibleTasks = visibleTasks.filter(t => t.status === filters.status);
      }

      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      visibleTasks.slice(start, end).forEach(task => {
        selectedTaskIds.add(task.id);
      });
    }

    renderTasks();
    updateCompleteButton();
  });

  // MARK COMPLETE
  document.querySelector(".btn-complete").addEventListener("click", () => {
    tasks.forEach(task => {
      if (selectedTaskIds.has(task.id)) {
        task.status =
          currentView === "active"
            ? "Completed"
            : "In Progress";
      }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    selectedTaskIds.clear();

    updateActionButtonText(); // ✅ ADD THIS
    updateCompleteButton();   // already there
    renderTasks();
  });

  // TOGGLE VIEW
  const toggles = document.querySelectorAll(".toggle");

  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      toggles.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentView = btn.textContent.toLowerCase();
      currentPage = 1;

      // 🔥 IMPORTANT FIX
      selectedTaskIds.clear();
      updateCompleteButton();
      updateActionButtonText();

      renderTasks();
    });
  });
});

/* =========================
   UTIL
========================= */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function openFilterModal() {
  document.getElementById("filterModal").classList.add("active");

  // preload values
  document.getElementById("filterPriority").value = filters.priority;
  document.getElementById("filterStatus").value = filters.status;
}

function closeFilterModal() {
  document.getElementById("filterModal").classList.remove("active");
}

function applyFilters() {
  filters.priority = document.getElementById("filterPriority").value;
  filters.status = document.getElementById("filterStatus").value;

  localStorage.setItem("filters", JSON.stringify(filters));

  closeFilterModal();
  currentPage = 1;
  updateActionButtonText();
  updateCompleteButton();
  renderTasks();
}

function updateActionButtonText() {
  const btn = document.querySelector(".btn-complete");

  if (currentView === "active") {
    btn.textContent = "Mark as Completed";
    btn.classList.remove("restore");
  } else {
    btn.textContent = "Restore to Active";
    btn.classList.add("restore");
  }
}