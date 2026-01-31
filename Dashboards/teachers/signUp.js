const submitForm = document.querySelector(".registerForm");
submitForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log(e);
  const event = e.target;

  const teacher = {
    id:Date.now(),
    fullName: event.fullName.value,
    email: event.email.value,
    password: event.password.value,
    role: "teachers",
    phone: event.phone.value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    nationalID: event.nationalId.value,
    departments: event.department.value,
    documents: {
      cv:event.cv.files[0].name,
      degree: event.degree.files[0].name,
      masters: event.masters.files[0]?.name || "Not uploaded",
      phd: event.phd.files[0]?.name || "Not uploaded",
    },
    status:"Pending"
  };
  console.log(teacher);
    await fetch("http://localhost:3000/applications", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(teacher),
    });
  alert("Application submitted successfully!");
});
