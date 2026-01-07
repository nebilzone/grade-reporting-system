const user = [
  { username: "student", password: "stu123" },
  { username: "admin", password: "123" },
];
const usernameInput = document.querySelector(".login-username");
const passwordInput = document.querySelector(".login-password");
const loginBtn=document.querySelector('.submit-btn')
function submitForm(event) {
    event.preventDefault();
  if (
    usernameInput.value === user[0].username &&
    passwordInput.value === user[0].password
  ) {
    window.location.replace("user.html");
  } else if (
    usernameInput.value === user[1].username &&
    passwordInput.value === user[1].username
  ) {
    window.location.replace("admin.html");
  }else{
    alert('you inserted invalid input,please try again');
  }
}
loginBtn.addEventListener('click',submitForm)
