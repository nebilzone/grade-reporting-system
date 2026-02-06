const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "teachers") {
  window.location.href = "../../index.html";
}
const message = document.getElementById("portalMessage");
const formWrapper = document.getElementById("teacherForm");
const formContainer = document.querySelector(".formContainer");

async function fetchingDepartements() {
  const res = await fetch("http://localhost:3000/departments");
  return await res.json();
}

async function fetchingCourses(deptId, semester) {
  const res = await fetch("http://localhost:3000/courses");
  const data = await res.json();
  return data.filter(
    c => c.departementId == deptId && c.semester == semester
  );
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
  return windows.find(w => today >= w.start && today <= w.end) || null;
}

const activeSemester = isPortalOpen();


async function formOpening() {
  if (!activeSemester) {
    message.textContent = "Form submission portal is CLOSED.";
    formWrapper.style.display = "none";
    return;
  }

  message.textContent =
    `Portal is OPEN for Semester ${activeSemester.semester}`;
  formWrapper.style.display = "block";

  formContainer.innerHTML = "";


  const deptSelect = document.createElement("select");
  const yearSelect = document.createElement("select");
  const courseSelect = document.createElement("select");
  const submitBtn = document.createElement("button");

  deptSelect.className = "departmentSelection";
  yearSelect.className = "yearSelection";
  courseSelect.className = "courseSelection";

  submitBtn.type = "submit";
  submitBtn.textContent = "Submit";
  submitBtn.style.marginTop = "15px";

  formContainer.append(deptSelect, yearSelect, courseSelect, submitBtn);


  deptSelect.innerHTML = `<option value="">Select Department</option>`;
  const departments = await fetchingDepartements();

  for (const dept of departments) {
    const option = document.createElement("option");
    option.textContent = dept.name;
    option.dataset.id = dept.departementId;
    deptSelect.append(option);
  }

  let cachedCourses = [];


  deptSelect.addEventListener("change", async () => {
    yearSelect.innerHTML = "";
    courseSelect.innerHTML = "";

    const selected =
      deptSelect.options[deptSelect.selectedIndex];

    if (!selected.dataset.id) return;

    const deptId = selected.dataset.id;

    cachedCourses =
      await fetchingCourses(deptId, activeSemester.semester);

    const years = [...new Set(cachedCourses.map(c => c.year))];

    yearSelect.innerHTML = `<option value="">Select Year</option>`;

    for (const y of years) {
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

    for (const c of cachedCourses) {
      if (c.year == selectedYear) {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        courseSelect.append(option);
      }
    }
  });


  formContainer.addEventListener("submit", async (e) => {
    e.preventDefault();
    const deptOption =
      deptSelect.options[deptSelect.selectedIndex];

    const submission = {
      teacherId: currentUser.id,
      departmentId: deptOption?.dataset.id,
      year: yearSelect.value,
      courseId: courseSelect.value,
      semester: activeSemester.semester,
      submittedAt: new Date().toISOString(),
      status: "pending"
    };

    if (
      !submission.departmentId ||
      !submission.year ||
      !submission.courseId
    ) {
      alert("Please complete all selections.");
      return;
    }

    await fetch("http://localhost:3000/teacherSubmissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission)
    });

    alert("Submitted successfully!");
  });
}

formOpening();
