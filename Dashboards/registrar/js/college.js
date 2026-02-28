const collegeContainer = document.querySelector("#collageBtnContainer");
const departementContainer = document.querySelector("#departementContainer");
const yearContainer = document.querySelector("#yearContainer");
const semesterContainer = document.querySelector("#semesterContainer");
const tableContainer = document.querySelector("#tableContainer");

let courses = [];
let currentCollege = null;
let currentDepartment = null;
let currentYear = null;
let currentSemester = null;

let activeDepartmentBtn = null;
let activeYearBtn = null;
let activeSemesterBtn = null;


async function fetchingCollege() {
  const res = await fetch("http://localhost:3000/colleges");
  const json = await res.json();
  return json.filter((c) => c.status === "active");
}

async function fetchinDepartement(collegeId) {
  const res = await fetch("http://localhost:3000/departments");
  const json = await res.json();
  return json.filter((d) => d.collegeId == collegeId);
}

async function fetchingCourse() {
  const res = await fetch("http://localhost:3000/courses");
  const json = await res.json();
  return json.filter((c) => c.active);
}


function createButton(text, withArrow = false) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className =
    "bg-blue-200 hover:bg-blue-300 transition rounded px-4 py-3 min-w-[180px] text-left flex justify-between items-center";

  if (withArrow) {
    btn.innerHTML = `
      <span>${text}</span>
      <span class="arrow">▶</span>
    `;
  } else {
    btn.textContent = text;
  }

  return btn;
}


function clearBelow(level) {
  if (level === "college") {
    departementContainer.innerHTML = "";
    yearContainer.innerHTML = "";
    semesterContainer.innerHTML = "";
    tableContainer.innerHTML = "";
    activeDepartmentBtn = null;
    activeYearBtn = null;
    activeSemesterBtn = null;
  }

  if (level === "department") {
    yearContainer.innerHTML = "";
    semesterContainer.innerHTML = "";
    tableContainer.innerHTML = "";
    activeYearBtn = null;
    activeSemesterBtn = null;
  }

  if (level === "year") {
    semesterContainer.innerHTML = "";
    tableContainer.innerHTML = "";
    activeSemesterBtn = null;
  }

  if (level === "semester") {
    tableContainer.innerHTML = "";
  }
}


async function displayCollege() {
  const colleges = await fetchingCollege();
  collegeContainer.innerHTML = "";

  colleges.forEach((college) => {
    const btn = createButton(`College of ${college.collegeID}`);
    btn.dataset.id = college.collegeID;
    collegeContainer.append(btn);
  });
}

displayCollege();


collegeContainer.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  currentCollege = btn.dataset.id;
  clearBelow("college");

  const depts = await fetchinDepartement(currentCollege);

  depts.forEach((dept) => {
    const deptBtn = createButton(dept.name, true);
    deptBtn.dataset.id = dept.departementId;
    departementContainer.append(deptBtn);
  });
});


departementContainer.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (activeDepartmentBtn && activeDepartmentBtn !== btn) {
    activeDepartmentBtn.querySelector(".arrow").textContent = "▶";
  }

  const arrow = btn.querySelector(".arrow");
  const isOpen = arrow.textContent === "▼";

  clearBelow("department");

  if (isOpen) {
    arrow.textContent = "▶";
    activeDepartmentBtn = null;
    return;
  }

  arrow.textContent = "▼";
  activeDepartmentBtn = btn;

  currentDepartment = btn.dataset.id;
  courses = await fetchingCourse();

  const years = [
    ...new Set(
      courses
        .filter((c) => c.departementId == currentDepartment)
        .map((c) => c.year)
    ),
  ];

  years.forEach((year) => {
    const yearBtn = createButton(`Year ${year}`, true);
    yearBtn.dataset.year = year;
    yearContainer.append(yearBtn);
  });
});


yearContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (activeYearBtn && activeYearBtn !== btn) {
    activeYearBtn.querySelector(".arrow").textContent = "▶";
  }

  const arrow = btn.querySelector(".arrow");
  const isOpen = arrow.textContent === "▼";

  clearBelow("year");

  if (isOpen) {
    arrow.textContent = "▶";
    activeYearBtn = null;
    return;
  }

  arrow.textContent = "▼";
  activeYearBtn = btn;

  currentYear = btn.dataset.year;

  const semesters = [
    ...new Set(
      courses
        .filter(
          (c) =>
            c.departementId == currentDepartment &&
            c.year == currentYear
        )
        .map((c) => c.semester)
    ),
  ];

  semesters.forEach((sem) => {
    const semBtn = createButton(`Semester ${sem}`, true);
    semBtn.dataset.semester = sem;
    semesterContainer.append(semBtn);
  });
});


semesterContainer.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (activeSemesterBtn && activeSemesterBtn !== btn) {
    activeSemesterBtn.querySelector(".arrow").textContent = "▶";
  }

  const arrow = btn.querySelector(".arrow");
  const isOpen = arrow.textContent === "▼";

  clearBelow("semester");

  if (isOpen) {
    arrow.textContent = "▶";
    activeSemesterBtn = null;
    return;
  }

  arrow.textContent = "▼";
  activeSemesterBtn = btn;

  currentSemester = btn.dataset.semester;

  const filtered = courses.filter(
    (c) =>
      c.departementId == currentDepartment &&
      c.year == currentYear &&
      c.semester == currentSemester
  );

  createTable(filtered);
});


function createTable(filtered) {
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className =
    "w-full border border-gray-300 text-sm bg-white shadow rounded mt-4";

  table.innerHTML = `
    <thead class="bg-gray-100">
      <tr>
        <th class="border p-2">Course</th>
        <th class="border p-2">Code</th>
        <th class="border p-2">Credit</th>
        <th class="border p-2">Action</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  filtered.forEach((course) => {
    const tr = document.createElement("tr");
    tr.dataset.id = course.id;

    tr.innerHTML = `
      <td class="border p-2">${course.name}</td>
      <td class="border p-2">${course.code}</td>
      <td class="border p-2">${course.credit}</td>
      <td class="border p-2 flex gap-2">
        <button class="editBtn bg-green-200 hover:bg-green-300 px-2 py-1 rounded">
          Edit
        </button>
        <button class="removeBtn bg-red-200 hover:bg-red-300 px-2 py-1 rounded">
          Remove
        </button>
      </td>
    `;

    tbody.append(tr);
  });

  table.append(tbody);
  tableContainer.append(table);

  table.addEventListener("click", async function (e) {
    const removeBtn = e.target.closest(".removeBtn");
    const editBtn = e.target.closest(".editBtn");
    const saveBtn = e.target.closest(".saveBtn");

    if (removeBtn) {
      const row = removeBtn.closest("tr");
      const courseId = row.dataset.id;

      row.remove();

      await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });
    }

    if (editBtn) {
      const row = editBtn.closest("tr");
      if (row.classList.contains("editing")) return;
      row.classList.add("editing");

      const cells = row.querySelectorAll("td");

      cells[0].innerHTML = `<input class="border p-1 w-full rounded" value="${cells[0].textContent}">`;
      cells[1].innerHTML = `<input class="border p-1 w-full rounded" value="${cells[1].textContent}">`;
      cells[2].innerHTML = `<input class="border p-1 w-full rounded" value="${cells[2].textContent}">`;

      editBtn.textContent = "Save";
      editBtn.classList.remove("editBtn", "bg-green-200");
      editBtn.classList.add("saveBtn", "bg-blue-200");
    }

    if (saveBtn) {
      const row = saveBtn.closest("tr");
      const courseId = row.dataset.id;
      const cells = row.querySelectorAll("td");

      const editedCourse = {
        name: cells[0].querySelector("input").value,
        code: cells[1].querySelector("input").value,
        credit: cells[2].querySelector("input").value,
      };

      await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCourse),
      });

      cells[0].textContent = editedCourse.name;
      cells[1].textContent = editedCourse.code;
      cells[2].textContent = editedCourse.credit;

      row.classList.remove("editing");

      saveBtn.textContent = "Edit";
      saveBtn.classList.remove("saveBtn", "bg-blue-200");
      saveBtn.classList.add("editBtn", "bg-green-200");
    }
  });
}
