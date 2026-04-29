document.addEventListener("DOMContentLoaded", () => {
  fetch("/global/nav.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("nav-container").innerHTML = data;

      // ✅ FIX: allow submenu links to work
      const submenuLinks = document.querySelectorAll(".projects-submenu a");

      submenuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      });
    });
});

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  const hamburger = document.getElementById("hamburger");

  menu.classList.toggle("active");

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