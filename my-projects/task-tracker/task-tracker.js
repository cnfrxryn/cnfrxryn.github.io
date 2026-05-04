let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTaskId = null;
let currentPage = 1;
const rowsPerPage = 10;
let isEditMode = false;
let selectedTaskIds = new Set();
let currentView = "active"; // active | completed
let filters = JSON.parse(localStorage.getItem("filters")) || {
  priority: "",
  status: "",
  urgency: ""
};
let searchQuery = "";
let sortConfig = {
  key: "createdAt",
  direction: "desc"
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
  document.getElementById("viewDescription").textContent =
    task.description?.trim()
      ? task.description
      : "No description provided.";
  document.getElementById("viewPriority").textContent = task.priority;
  document.getElementById("viewStatus").textContent = task.status;
  document.getElementById("viewDeadline").textContent = formatDate(task.deadline);
  document.getElementById("viewCreated").innerHTML = `Task created on ${formatDate(task.createdAt)}<br>${getDueText(task)}`;
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

function sortTasks(list) {
  return [...list].sort((a, b) => {
    let valA, valB;

    switch (sortConfig.key) {
      case "title":
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
        break;

      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        valA = priorityOrder[a.priority];
        valB = priorityOrder[b.priority];
        break;

      case "urgency":
        const urgencyOrder = { High: 3, Medium: 2, Low: 1 };
        valA = urgencyOrder[getUrgency(a)];
        valB = urgencyOrder[getUrgency(b)];
        break;

      case "deadline":
        valA = new Date(a.deadline);
        valB = new Date(b.deadline);
        break;

      case "status":
        const statusOrder = {
          "Not Started": 1,
          "In Progress": 2,
          "Completed": 3
        };
        valA = statusOrder[a.status];
        valB = statusOrder[b.status];
        break;

      default:
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
    }

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
}

/* =========================
   RENDER TABLE
========================= */
function renderTasks() {
  updateCounts();
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

  if (filters.urgency) {
    if (filters.urgency === "AtRisk") {
      filteredTasks = filteredTasks.filter(t => {
        const u = getUrgency(t);
        return u === "High" || u === "Medium";
      });
    } else {
      filteredTasks = filteredTasks.filter(t => getUrgency(t) === filters.urgency);
    }
  }

  // 🔍 SEARCH FILTER
  if (searchQuery) {
    filteredTasks = filteredTasks.filter(t => {
      const title = t.title.toLowerCase();
      const desc = (t.description || "").toLowerCase();

      return title.includes(searchQuery) || desc.includes(searchQuery);
    });
  }

  filteredTasks = sortTasks(filteredTasks);

  // 🔥 PAGINATION
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedTasks = filteredTasks.slice(start, end);

  // PLACEHOLDER TEXT
  if (paginatedTasks.length === 0) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td colspan="6" style="text-align:center; padding: 20px; color:#777;">
        ${
          currentView === "active"
            ? "No tasks created yet."
            : "No completed tasks."
        }
      </td>
    `;

    tbody.appendChild(row);

    renderPagination(1);
    return;
  }

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
      <td class="cell-flex">
        ${task.priority}
        <img src="/assets/icons/${task.priority.toLowerCase()}-priority.png" class="priority-icon">
      </td>
      <td>${formatDate(task.deadline)}</td>
      <td class="cell-flex">
        <span class="urgency-dot urgency-${getUrgency(task).toLowerCase()}"></span>
        ${getUrgency(task)}
      </td>
      <td>${task.status}</td>
    `;

    row.addEventListener("click", (e) => {
      if (e.target.closest("input")) return;
      openViewModal(task.id);
    });

    tbody.appendChild(row);
  });

  renderPagination(totalPages);

  const selectAll = document.getElementById("selectAll");
  
  if (selectAll) {
    const visibleIds = paginatedTasks.map(t => t.id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every(id => selectedTaskIds.has(id));

    selectAll.checked = allSelected;
  }
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
  renderTasks();
}

function updateCompleteButton() {
  const btn = document.querySelector(".btn-complete");
  const info = document.getElementById("selectionInfo");
  const count = selectedTaskIds.size;

  if (selectedTaskIds.size > 0) {
    btn.classList.remove("hidden");
    info.classList.remove("hidden");
    info.textContent = 
      count === 1
        ? "1 task selected."
        : `${count} tasks selected.`;
  } else {
    btn.classList.add("hidden");
    info.classList.add("hidden");
  }
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  updateActionButtonText();
  updateSortIcons();
  updateDisabledSortState();

  const btn = document.querySelector(".btn-filter");

  if (filters.priority || filters.status || filters.urgency) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }

  updateClearFiltersVisibility();

  // SELECT ALL
  document.getElementById("selectAll").addEventListener("change", (e) => {
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

    if (filters.urgency) {
      if (filters.urgency === "AtRisk") {
        visibleTasks = visibleTasks.filter(t => {
          const u = getUrgency(t);
          return u === "High" || u === "Medium";
        });
      } else {
        visibleTasks = visibleTasks.filter(t => getUrgency(t) === filters.urgency);
      }
    }

    if (searchQuery) {
      visibleTasks = visibleTasks.filter(t => {
        const title = t.title.toLowerCase();
        const desc = (t.description || "").toLowerCase();
        return title.includes(searchQuery) || desc.includes(searchQuery);
      });
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageTasks = visibleTasks.slice(start, end);

    if (e.target.checked) {
      pageTasks.forEach(task => {
        selectedTaskIds.add(task.id);
      });
    } else {
      pageTasks.forEach(task => {
        selectedTaskIds.delete(task.id);
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
      updateSortIcons();
      updateDisabledSortState();
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    currentPage = 1;
    renderTasks();
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

function getDueText(task) {
  const today = new Date();
  const d = new Date(task.deadline);

  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);

  const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

  // plural helper
  const dayLabel = Math.abs(diffDays) === 1 ? "day" : "days";

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} ${dayLabel}`;
  }

  if (diffDays === 0) {
    return "Due today";
  }

  return `Due in ${diffDays} ${dayLabel}`;
}

function openFilterModal() {
  document.getElementById("filterModal").classList.add("active");

  // preload values
  document.getElementById("filterPriority").value = filters.priority;
  document.getElementById("filterStatus").value = filters.status;
  const urgencyDropdown = document.getElementById("filterUrgency");
  const hint = document.getElementById("filterHint");

  if (filters.urgency === "AtRisk") {
    urgencyDropdown.selectedIndex = -1;
    hint.classList.remove("hidden");
  } else {
    urgencyDropdown.value = filters.urgency || "";
    hint.classList.add("hidden");
  }
}

function closeFilterModal() {
  document.getElementById("filterModal").classList.remove("active");
}

function applyFilters() {
  filters.priority = document.getElementById("filterPriority").value;
  filters.status = document.getElementById("filterStatus").value;
  filters.urgency = document.getElementById("filterUrgency").value;

  localStorage.setItem("filters", JSON.stringify(filters));

  closeFilterModal();
  currentPage = 1;
  updateActionButtonText();
  updateCompleteButton();
  renderTasks();

  const btn = document.querySelector(".btn-filter");

  if (filters.priority || filters.status || filters.urgency) {
    btn.classList.add("active");
  } else {
    btn.classList.remove("active");
  }

  updateClearFiltersVisibility();
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

function updateCounts() {
  const total = tasks.length;

  const high = tasks.filter(t => t.priority === "High").length;

  const today = new Date();

  const risk = tasks.filter(t => {
    const d = new Date(t.deadline);
    const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

    return diffDays <= 2; // includes overdue + today + near due
  }).length;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("highCount").textContent = high;
  document.getElementById("riskCount").textContent = risk;
}

function filterHighPriority() {
  filters = {
    priority: "High",
    status: "",
    urgency: ""
  };
  localStorage.setItem("filters", JSON.stringify(filters));

  currentPage = 1;

  // highlight filter button
  document.querySelector(".btn-filter").classList.add("active");

  renderTasks();
  updateClearFiltersVisibility();
}

function getUrgency(task) {
  const today = new Date();
  const d = new Date(task.deadline);

  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);

  const diffDays = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "High";
  if (diffDays <= 2) return "Medium";
  return "Low";
}

function filterAtRisk() {
  filters = {
    priority: "",
    status: "",
    urgency: "AtRisk"
  };
  currentPage = 1;

  document.querySelector(".btn-filter").classList.add("active");

  localStorage.setItem("filters", JSON.stringify(filters));

  renderTasks();
  updateClearFiltersVisibility();
}

function updateClearFiltersVisibility() {
  const clear = document.getElementById("clearFilters");
  if (!clear) return;

  if (filters.priority || filters.status || filters.urgency) {
    clear.classList.remove("hidden");
  } else {
    clear.classList.add("hidden");
  }
}

function clearFilters() {
  filters = {
    priority: "",
    status: "",
    urgency: ""
  };

  localStorage.setItem("filters", JSON.stringify(filters));

  // reset UI states
  currentPage = 1;

  document.querySelector(".btn-filter").classList.remove("active");
  document.getElementById("filterPriority").value = "";
  document.getElementById("filterStatus").value = "";
  document.getElementById("filterUrgency").value = "";
  document.getElementById("filterHint").classList.add("hidden");
  
  updateClearFiltersVisibility();
  renderTasks();
}

function getFilteredTasksForExport() {
  let filtered =
    currentView === "active"
      ? tasks.filter(t => t.status !== "Completed")
      : tasks.filter(t => t.status === "Completed");

  if (filters.priority) {
    filtered = filtered.filter(t => t.priority === filters.priority);
  }

  if (filters.status) {
    filtered = filtered.filter(t => t.status === filters.status);
  }

  if (filters.urgency) {
    if (filters.urgency === "AtRisk") {
      filtered = filtered.filter(t => {
        const u = getUrgency(t);
        return u === "High" || u === "Medium";
      });
    } else {
      filtered = filtered.filter(t => getUrgency(t) === filters.urgency);
    }
  }

  if (searchQuery) {
    filtered = filtered.filter(t => {
      const title = t.title.toLowerCase();
      const desc = (t.description || "").toLowerCase();
      return title.includes(searchQuery) || desc.includes(searchQuery);
    });
  }

  return filtered;
}

function downloadXLS() {
  const data = getFilteredTasksForExport();

  const formatted = data.map(t => ({
    Task: t.title,
    Description: t.description || "",
    Priority: t.priority,
    Deadline: formatDate(t.deadline),
    Urgency: getUrgency(t),
    Status: t.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  XLSX.writeFile(workbook, "task-tracker.xlsx");
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const data = getFilteredTasksForExport();

  let y = 10;

  doc.setFontSize(14);
  doc.text("Task List", 10, y);
  y += 10;

  doc.setFontSize(10);

  // headers
  doc.text("Task", 10, y);
  doc.text("Description", 50, y);
  doc.text("Priority", 110, y);
  doc.text("Deadline", 135, y);
  doc.text("Urgency", 165, y);
  doc.text("Status", 185, y);
  y += 6;

  data.forEach(t => {
    const taskLines = doc.splitTextToSize(t.title, 35);
    const desc = (t.description || "").trim();
    const limitedDesc = desc.substring(0, 120);
    const descLines = doc.splitTextToSize(limitedDesc, 55);

    const rowHeight = Math.max(
      taskLines.length * 5,
      descLines.length * 5,
      6
    );

    if (y + rowHeight > 280) {
      doc.addPage();
      y = 10;
    }

    doc.text(taskLines, 10, y);
    doc.text(descLines, 50, y);
    doc.text(t.priority, 110, y);
    doc.text(formatDate(t.deadline), 135, y);
    doc.text(getUrgency(t), 165, y);
    doc.text(t.status, 185, y);

    y += rowHeight;
  });

  doc.save("task-tracker.pdf");
}

function handleSort(key) {
  // Prevent status sort in completed tab
  if (currentView === "completed" && key === "status") return;

  if (sortConfig.key === key) {
    sortConfig.direction =
      sortConfig.direction === "asc" ? "desc" : "asc";
  } else {
    sortConfig.key = key;
    sortConfig.direction = "asc";
  }

  currentPage = 1;
  renderTasks();
  updateSortIcons();
  updateDisabledSortState();
}

function updateSortIcons() {
  const columns = ["title", "priority", "deadline", "urgency", "status"];

  columns.forEach(col => {
    const el = document.getElementById(`sort-${col}`);
    if (!el) return;

    // hide status sort in completed tab
    if (currentView === "completed" && col === "status") {
      el.textContent = "";
      return;
    }

    if (sortConfig.key === col) {
      el.textContent = sortConfig.direction === "asc" ? "↑" : "↓";
      el.classList.add("active");
    } else {
      el.textContent = "↕";
      el.classList.remove("active");
    }
  });
}

function updateDisabledSortState() {
  document.querySelectorAll("th").forEach(th => {
    th.classList.remove("disabled-sort");
  });

  if (currentView === "completed") {
    document
      .querySelector("th[onclick*='status']")
      ?.classList.add("disabled-sort");
  }
}