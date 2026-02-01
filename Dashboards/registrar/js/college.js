const newDepartementFormBtn = document.querySelector(".newCollegeFormBtn");
const newDepartementForm = document.querySelector(".newCollegeForm");
const overlay = document.querySelector(".overlay");
const backBtn = document.querySelector(".backBtn");
newDepartementFormBtn.addEventListener("click", function () {
  newDepartementForm.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});
backBtn.addEventListener("click", function (e) {
  e.preventDefault();
  newDepartementForm.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});
