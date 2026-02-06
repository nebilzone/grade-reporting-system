const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "students") {
  window.location.href = "../../login.html";
}
