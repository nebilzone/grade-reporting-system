const tabBtnContainer = document.querySelector(".tabBtncontainer");
const mainTab = document.querySelector(".main-tabs");
const subTab = document.querySelector(".sub-tabs");
const tableContiner = document.querySelector(".tableContainer");
const mainTabBtn = document.querySelectorAll(".maintabBtn");
const subTabBtn = document.querySelectorAll(".subtabBtn");

async function fetchingTeacherSubmission(status) {
  const res = await fetch("http://localhost:3000/teacherSubmissions");

  const json = await res.json();
  return json.filter((item) => item.status == status);
}
let activeMainTab = null;

mainTab.addEventListener("click", function (e) {
  e.preventDefault();

  tableContiner.innerHTML = "";
  mainTabBtn.forEach((btn) => btn.classList.remove("active"));

  const event = e.target.closest("button");
  activeMainTab = event.dataset.id;
  console.log(activeMainTab);
  event.classList.add("active");
  if (!event) return;
  subTab.style.display = "block";
});

subTab.addEventListener("click", async function (e) {
  subTabBtn.forEach((btn) => btn.classList.remove("active"));
  const button = e.target.closest("button");
  if (!button) return;
  tableContiner.innerHTML = "";
  button.classList.add("active");

  const btnId = button.dataset.id;
  let fetchingTeacher = await fetchingTeacherSubmission("pending");

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

  if (activeMainTab === "appBtn") {
    let freshTeacher = [];
    let departementTeacher = [];
    if (btnId == "freshman") {
      freshTeacher = fetchingTeacher.filter(
        (item) => item.departmentId === null,
      );

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
          await fetch(
            `http://localhost:3000/teacherSubmissions/${teacher.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "approved" }),
            },
          );
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
  }else if(activeMainTab === "assignBtn"){
      let fetchingTeacher = await fetchingTeacherSubmission("approved");

     let freshTeacher = [];
    let departementTeacher = [];
if (btnId == "freshman") {
      freshTeacher = fetchingTeacher.filter(
        (item) => item.departmentId === null
      );

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
        approveBtn.textContent = "assign";

        // const rejectBtn = document.createElement("button");
        // rejectBtn.textContent = "reject";
        approveBtn.addEventListener("click", async function (e) {
          e.preventDefault();
          await fetch(
            `http://localhost:3000/teacherSubmissions/${teacher.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "approved" }),
            },
          );
        });
        tr.append(approveBtn);
        table.append(tr);
      }
    } else {
      departementTeacher = fetchingTeacher.filter(
        (item) => item.departmentId !== null &&item.status==='active',
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
        // approveBtn.textContent = "aprove";
        // const rejectBtn = document.createElement("button");
        // rejectBtn.textContent = "reject";
        approveBtn.addEventListener("click", function (e) {
          e.preventDefault();
          console.log("neba");
        });
        tr.append(approveBtn);
        table.append(tr);
      }
    }
    tableContiner.append(table);  }
});
