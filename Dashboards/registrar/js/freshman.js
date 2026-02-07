const freshmanContainer = document.querySelector(".freshcontainer");
async function fetchingStudents(deptId) {
  const res = await fetch("http://localhost:3000/students");
  const json = await res.json();
  return json.filter((item) => item.track === deptId);
}
async function fetchingCourse(deptId) {
  const res = await fetch("http://localhost:3000/courses");
  const json = await res.json();
  return json.filter((item) => item.track === deptId || item.track == "ALL");
}
freshmanContainer.addEventListener("click", async function (e) {
  e.preventDefault();
  const event = e.target.closest("button");
  if (!event) return;
  const deptId = event.dataset.id;
  const dataType = event.dataset.type;
  if (dataType === "students") {
    const students = await fetchingStudents(deptId);
    console.log(students);
  }else if(dataType === "courses"){

      const courses = await fetchingCourse(deptId);
      console.log(courses)
  }
});
