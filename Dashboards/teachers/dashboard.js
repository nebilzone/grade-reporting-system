const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const message = document.getElementById("portalMessage");
const forms=document.querySelector('.formContainer');
if (!currentUser || currentUser.role !== "teachers") {
  window.location.href = "../../login.html";
}
fetch(`http://localhost:3000/users/${currentUser.id}`)
  .then((res) => res.json())
  .then((data) => {
    console.log("My data only:", data);
    document.querySelector("#studentName").textContent = data.fullName;
    document.querySelector("#studentEmail").textContent = data.email;
    document.querySelector("#studentTrack").textContent = data.departments;
  });

async function fetchingDepartements() {
  const res = await fetch("http://localhost:3000/departments");
  return await res.json();
}
function getSubmissionWindows(year) {
  return [
    {
      semester: 1,
      start: new Date(year, 8, 11), // Meskerem 1 ≈ Sep 11
      end: new Date(year, 9, 10), // Meskerem 30 ≈ Oct 10
    },
    {
      semester: 2,
      start: new Date(year, 0, 10), // Tir 1 ≈ Jan 10 (next year)
      end: new Date(year, 1, 8), // Tir 30 ≈ Feb 8 (next year)
    },
  ];
}
function isPortalOpen() {
  const today = new Date(); // Today’s date
  const windows = getSubmissionWindows(today.getFullYear()); // Get windows for this year
  return (
    windows.find((window) => today >= window.start && today <= window.end) ||
    null
  );
}
const activeSemester = isPortalOpen();
async function formOpening(){
    if (activeSemester) {
  message.textContent = `Portal is OPEN for Semester ${activeSemester.semester}. You can fill the form now.`;
  const departements=await fetchingDepartements();
  const selectform=document.createElement('select');
  for(const departement of departements){
    const option=document.createElement('option');
    option.textContent=departement.name;
    selectform.append(option)
  }
forms.append(selectform)
  document.getElementById("teacherForm").style.display = "block";
} else {
  message.textContent = "Form submission portal is CLOSED for now.";
  document.getElementById("teacherForm").style.display = "none";
}
}
formOpening();
