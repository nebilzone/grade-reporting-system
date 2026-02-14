const currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log(currentUser);
if (!currentUser || currentUser.role !== "teachers") {
  window.location.href = "../../index.html";
}
const tableContainer = document.querySelector(".tableContainer");

async function fetchingTeacherAsignment() {
  const res = await fetch("http://localhost:3000/teacherAssignments");
  const json = await res.json();
  return json.filter((item) => item.teacherId === currentUser.id);
}
async function fetchingCourses(courseId) {
  const res = await fetch("http://localhost:3000/courses");

  const json = await res.json();
  return json.filter((item) => item.id === courseId);
}
async function display() {
  const neba = await fetchingTeacherAsignment();
  const table = document.createElement("table");
table.innerHTML=`
<tr>
<th>Course Name</th>
<th>Course Id</th>
<th>Section</th>
<th>Year</th>
<th>Semester</th>
</tr>`
  let courses = [];

  for (const course of neba) {
    const tr = document.createElement("tr");
    courses = await fetchingCourses(course.courseId);

    for (const data of courses) {
      const td = document.createElement("td");
      td.textContent = data.name;
      tr.append(td);
    }
    for (const data in course) {
      if (data === "id" || data === "teacherId") {
        continue;
      }
      const td = document.createElement("td");
      td.textContent = course[data];
      tr.append(td);
    }
    table.append(tr);
  }
  tableContainer.append(table);
}

display();
