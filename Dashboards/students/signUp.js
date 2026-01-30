const forms = document.querySelector(".registerForm");
forms.addEventListener("submit", async (e) => {
  e.preventDefault();
  const event = e.target;
  const data = {
    id: Date.now(),
    fullName: event.fullName.value,
    email: event.email.value,
    password: event.password.value,
    year:event.year.value,
    role:"students",
    gender: document.querySelector('input[name="gender"]:checked')?.value || 0,
    documents: {

      grade8: event.grade8.files[0].name,
      grade12: event.grade12.files[0].name,
      transcript: event.transcript.files[0].name,
    },
    status: "Pending",
  };
  await fetch("http://localhost:3000/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  alert("Application submitted successfully!");
});
