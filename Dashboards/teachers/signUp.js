const submitForm = document.querySelector(".registerForm");
const paswwordInput = document.querySelector(".password");
const fullNameInput = document.querySelector(".fullName");
const emailInput = document.querySelector(".email");
const nationalIDInput = document.querySelector(".nationalID");
const departementInput = document.querySelector(".departement");
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
    emailInput.append(err);
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
    fullNameInput.append(err);
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
    paswwordInput.append(err);
    return false;
  } else {
    return password;
  }
}
async function nationalIDValidation(id) {
  const err = document.createElement("p");

  document
    .querySelector("#nationalId")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (id.length < 16 || id.length > 16 || isNaN(id)) {
    err.textContent = "Please insert valid FAN number";
    err.style.color = "red";
    nationalIDInput.append(err);
    return false;
  } else {
    return id;
  }
}
async function departementValidation(departement) {
  const err = document.createElement("p");

  document
    .querySelector("#department")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (departement.length < 3 || !/^[a-zA-Z\s\-]+$/.test(departement)) {
    err.textContent = "Please insert valid departement Name";
    err.style.color = "red";
    departementInput.append(err);
    return false;
  } else {
    return departement;
  }
}

submitForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const event = e.target;
  const name = await nameValidation(event.fullName.value);
  const email = await emailValidation(event.email.value);
  const password = await passwordValidation(event.password.value);
  const nationalId = await nationalIDValidation(event.nationalId.value);
  const departement = await departementValidation(event.department.value);

  const teacher = {
    id: Date.now(),
    fullName: name,
    email: email,
    password: password,
    role: "teachers",
    phone: event.phone.value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    nationalID: nationalId,
    departments: event.department.value,
    documents: {
      cv: event.cv.files[0].name,
      degree: event.degree.files[0].name,
      masters: event.masters.files[0]?.name || "Not uploaded",
      phd: event.phd.files[0]?.name || "Not uploaded",
    },
    status: "Pending",
  };
  if (email && name && password && nationalId && departement) {
    await fetch("http://localhost:3000/applications", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(teacher),
    });
    alert("Application submitted successfully!");
  }
});
