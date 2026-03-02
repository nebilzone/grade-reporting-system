document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
// Whenever the user explicitly chooses light mode
localStorage.theme = "light";
// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";
// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");

const sidebar = document.querySelector("#sidebarContainer");

async function fetchingSidebar() {
  const response = await fetch("/components/sidebar.html");
  const json = await response.text();
  sidebar.innerHTML = json;
  return json;
}

async function display() {
  await fetchingSidebar();
  const mode = document.querySelector("#mode");
  const box = document.querySelector("#box");

  mode.addEventListener("click", function (e) {
    e.preventDefault();
    box.classList.toggle("translate-x-4");
    document.documentElement.classList.toggle("dark");
  });
}
display();
