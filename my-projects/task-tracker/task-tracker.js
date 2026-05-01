let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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