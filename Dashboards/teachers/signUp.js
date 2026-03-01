const submitForm = document.querySelector("#registerForm");
const passwordContainer = document.querySelector("#passwordContainer");
const fullNameContainer = document.querySelector("#fullNameContainer");
const emailContainer = document.querySelector("#emailContainer");
const nationalIdContainer = document.querySelector("#nationalID");
const departementContainer = document.querySelector("#departementContainer");
const err=document.querySelector('.error')
const phoneContainer = document.querySelector("#phoneContainer");
async function nameValidation(name) {
  document
    .querySelector("#fullNameInput")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  let value = name.trim();
  value = value.replace(/\s+/g, " ");

  if (
    value.length < 7 ||
    !value.includes(" ") ||
    !/^[A-Za-z\s]+$/.test(value)
  ) {
    err.textContent = "Please insert Valid Name";
    fullNameContainerContainer.append(err);
    return false;
  } else {
    const parts = value.split(" ");
    const isCapitalized = parts.map(
      (word) => word[0].toUpperCase() + word.slice(1),
    );

    return isCapitalized.join(" ");
  }
}
async function emailValidation(email) {
  document.querySelector("#email").addEventListener("focus", async function () {
    err.textContent = "";
  });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = "Please insert email address";
    err.style.color = "red";
    emailContainer.append(err);
    return false;
  } else {
    return email;
  }
}
async function passwordValidation(password) {
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
    passwordContainer.append(err);
    return false;
  } else {
    return password;
  }
}
async function nationalIDValidation(id) {

  document
    .querySelector("#nationalId")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (id.length < 16 || id.length > 16 || isNaN(id)) {
    err.textContent = "Please insert valid FAN number";
    nationalIdContainer.append(err);
    return false;
  } else {
    return id;
  }
}
async function departementValidation(departement) {

  document
    .querySelector("#department")
    .addEventListener("focus", async function () {
      err.textContent = "";
    });
  if (departement.length < 3  ||
     !/^[a-zA-Z\s\-]+$/.test(departement)) {
    err.textContent = "Please insert valid departement Name";
    departementContainer.append(err);
    return false;
  } else {
     const parts = departement.split(" ");
    const isCapitalized = parts.map(
      (word) => word[0].toUpperCase() + word.slice(1),
    );

    return isCapitalized.join(" ");
  }
}
async function phoneNumberValidation(phone) {
  const trimmedPhone = phone.trim();

  document.querySelector("#phone").addEventListener("focus", async function () {
    err.textContent = "";
  });
  if (trimmedPhone.startsWith("+251")) {
    if (
      (trimmedPhone.slice(0, 5) != "+2519" &&
        trimmedPhone.slice(0, 5) != "+2517") ||
      trimmedPhone.slice(5).length != 8
    ) {
      err.textContent = "Please insert valid Phone ";
      phoneContainer.append(err);
      return false;
    }
  } else if (trimmedPhone.startsWith("0")) {
    if (
      (trimmedPhone.slice(0, 2) != "09" && trimmedPhone.slice(0, 2) != "07") ||
      trimmedPhone.slice(2).length != 8
    ) {
      err.textContent = "Please insert valid phone number";
      phoneContainer.append(err);
      return false;
    }
  } else {
    err.textContent = "Please insert valid phone number";
    phoneContainer.append(err);
    return false;
  }
  return trimmedPhone;
}
submitForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const event = e.target;
  const name = await nameValidation(event.fullNameInput.value);
  const email = await emailValidation(event.email.value);
  const password = await passwordValidation(event.password.value);
  const nationalId = await nationalIDValidation(event.nationalId.value);
  const departement = await departementValidation(event.department.value);
  const phone = await phoneNumberValidation(event.phone.value);

  const teacher = {
    id: Date.now(),
    fullName: name,
    email: email,
    password: password,
    role: "teachers",
    phone: phone,
    gender: document.querySelector('input[name="gender"]:checked').value,
    nationalID: nationalId,
    departments: departement,
    documents: {
      cv: event.cv.files[0].name,
      degree: event.degree.files[0].name,
      masters: event.masters.files[0]?.name || "Not uploaded",
      phd: event.phd.files[0]?.name || "Not uploaded",
    },
    status: "Pending",
  };
  if (email && name && password && nationalId && departement && phone) {
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(teacher),
    });
    alert("Application submitted successfully!");
  }
});
