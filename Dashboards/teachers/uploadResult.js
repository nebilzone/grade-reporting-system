const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "teachers") {
  window.location.href = "../../index.html";
}
console.log(currentUser)
function convertCSV() {
  const file = document.getElementById("fileInput").files[0];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log(results.data);
      document.getElementById("output").textContent = JSON.stringify(
        results.data,
        null,
        2,
      );
    },
  });
}
async function fetchingTeacher() {
  const teacherAssignment = await fetch(
    "http://localhost:3000/teacherAssignments",
  );
const teachers=await teacherAssignment.json();
  return teachers.filter(item=>item.teacherId===currentUser.id)
}
async function display(){
  const neba = await fetchingTeacher();
console.log(neba);
}
display()
