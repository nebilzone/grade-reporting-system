const sidebar = document.querySelector("#sidebarContainer");

async function fetchingSidebar() {
  const response = await fetch("sidebar.html");
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
    console.log("nebil");
    box.classList.toggle("translate-x-4");
    document.documentElement.classList.toggle("dark");
  });
}
display();
