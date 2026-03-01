const freshmanContainer = document.querySelector("#freshcontainer");
const tablecontainer = document.querySelector("#tableContainer");
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
  table.className =
    "w-full  border-spacing-x-2 md:border-spacing-y-0 cursor-pointer";

  if (!event) return;
  const deptId = event.dataset.id;
  const dataType = event.dataset.type;
  if (dataType === "students") {
    table.innerHTML = `
      <tr class="bg-blue-100 text-blue-950 ">
        <th class="text-start py-1 pl-2 md:pl-0">Id</th>
        <th class="text-start pl-2 md:pl-0">Name</th>
        <th class="text-start pl-2 md:pl-0">Email</th>
        <th class="text-start pl-2 md:pl-0">Gender</th>
        <th class="text-start pl-2 md:pl-0">Track</th>
        <th class="text-start pl-2 md:pl-0">Batch</th>
        <th class="text-start pl-2 md:pl-0">Semester</th>
        <th class="text-start pl-2 md:pl-0">Status</th>
        <th class="text-start pl-2 md:pl-0">Section</th>
      </tr>
    `;
    const students = await fetchingStudents(deptId);
    for (const student of students) {
      const tr = document.createElement("tr");
      tr.className = "text-blue-950 border-b border-[#c1babaff]  w-full ";
      for (const data in student) {
        if (data == "level" || data === "year" || data == "password") {
          continue;
        }
        const td = document.createElement("td");
        td.className = "pl-2 text-nowrap md:pl-0";
        td.textContent = student[data];
        tr.append(td);
      }
      table.append(tr);
    }
    // console.log(students);
  } else if (dataType === "courses") {
    table.innerHTML = `
      <tr class="bg-blue-100 text-blue-950 ">
        <th class="text-start py-1 pl-2 md:pl-0">Id</th>
        <th class="text-start py-1 pl-2 md:pl-0">Name</th>
        <th class="text-start py-1 pl-2 md:pl-0">Level</th>
        <th class="text-start py-1 pl-2 md:pl-0">Track</th>
        <th class="text-start py-1 pl-2 md:pl-0">Semester</th>
        <th class="text-start py-1 pl-2 md:pl-0">credit</th>

      </tr>
    `;
    const courses = await fetchingCourse(deptId);
    for (const course of courses) {
      const tr = document.createElement("tr");
      tr.className = "text-blue-950 border-b border-[#c1babaff] w-full  ";
      for (const data in course) {
        if (data == "active") {
          continue;
        }
        const td = document.createElement("td");
        td.className = "pl-2 text-nowrap md:pl-0";

        td.textContent = course[data];
        tr.append(td);
      }
      table.append(tr);
    }
  }
  tablecontainer.append(table);
});
