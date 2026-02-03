const newCollegeFormBtn = document.querySelector(".newCollegeFormBtn");
const newCollegeForm = document.querySelector(".newCollegeForm");

const overlay = document.querySelector(".overlay");
const backBtn = document.querySelector(".backBtn");

const collegeNameContainer = document.querySelector(".collegeName");
const collegeIdContainer = document.querySelector(".collegeIdContainer");

const collegeContainer = document.querySelector(".collageBtnContainer");
const departementContainer = document.querySelector(".departementContainer");
const addingCollegeForm = document.querySelector(".addingCourseForm");

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
        buttons.dataset.id=eachDepartement.departementId;
        departementContainer.append(buttons);
      }
    }

  }
});
async function fetchingCourse(){
  const response = await fetch("http://localhost:3000/courses");
  return  await response.json();

}
departementContainer.addEventListener('click',async function(e){
e.preventDefault();
const clickedDept=e.target.closest('button');
console.log(clickedDept.dataset.id)
const courses=await fetchingCourse()
for(const eachObjec of courses){
  if(clickedDept.dataset.id==eachObjec.departementId){

    console.log(eachObjec)
  }

}
})
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
