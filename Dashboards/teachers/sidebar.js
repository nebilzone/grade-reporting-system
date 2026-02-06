const sidebar=document.querySelector('.sidebarContainer');
async function fetchingSidebar(){
    const response=await fetch('sidebar.html');
    const json =await response.text();
    sidebar.innerHTML=json;
    console.log(json)
}
fetchingSidebar();
