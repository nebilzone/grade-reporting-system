const forms = document.querySelector(".registerForm");
const paswwordInput = document.querySelector(".password");
const fullNameInput = document.querySelector(".fullName");
const emailInput = document.querySelector(".email");
const batchInput = document.querySelector(".year");
const streamInput = document.querySelector("freshman");
const genderInput = document.querySelector('input[name="gender"]');
function getEthiopianYear() {
  const today = new Date();
  const gregYear = today.getFullYear();
  const month = today.getMonth(); // 0 = January
  const day = today.getDate();

  // Ethiopian New Year is September 11
  const etYear =
    month > 8 || (month === 8 && day >= 11) ? gregYear - 7 : gregYear - 8;

  return etYear;
}

forms.addEventListener("submit", async (e) => {
  e.preventDefault();

  const event = e.target;
  const etYear = getEthiopianYear();

  const name = await nameValidation(event.fullName.value);
  const email = await emailValidation(event.email.value);
  const password = await passwordValidation(event.password.value);

  const data = {
    id: Date.now(),
    fullName: name,
    email: email,
    password: password,
    year: etYear,
    role: "students",
    gender: document.querySelector('input[name="gender"]:checked')?.value || 0,
    documents: {
      grade8: event.grade8.files[0].name,
      grade12: event.grade12.files[0].name,
      transcript: event.transcript.files[0].name,
    },
    status: "Pending",
  };
  if (name && email && password) {
    await fetch("http://localhost:3000/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    alert("Application submitted successfully!");
  }
});
