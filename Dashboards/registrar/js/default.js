const sidebar=document.querySelector('.sidebarContainer')
async function fetchingSidebar() {
  try {
    let result = await fetch("/components/sidebar.html");
    let solution = await result.text();
    sidebar.innerHTML=solution;
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
fetchingSidebar();
