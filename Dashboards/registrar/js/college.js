const newCollegeFormBtn = document.querySelector(".newCollegeFormBtn");
const newCollegeForm = document.querySelector(".newCollegeForm");

const overlay = document.querySelector(".overlay");
const backBtn = document.querySelector(".backBtn");

const collegeNameContainer = document.querySelector(".collegeName");
const collegeIdContainer = document.querySelector(".collegeIdContainer");

const collegeContainer = document.querySelector(".collageBtnContainer");
const departementContainer = document.querySelector(".departementContainer");
const addingCollegeForm = document.querySelector(".addingCourseForm");

const yearBtn = document.querySelectorAll(".yearOfDept");
newCollegeFormBtn.addEventListener("click", function () {
  document.querySelector("#collegeName").value = "";
  document.querySelector("#collegeId").value = "";

  newCollegeForm.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});
backBtn.addEventListener("click", function (e) {
  e.preventDefault();
  newCollegeForm.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});

async function collegeNameValidation(name) {
  // const fristChar = name.slice(0, 1);
  const err = document.createElement("p");
  document
    .querySelector("#collegeName")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  // if (
  //   !/^[A-Za-z\s]+$/.test(name)

  // ) {
  //   err.textContent = "Please insert Valid College Name";
  //   err.style.color = "red";
  //   collegeNameContainer.append(err);
  //   return false;
  // } else {
  return name;
}
async function collegeIDValidation(id) {
  const err = document.createElement("p");
  document
    .querySelector("#collegeId")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (
    !/^[A-Za-z\s]+$/.test(id) ||
    id.length < 2 ||
    id.length > 6 ||
    id !== id.toUpperCase()
  ) {
    err.textContent = "Please insert Valid College Id";
    err.style.color = "red";
    collegeIdContainer.append(err);
    return false;
  } else {
    return id;
  }
}
addingCollegeForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const event = e.target;
  const collegeName = await collegeNameValidation(event.collegeName.value);
  const collegeID = await collegeIDValidation(event.collegeId.value);
  const college = {
    name: collegeName,
    collegeID: collegeID,
    status: event.status.value,
  };

  if (collegeName && collegeID) {
    await fetch("http://localhost:3000/colleges", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(college),
    });
    alert("Application submitted successfully!");
  }
});

async function fetchingCollege() {
  const response = await fetch("http://localhost:3000/colleges");
  const json = await response.json();
  return json.filter((item) => item.status === "active");
}
async function fetchinDepartement(id) {
  const response = await fetch("http://localhost:3000/departments");
  const json = await response.json();
  return json.filter((item) => item.collegeId == id);
}

const customMenu = document.createElement("div");
customMenu.id = "customMenu";
customMenu.style =
  "display:none; position:absolute; background:#fff; border:1px solid #ccc; padding:5px; border-radius:5px; z-index:1000;";
customMenu.innerHTML = `
  <div id="removeOption" style="cursor:pointer; padding:4px; ">Remove</div>
  <div id="cancelOption" style="cursor:pointer; padding:4px;">Cancel</div>
`;
document.body.appendChild(customMenu);

let currentButton = null;

document.addEventListener("click", function (e) {
  if (!customMenu.contains(e.target)) {
    customMenu.style.display = "none";
    currentButton = null;
  }
});

customMenu
  .querySelector("#removeOption")
  .addEventListener("click", async function () {
    const colleges = await fetchingCollege();
    if (currentButton) {
      const colleges = await fetchingCollege();
      const college = colleges.find(
        (c) => c.collegeID === currentButton.dataset.id,
      );
      if (!college) return;

      await fetch(`http://localhost:3000/colleges/${college.id}`, {
        // numeric id
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "inactive" }),
      });

      customMenu.style.display = "none";
      currentButton = null;
      console.log(colleges);
    }
  });

customMenu
  .querySelector("#cancelOption")
  .addEventListener("click", function () {
    customMenu.style.display = "none";
    currentButton = null;
  });

function attachRightClickToButtons() {
  const collegeTabBtn = document.querySelectorAll(".tab-btn");
  collegeTabBtn.forEach((button) => {
    if (!button.dataset.rightClickAttached) {
      button.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        currentButton = button;
        customMenu.style.top = e.pageY + "px";
        customMenu.style.left = e.pageX + "px";
        customMenu.style.display = "block";
      });
      button.dataset.rightClickAttached = "true";
    }
  });
}

collegeContainer.addEventListener("click", async function (e) {
  const event = e.target.closest("button");
  if (!event) return;
  attachRightClickToButtons();

  const collegeTabBtn = document.querySelectorAll(".tab-btn");
  collegeTabBtn.forEach((b) => b.classList.remove("active"));
  event.classList.add("active");

  departementContainer.innerHTML = "";
  const departements = await fetchinDepartement(event.dataset.id);
  for (const eachDepartement of departements) {
    for (const departement in eachDepartement) {
      if (departement === "name") {
        const buttons = document.createElement("button");
        buttons.textContent = `▶ ${eachDepartement[departement]}`;
        buttons.type = "button";
        buttons.dataset.id = eachDepartement.departementId;
        departementContainer.append(buttons);
      }
    }
  }
});

async function fetchingCourse() {
  const response = await fetch("http://localhost:3000/courses");
  const courses = await response.json();
  return courses.filter((item) => item.active);
}

let lastDepartementClicked = null;
let lastYearBtn = null;
let lastSemesterBtn = null;
let courses = [];

departementContainer.addEventListener("click", async function (e) {
  e.preventDefault();
  const deptBtn = e.target.closest("button[data-id]");
  const yearBtn = e.target.closest(".yearOfDept");
  const semBtn = e.target.closest(".semOfDept");
  if (deptBtn && !yearBtn && !semBtn) {
    const deptId = deptBtn.dataset.id;
    courses = await fetchingCourse();

    if (lastDepartementClicked === deptBtn) {
      deptBtn.querySelectorAll(".yearOfDept").forEach((e) => e.remove());
      lastDepartementClicked = null;
      lastYearBtn = null;
      lastSemesterBtn = null;
      return;
    }

    if (lastDepartementClicked) {
      lastDepartementClicked
        .querySelectorAll(".yearOfDept")
        .forEach((btn) => btn.remove());
    }

    addingYear(deptBtn, deptId);
    lastDepartementClicked = deptBtn;
    return;
  }
  if (yearBtn && !semBtn) {
    e.stopPropagation();
    const deptBtn = yearBtn.closest("button[data-id]");

    const deptId = deptBtn.dataset.id;
    const year = yearBtn.dataset.year;
    const opened = yearBtn.querySelector(".semOfDept");
    if (lastYearBtn && lastYearBtn !== yearBtn) {
      lastYearBtn.querySelectorAll(".semOfDept").forEach((btn) => btn.remove());
      lastYearBtn.textContent = `▶ Year ${lastYearBtn.dataset.year}`;
    }

    if (opened) {
      yearBtn.querySelectorAll(".semOfDept").forEach((btn) => btn.remove());
      yearBtn.textContent = `▶ Year ${year}`;
      lastYearBtn = null;
      lastSemesterBtn = null;
      return;
    }

    yearBtn.textContent = `▼ Year ${year}`;

    const addedSemesters = new Set();

    courses.forEach((course) => {
      if (
        course.departementId == deptId &&
        course.year == year &&
        !addedSemesters.has(course.semester)
      ) {
        const sem = document.createElement("button");
        sem.textContent = `▶ Semester ${course.semester}`;
        sem.className = "semOfDept";
        sem.dataset.semester = course.semester;
        yearBtn.append(sem);
        addedSemesters.add(course.semester);
      }
    });
    lastYearBtn = yearBtn;
    lastSemesterBtn = null;
  }
  if (semBtn) {
    e.stopPropagation();
    const depBtn = semBtn.closest("button[data-id]");
    const yearBtn = semBtn.closest(".yearOfDept");
    const deptId = depBtn.dataset.id;
    const year = yearBtn.dataset.year;
    const semester = semBtn.dataset.semester;

    if (lastSemesterBtn && lastSemesterBtn !== semBtn) {
      lastSemesterBtn.querySelector("table")?.remove();
      lastSemesterBtn.textContent = `▶ Semester ${lastSemesterBtn.dataset.semester}`;
    }
    const existingTable = semBtn.querySelector("table");
    if (existingTable) {
      existingTable.remove();
      lastSemesterBtn.textContent = `▶ Semester ${lastSemesterBtn.dataset.semester}`;
      lastSemesterBtn = null;
    }
    semBtn.textContent = `▼ Semester ${semester}`;
    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Course</th>
        <th>Code</th>
        <th>Credit</th>
        <th>Action</th>
      </tr>
    `;
    courses.forEach((course) => {
      if (
        course.departementId == deptId &&
        year == course.year &&
        semester == course.semester
      ) {
        const tr = document.createElement("tr");
        tr.dataset.id = course.id;
        tr.innerHTML = `
          <td>${course.name}</td>
          <td>${course.code}</td>
          <td>${course.credit}</td>
          <td>
            <button class="editBtn">Edit</button>
            <button class="removeBtn">Remove</button>
          </td>
  `;
        table.append(tr);
      }
    });
    table.addEventListener("click", function (e) {
      e.stopPropagation();

      // Use closest to handle clicks even if inner span/input clicked
      const removeBtn = e.target.closest(".removeBtn");
      const editBtn = e.target.closest(".editBtn");
      const saveBtn = e.target.closest(".saveBtn");

      if (removeBtn) {
        const row = removeBtn.closest("tr");
        const courseId = row.dataset.id;

        row.remove(); // remove row visually

        // soft delete
        fetch(`http://localhost:3000/courses/${courseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: false }),
        })
          .then((res) => res.json())
          .then((data) => alert("Course soft deleted:", data))
          .catch((err) => alert(err));
      }

      if (editBtn) {
        const row = editBtn.closest("tr");
        if (row.classList.contains("editing")) return; // prevent multiple edits

        row.classList.add("editing");
        const cells = row.querySelectorAll("td");

        // replace text with input fields
        cells[0].innerHTML = `<input value="${cells[0].textContent}">`;
        cells[1].innerHTML = `<input value="${cells[1].textContent}">`;
        cells[2].innerHTML = `<input value="${cells[2].textContent}">`;

        // swap buttons
        editBtn.textContent = "Save";
        editBtn.classList.remove("editBtn");
        editBtn.classList.add("saveBtn");
      }

      if (saveBtn) {
        e.stopPropagation();

        const row = saveBtn.closest("tr");
        const courseId = row.dataset.id;
        const cells = row.querySelectorAll("td");

        const editedCourse = {
          name: cells[0].querySelector("input").value,
          code: cells[1].querySelector("input").value,
          credit: cells[2].querySelector("input").value,
        };

        // update table cells
        cells[0].textContent = editedCourse.name;
        cells[1].textContent = editedCourse.code;
        cells[2].textContent = editedCourse.credit;

        // PATCH to JSON server
        fetch(`http://localhost:3000/courses/${courseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedCourse),
        })
          .then((res) => res.json())
          .then((data) => alert("Course updated:", data))
          .catch((err) => alert(err));

        // reset buttons and editing class
        row.classList.remove("editing");
        saveBtn.textContent = "Edit";
        saveBtn.classList.remove("saveBtn");
        saveBtn.classList.add("editBtn");
      }
    });

    semBtn.append(table);
    lastSemesterBtn = semBtn;
  }
  lastDepartementClicked = deptBtn;
});

function addingYear(deptBtn, deptId) {
  console.log(deptBtn);
  console.log(deptId);
  const years = new Set();
  courses.forEach((course) => {
    if (deptId == course.departementId && !years.has(course.year)) {
      const btn = document.createElement("button");
      btn.textContent = `▶ Year ${course.year}`;
      btn.className = "yearOfDept";
      btn.dataset.year = course.year;
      deptBtn.append(btn);
      years.add(course.year);
    }
  });
}

async function displayCollege() {
  const colleges = await fetchingCollege();
  for (const eachCollege of colleges) {
    const collegeBtn = document.createElement("button");
    for (const content in eachCollege) {
      if (content == "collegeID") {
        collegeBtn.textContent = `College of ${eachCollege[content]}`;
        collegeBtn.type = "button";
        collegeBtn.className = "tab-btn";

        collegeBtn.dataset.id = eachCollege.collegeID;
        collegeContainer.append(collegeBtn);
      }
    }
  }
}
displayCollege();
