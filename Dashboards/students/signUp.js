const forms = document.querySelector(".registerForm");
const paswwordInput = document.querySelector(".password");
const fullNameInput = document.querySelector(".fullName");
const emailInput = document.querySelector(".email");
const batchInput = document.querySelector(".year");
const streamInput = document.querySelector("freshman");
const genderInput = document.querySelector('input[name="gender"]');
async function nameValidation(name) {
  let value = name.trim();
  value = value.replace(/\s+/g, " ");
  const parts = value.split(" ");
  const isCapitalized = parts.every(
    (word) => word[0] === word[0].toUpperCase(),
  );
  if (
    value.length < 7 ||
    !value.includes(" ") ||
    !/^[A-Za-z\s]+$/.test(value) ||
    !isCapitalized
  ) {
    err.textContent = "Please insert Valid Name";
    err.style.color = "red";
    fullNameInput.append(err);
  }
  return value;
}
forms.addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = document.createElement("p");

  const event = e.target;

  document
    .querySelector("#fullName")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  const name = await nameValidation(event.fullName.value);

  const data = {
    id: Date.now(),
    fullName: name,
    email: event.email.value,
    password: event.password.value,
    year: event.year.value,
    role: "students",
    gender: document.querySelector('input[name="gender"]:checked')?.value || 0,
    documents: {
      grade8: event.grade8.files[0].name,
      grade12: event.grade12.files[0].name,
      transcript: event.transcript.files[0].name,
    },
    status: "Pending",
  };
  // await fetch("http://localhost:3000/applications", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // });
  alert("Application submitted successfully!");
});
