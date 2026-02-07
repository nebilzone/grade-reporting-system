const tabBtnContainer = document.querySelector(".tabBtncontainer");
const tableContiner = document.querySelector(".tableContainer");
async function fetchingTeacherSubmission() {
  const res = await fetch("http://localhost:3000/teacherSubmissions");

   const json=await res.json();
    return json.filter(item=>item.status=='pending')
}
tabBtnContainer.addEventListener("click", async function (e) {
  const button = e.target.closest("button");
  tableContiner.innerHTML = "";
  btnId = button.dataset.id;
  let fetchingTeacher = await fetchingTeacherSubmission();
  let freshTeacher = [];
  let departementTeacher = [];
  const table = document.createElement("table");
  table.innerHTML = `
      <tr>
        <th>teacherId</th>
        <th>departmentId</th>
        <th>year</th>
        <th>courseId</th>
         <th>semester</th>
          <th>submittedAt</th>
          <th>status</th>
                    <th>action</th>


      </tr>
    `;

  if (btnId == "freshman") {
    freshTeacher = fetchingTeacher.filter((item) => item.departmentId === null);

    for (const teacher of freshTeacher) {
      const tr = document.createElement("tr");
      for (const data in teacher) {
        if (data == "id") {
          continue;
        }
        if (data == "departmentId") {
          const td = document.createElement("td");
          td.textContent = "Freshman";
          tr.append(td);
          continue;
        }
        const td = document.createElement("td");
        td.textContent = teacher[data];
        tr.append(td);
      }
      const approveBtn = document.createElement("button");
      approveBtn.textContent = "aprove";
      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "reject";
      approveBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        await fetch(`http://localhost:3000/teacherSubmissions/${teacher.id}`,{
            method:'PATCH',
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({status:'approved'})
        })
      });
      tr.append(approveBtn, rejectBtn);
      table.append(tr);
    }
  } else {
    departementTeacher = fetchingTeacher.filter(
      (item) => item.departmentId !== null,
    );
    for (const teacher of departementTeacher) {
      const tr = document.createElement("tr");
      for (const data in teacher) {
        if (data == "id") {
          continue;
        }
        const td = document.createElement("td");
        td.textContent = teacher[data];
        tr.append(td);
        console.log(teacher[data]);
      }
      const approveBtn = document.createElement("button");
      approveBtn.textContent = "aprove";
      const rejectBtn = document.createElement("button");
      rejectBtn.textContent = "reject";
      approveBtn.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("neba");
      });
      tr.append(approveBtn, rejectBtn);
      table.append(tr);
    }
  }
  tableContiner.append(table);
});
