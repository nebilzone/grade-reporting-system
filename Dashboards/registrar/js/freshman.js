const freshmanContainer = document.querySelector(".freshcontainer");
const tablecontainer = document.querySelector(".tableContainer");
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
  tablecontainer.innerHTML = "";
  const event = e.target.closest("button");
  const table = document.createElement("table");

  if (!event) return;
  const deptId = event.dataset.id;
  const dataType = event.dataset.type;
  if (dataType === "students") {
    table.innerHTML = `
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Email</th>
        <th>Gender</th>
        <th>Track</th>
        <th>Batch</th>
        <th>Semester</th>
        <th>Status</th>
        <th>Section</th>
      </tr>
    `;
    const students = await fetchingStudents(deptId);
    for (const student of students) {
      const tr = document.createElement("tr");
      for (const data in student) {
        if (data == "level" || data === "year" || data == "password") {
          continue;
        }
        const td = document.createElement("td");
        td.textContent = student[data];
        tr.append(td);
      }
      table.append(tr);
    }
    // console.log(students);
  } else if (dataType === "courses") {
    table.innerHTML = `
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Level</th>
        <th>Track</th>
        <th>Semester</th>
        <th>credit</th>

      </tr>
    `;
    const courses = await fetchingCourse(deptId);
    for (const course of courses) {
      const tr = document.createElement("tr");
      for (const data in course) {
        if (data == "active") {
          continue;
        }
        const td = document.createElement("td");
        td.textContent = course[data];
        tr.append(td);
      }
      table.append(tr);
    }
  }
  tablecontainer.append(table);
});
