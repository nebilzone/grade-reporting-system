const forms = document.querySelector(".registerForm");
const passwordContainer = document.querySelector(".password");
const fullNameContainer = document.querySelector(".fullName");
const emailContainer = document.querySelector(".email");
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
async function nameValidation(name) {
  const err = document.createElement("p");
  document.querySelector("#email").addEventListener("focus", async function () {
    err.textContent = "";
  });
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
    emailContainer.append(err);
    return false;
  } else {
    return value;
  }
}
async function emailValidation(email) {
  const err = document.createElement("p");
  document
    .querySelector("#fullName")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = "Please insert email address";
    err.style.color = "red";
    fullNameContainer.append(err);
    return false;
  } else {
    return email;
  }
}
async function passwordValidation(password) {
  const err = document.createElement("p");
  document
    .querySelector("#password")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/.test(password)
  ) {
    err.textContent =
      "Password must > 8 & contain 1 small ,1 capital and 1 special character";
    err.style.color = "red";
    passwordContainer.append(err);
    return false;
  } else {
    return password;
  }
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
    track:event.freshman.value,
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
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    alert("Application submitted successfully!");
  }
});
