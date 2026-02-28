const tabBtnContainer = document.querySelector("#tabBtncontainer");
const mainTab = document.querySelector(".main-tabs");
const subTab = document.querySelector(".sub-tabs");
const tableContiner = document.querySelector("#tableContainer");
const mainTabBtn = document.querySelectorAll("#maintabBtn");
const subTabBtn = document.querySelectorAll("#subtabBtn");

async function fetchingTeacherSubmission(status) {
  const res = await fetch("http://localhost:3000/teacherSubmissions");

  const json = await res.json();
  return json.filter((item) => item.status == status);
}

async function fetchingSection(teacher) {
  const res = await fetch("http://localhost:3000/students");

  const json = await res.json();
  if (teacher.startsWith("FRESH-COM")) {
    return json.filter((item) => item.section);
  } else if (teacher.startsWith("FRESH-NAT")) {
    return json.filter((item) => item.section.startsWith("FN"));
  } else if (teacher.startsWith("FRESH-SOC")) {
    return json.filter((item) => item.section.startsWith("FS"));
  }
}

async function fetchAssignedSections(teacherId) {
  const res = await fetch("http://localhost:3000/teacherAssignments");
  const json = await res.json();
  return json.filter((item) => item.teacherId === teacherId);
}

let activeMainTab = null;

mainTab.addEventListener("click", function (e) {
  e.preventDefault();

  tableContiner.innerHTML = "";
  mainTabBtn.forEach((btn) => btn.classList.remove("active"));

  const event = e.target.closest("button");
  activeMainTab = event.dataset.id;
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
      <tr class="bg-blue-100 text-blue-950">
        <th class="text-start py-1 pl-2 lg:pl-0">teacherId</th>
        <th class="text-start py-1 pl-2 lg:pl-0">departmentId</th>
        <th class="text-start py-1 pl-2 lg:pl-0">year</th>
        <th class="text-start py-1 pl-2 lg:pl-0">courseId</th>
        <th class="text-start py-1 pl-2 lg:pl-0">semester</th>
        <th class="text-start py-1 pl-2 lg:pl-0">submittedAt</th>
        <th class="text-start py-1 pl-2 lg:pl-0">status</th>
        <th class="text-start py-1 pl-2 lg:pl-0">action</th>
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
        tr.className =
          "text-blue-950 border-b border-[#c1babaff] w-full bg-[#f3f4f6] ";
        for (const data in teacher) {
          if (data == "id") {
            continue;
          }
          if (data == "departmentId") {
            const td = document.createElement("td");
            td.className = "pl-2 text-nowrap lg:pl-0";

            td.textContent = "Freshman";
            tr.append(td);
            continue;
          }
          const td = document.createElement("td");
          td.className = "pl-2 text-nowrap lg:pl-0";

          td.textContent = teacher[data];
          tr.append(td);
        }
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "aprove";
        approveBtn.className = "pl-3 lg:pl-0";
        const rejectBtn = document.createElement("button");
        rejectBtn.className = "pl-3 lg:pl-0";

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
        tr.className = "text-nowrap";

        tr.append(approveBtn, rejectBtn);
        table.append(tr);
      }
    } else {
      departementTeacher = fetchingTeacher.filter(
        (item) => item.departmentId !== null,
      );
      for (const teacher of departementTeacher) {
        const tr = document.createElement("tr");
        tr.className =
          "text-blue-950 border-b border-[#c1babaff] w-full bg-[#f3f4f6] ";
        for (const data in teacher) {
          if (data == "id") {
            continue;
          }
          const td = document.createElement("td");
          td.className = "pl-2 text-nowrap lg:pl-0";

          td.textContent = teacher[data];
          tr.append(td);
        }
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "aprove";
        approveBtn.className = "pl-3 lg:pl-0";

        const rejectBtn = document.createElement("button");
        rejectBtn.className = "pl-3 lg:pl-0";

        rejectBtn.textContent = "reject";
        approveBtn.addEventListener("click", function (e) {
          e.preventDefault();
        });
                        tr.className="text-nowrap"

        tr.append(approveBtn, rejectBtn);
        table.append(tr);
      }
    }
    tableContiner.append(table);
  } else if (activeMainTab === "assignBtn") {
    let fetchingTeacher = await fetchingTeacherSubmission("approved");

    let freshTeacher = [];
    let departementTeacher = [];
    if (btnId == "freshman") {
      freshTeacher = fetchingTeacher.filter(
        (item) => item.departmentId === null,
      );

      for (const teacher of freshTeacher) {
        const tr = document.createElement("tr");
        tr.className =
          "text-blue-950 border-b border-[#c1babaff] w-full bg-[#f3f4f6] ";
        for (const data in teacher) {
          if (data == "id") {
            continue;
          }
          if (data == "departmentId") {
            const td = document.createElement("td");
            td.className = "pl-2 text-nowrap lg:pl-0";

            td.textContent = "Freshman";
            tr.append(td);
            continue;
          }
          const td = document.createElement("td");
          td.className = "pl-2 text-nowrap lg:pl-0";

          td.textContent = teacher[data];
          tr.append(td);
        }
        const assignBtn = document.createElement("button");
                        assignBtn.className="ml-3 px-2  rounded-sm bg-green-200 lg:ml-0 "

        assignBtn.textContent = "assign";
        tr.append(assignBtn);

        const sectionAssign = new Set();
        assignBtn.addEventListener("click", async function (e) {
          e.preventDefault();
          if (tr.querySelector("select")) return;

          const sections = await fetchingSection(teacher.courseId);
          const assigned = await fetchAssignedSections(teacher.teacherId);

          const assignedSet = new Set(assigned.map((item) => item.section));

          const select = document.createElement("select");
          select.multiple = true;
          select.style.minWidth = "50px";

          const uniqueSections = new Set();

          for (const student of sections) {
            if (!uniqueSections.has(student.section)) {
              uniqueSections.add(student.section);

              const option = document.createElement("option");
              option.value = student.section;
              option.textContent = student.section;

              if (assignedSet.has(student.section)) {
                option.disabled = true;
                option.textContent += " (assigned)";
              }

              select.append(option);
            }
          }

          const saveBtn = document.createElement("button");
          saveBtn.textContent = "Save";

          saveBtn.addEventListener("click", async () => {
            const selected = [...select.selectedOptions].map((o) => o.value);
            for (const section of selected) {
              await fetch("http://localhost:3000/teacherAssignments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  teacherId: teacher.teacherId,
                  courseId: teacher.courseId,
                  section: section,
                  year: teacher.year,
                  semester: teacher.semester,
                }),
              });
            }

            alert("Assigned successfully");
            select.remove();
            saveBtn.remove();
          });

          tr.append(select, saveBtn);
        });

        table.append(tr);
      }
    } else {
      departementTeacher = fetchingTeacher.filter(
        (item) => item.departmentId !== null && item.status === "active",
      );
      for (const teacher of departementTeacher) {
        const tr = document.createElement("tr");
        tr.className =
          "text-blue-950 border-b border-[#c1babaff] w-full bg-[#f3f4f6] ";
        for (const data in teacher) {
          if (data == "id") {
            continue;
          }
          const td = document.createElement("td");
          td.className = "pl-2 text-nowrap lg:pl-0";

          td.textContent = teacher[data];
          tr.append(td);
        }
        const assignBtn = document.createElement("button");
                assignBtn.className="pl-3 lg:pl-0"

        assignBtn.addEventListener("click", function (e) {
          e.preventDefault();
        });
        tr.append(assignBtn);
        table.append(tr);
      }
    }
    tableContiner.append(table);
  }
});
