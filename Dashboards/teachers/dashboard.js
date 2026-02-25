const currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log(currentUser)
if (!currentUser || currentUser.role !== "teachers") {
  window.location.href = "../../index.html";
}
console.log(currentUser)
const message = document.getElementById("portalMessage");
const formWrapper = document.getElementById("teacherForm");
const formContainer = document.querySelector("#formContainer");
const teacherFrom=document.querySelector('#formFilling');

async function fetchingDepartements() {
  const res = await fetch("http://localhost:3000/departments");
  return await res.json();
}
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("opacity-0");
});
async function fetchingCourses(deptId, semester) {
  const res = await fetch("http://localhost:3000/courses");
  const data = await res.json();
  return data.filter(
    (c) => c.departementId == deptId && c.semester == semester
  );
}

async function fetchAllCourses() {
  const res = await fetch("http://localhost:3000/courses");
  return await res.json();
}

function getSubmissionWindows(year) {
  return [
    { semester: 1, start: new Date(year, 8, 11), end: new Date(year, 9, 10) },
    { semester: 2, start: new Date(year, 0, 10), end: new Date(year, 1, 28) },
  ];
}

function isPortalOpen() {
  const today = new Date();
  const windows = getSubmissionWindows(today.getFullYear());
  return windows.find((w) => today >= w.start && today <= w.end) || null;
}

const activeSemester = isPortalOpen();

async function formOpening() {
  if (!activeSemester) {
    message.textContent = "Form submission portal is CLOSED.";
    formWrapper.style.display = "none";
    return;
  }

  message.textContent = `Portal is OPEN for Semester ${activeSemester.semester}`;
  formWrapper.style.display = "block";

  formContainer.innerHTML = "";

  const courseTypeSelect = document.createElement("select");
  courseTypeSelect.style.border='2px solid #53758e'
    courseTypeSelect.style.borderRadius='4px '
    courseTypeSelect.style.outline='none '

  courseTypeSelect.id = "courseType";
  courseTypeSelect.className = "courseTypeSelection";
  courseTypeSelect.innerHTML = `
    <option value="" >Select Type</option>
    <option value="freshman">Freshman Courses</option>
    <option value="department">Department Courses</option>
  `;

  const deptSelect = document.createElement("select");
 deptSelect.style.border='2px solid #53758e'

  deptSelect.style.borderRadius='4px '
  deptSelect.style.outline='none '
  deptSelect.id = "department";
  deptSelect.className = "departmentSelection";
  deptSelect.innerHTML = `<option value="">Select Department</option>`;
  deptSelect.style.display = "none";

  const yearSelect = document.createElement("select");
    yearSelect.style.border='2px solid #53758e'

   yearSelect.style.borderRadius='4px '
   yearSelect.style.outline='none '
  yearSelect.id = "year";
  yearSelect.className = "yearSelection";

  const courseSelect = document.createElement("select");
  courseSelect.style.border='2px solid #53758e'

  courseSelect.style.borderRadius='4px '
  courseSelect.style.outline='none '
  courseSelect.id = "course";
  courseSelect.className = "courseSelection";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Submit";
  submitBtn.style.marginTop = "15px";
    submitBtn.style.background = "#dee9f6";
        submitBtn.style.padding = "3px";
        submitBtn.style.borderRadius = "5px";



  formContainer.append(courseTypeSelect, deptSelect, yearSelect, courseSelect, submitBtn);

  const departments = await fetchingDepartements();
  for (const dept of departments) {
    const option = document.createElement("option");
    option.value = dept.departementId;
    option.textContent = dept.name;
    deptSelect.append(option);
  }

  const allCourses = await fetchAllCourses();
  const freshCourses = allCourses.filter(
    (c) => c.level === "Freshman" && c.semester === activeSemester.semester
  );

  let deptCourses = [];

  courseTypeSelect.addEventListener("change", async () => {
    yearSelect.innerHTML = "";
    courseSelect.innerHTML = "";
    deptCourses = [];
    deptSelect.style.display = "none";

    if (courseTypeSelect.value === "freshman") {
      const option = document.createElement("option");
      option.value = "1";
      option.textContent = "Year 1";
      yearSelect.append(option);

      courseSelect.innerHTML = "";
      for (const c of freshCourses) {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        courseSelect.append(opt);
      }
    } else if (courseTypeSelect.value === "department") {
      deptSelect.style.display = "inline-block";
      yearSelect.innerHTML = `<option value="">Select Year</option>`;
      courseSelect.innerHTML = "";
    }
  });

  deptSelect.addEventListener("change", async () => {
    yearSelect.innerHTML = "";
    courseSelect.innerHTML = "";

    const deptId = deptSelect.value;
    if (!deptId) return;

    deptCourses = await fetchingCourses(deptId, activeSemester.semester);

    const deptYears = [...new Set(deptCourses.map((c) => c.year))];
    for (const y of deptYears) {
      const option = document.createElement("option");
      option.value = y;
      option.textContent = `Year ${y}`;
      yearSelect.append(option);
    }
  });

  yearSelect.addEventListener("change", () => {
    courseSelect.innerHTML = "";
    const selectedYear = yearSelect.value;
    if (!selectedYear) return;

    if (courseTypeSelect.value === "department") {
      for (const c of deptCourses) {
        if (c.year == selectedYear) {
          const option = document.createElement("option");
          option.value = c.id;
          option.textContent = c.name;
          courseSelect.append(option);
        }
      }
    }
  });

  teacherFrom.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submission = {
      teacherId: currentUser.id,
      departmentId: courseTypeSelect.value === "department" ? deptSelect.value : null,
      year: yearSelect.value,
      courseId: courseSelect.value,
      semester: activeSemester.semester,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    if (!submission.year || !submission.courseId) {
      alert("Please complete all selections.");
      return;
    }

    await fetch("http://localhost:3000/teacherSubmissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });

    alert("Submitted successfully!");
  });
}


formOpening();
