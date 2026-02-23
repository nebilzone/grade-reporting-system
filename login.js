const loginForm = document.querySelector("#loginForm");
const formContainer = document.querySelector("#formContainer");

async function fetchUsers() {
  const res = await fetch("http://localhost:3000/users");
  return await res.json();
}

async function updateUser(id, data) {
  await fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

function showError(message) {
  const old = formContainer.querySelector(".error");
  if (old) old.remove();

  const p = document.createElement("p");
  p.textContent = message;
  p.className = "error";
  p.style.color = "red";
  formContainer.append(p);
}

function redirectByRole(role) {
  if (role === "students") {
    window.location.href = "./Dashboards/students/dashboard.html";
  } else if (role === "teachers") {
    window.location.href = "./Dashboards/teachers/dashboard.html";
  } else if (role === "registrar") {
    window.location.href = "./Dashboards/registrar/dashboard.html";
  } else {
    alert("Unknown role");
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.emailInput.value.trim();
  const password = e.target.passwordInput.value.trim();
  const users = await fetchUsers();

  const user = users.find((u) => u.email === email);

  if (!user) {
    showError("Email or password is incorrect");
    return;
  }

  if (user.status !== "active") {
    showError("Account is not active");
    return;
  }

  const now = Date.now();

  if (user.auth.lockUntil && now < user.auth.lockUntil) {
    showError("Account locked. Try again later.");
    return;
  }

  if (user.password !== password) {
    let attempts = user.auth.failedAttempts + 1;

    const update = {
      auth: {
        failedAttempts: attempts,
        lockUntil: null,
        lastLogin: user.auth.lastLogin,
      },
    };

    if (attempts >= 5) {
      update.auth.lockUntil = now + 10 * 60 * 1000;
      update.auth.failedAttempts = 0;
    }

    await updateUser(user.id, update);

    showError("Email or password is incorrect");
    return;
  }
  localStorage.setItem(
  "currentUser",
  JSON.stringify({
    id: user.id,
    role: user.role,
    email: user.email,
    fullName: user.fullName
  })
);


  await updateUser(user.id, {
    auth: {
      failedAttempts: 0,
      lockUntil: null,
      lastLogin: now,
    },
  });

  redirectByRole(user.role);
});
