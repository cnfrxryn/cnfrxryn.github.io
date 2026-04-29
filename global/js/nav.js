document.addEventListener("DOMContentLoaded", () => {
  fetch("/global/nav.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("nav-container").innerHTML = data;
    });
});

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const hamburger = document.getElementById("hamburger");

  menu.classList.toggle("active");

  // Change icon
  if (menu.classList.contains("active")) {
    hamburger.innerHTML = "✕";
  } else {
    hamburger.innerHTML = "☰";
  }
}

function toggleProjects() {
  const submenu = document.getElementById("projectsSubmenu");
  submenu.classList.toggle("active");
}