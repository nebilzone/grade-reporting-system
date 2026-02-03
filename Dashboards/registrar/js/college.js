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
  return await response.json();
}
async function fetchinDepartement(id) {
  const response = await fetch("http://localhost:3000/departments");
  const json = await response.json();
  return json.filter((item) => item.collegeId == id);
}

collegeContainer.addEventListener("click", async function (e) {
  const event = e.target.closest("button");
  if (!event) return;
  const collegeTabBtn = document.querySelectorAll(".tab-btn");

  collegeTabBtn.forEach((b) => b.classList.remove("active"));
  event.classList.add("active");
  departementContainer.innerHTML = "";
  const departements = await fetchinDepartement(event.dataset.id);
  for (const eachDepartement of departements) {
    for (const departement in eachDepartement) {
      if (departement == "name") {
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
  return await response.json();
}

// Global variables
let lastDepartementClicked = null; // track last clicked department
let lastYearBtn = null;             // track last clicked year
let lastSemesterBtn = null;         // track last clicked semester
let courses = [];                   // store all courses

departementContainer.addEventListener("click", async function (e) {
  e.preventDefault();

  const deptBtn = e.target.closest("button[data-id]"); // department button
  const yearBtn = e.target.closest(".yearOfDept");     // year button
  const semBtn = e.target.closest(".semOfDept");      // semester button

  // ------------------------
  // 1️⃣ Department clicked
  // ------------------------
  if (deptBtn && !yearBtn && !semBtn) {
    const deptId = deptBtn.dataset.id;
    courses = await fetchingCourse(); // fetch courses

    // Toggle same department
    if (lastDepartementClicked === deptBtn) {
      const yearButtons = deptBtn.querySelectorAll(".yearOfDept");
      if (yearButtons.length > 0) {
        yearButtons.forEach(btn => btn.remove());
        lastDepartementClicked = null;
        lastYearBtn = null;
        lastSemesterBtn = null;
      } else {
        addYearButtons(deptBtn, deptId);
        lastDepartementClicked = deptBtn;
      }
      return;
    }

    // Remove previous department's years
    if (lastDepartementClicked && lastDepartementClicked !== deptBtn) {
      lastDepartementClicked.querySelectorAll(".yearOfDept").forEach(btn => btn.remove());
      lastYearBtn = null;
      lastSemesterBtn = null;
    }

    // Show years for this department
    addYearButtons(deptBtn, deptId);
    lastDepartementClicked = deptBtn;
    return;
  }

  // ------------------------
  // 2️⃣ Year clicked
  // ------------------------
  if (yearBtn && !semBtn) {
    const deptParent = yearBtn.closest("button[data-id]");
    const deptId = deptParent.dataset.id;
    const year = parseInt(yearBtn.dataset.year);

    // Collapse previously opened year if different
    if (lastYearBtn && lastYearBtn !== yearBtn) {
      lastYearBtn.querySelectorAll(".semOfDept").forEach(btn => btn.remove());
    }

    // Toggle same year
    const semestersExist = yearBtn.querySelectorAll(".semOfDept").length > 0;
    if (semestersExist) {
      yearBtn.querySelectorAll(".semOfDept").forEach(btn => btn.remove());
      lastYearBtn = null;
      lastSemesterBtn = null;
      return;
    }

    const semestersAdded = new Set();

    // Add semesters
    courses.forEach(course => {
      if (course.departementId == deptId && course.year == year && !semestersAdded.has(course.semester)) {
        const semButton = document.createElement("button");
        semButton.textContent = `▶ Semester ${course.semester}`;
        semButton.className = "semOfDept";
        semButton.dataset.semester = course.semester;
        yearBtn.append(semButton);
        semestersAdded.add(course.semester);
      }
    });

    lastYearBtn = yearBtn;
    lastSemesterBtn = null; // reset semester
    return;
  }

  // ------------------------
  // 3️⃣ Semester clicked
  // ------------------------
  if (semBtn) {
    const yearParent = semBtn.closest(".yearOfDept");
    const deptParent = semBtn.closest("button[data-id]");
    const deptId = deptParent.dataset.id;
    const year = parseInt(yearParent.dataset.year);
    const semester = parseInt(semBtn.dataset.semester);

    // Remove previous semester table if different
    if (lastSemesterBtn && lastSemesterBtn !== semBtn) {
      lastSemesterBtn.querySelectorAll("table").forEach(tbl => tbl.remove());
    }

    // Toggle same semester table
    const existingTable = semBtn.querySelector("table");
    if (existingTable) {
      existingTable.remove();
      lastSemesterBtn = null;
      return;
    }

    // Create table
    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Course Name</th>
        <th>Course Code</th>
        <th>Credit</th>
      </tr>
    `;

    courses.forEach(course => {
      if (course.departementId == deptId && course.year == year && course.semester == semester) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${course.name}</td>
          <td>${course.code}</td>
          <td>${course.credit}</td>
        `;
        table.append(row);
      }
    });

    semBtn.append(table);
    lastSemesterBtn = semBtn;
    return;
  }
});

// ------------------------
// Helper function to add year buttons
// ------------------------
function addYearButtons(deptBtn, deptId) {
  const addedYears = new Set();
  deptBtn.querySelectorAll(".yearOfDept").forEach(btn => addedYears.add(parseInt(btn.dataset.year)));

  courses.forEach(course => {
    if (course.departementId == deptId && !addedYears.has(course.year)) {
      const btn = document.createElement("button");
      btn.textContent = `▶ Year ${course.year}`;
      btn.className = "yearOfDept";
      btn.dataset.year = course.year;
      deptBtn.append(btn);
      addedYears.add(course.year);
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
