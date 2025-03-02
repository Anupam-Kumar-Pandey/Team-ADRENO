document.getElementById("showSignup").addEventListener("click", function () {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("signupPage").style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", function () {
  document.getElementById("signupPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
});

document.getElementById("forgotPasswordLink").addEventListener("click", function () {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("resetPasswordPage").style.display = "block";
});

document.getElementById("backToLogin").addEventListener("click", function () {
  document.getElementById("resetPasswordPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
});

// 🔹 Signup Function
document.getElementById("signupForm").addEventListener("submit", function (event) {
  event.preventDefault();
  
  const email = document.getElementById("signupEmail").value;
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }

  let userData = {
      email: email,
      username: username,
      password: password
  };

  localStorage.setItem(email, JSON.stringify(userData)); // Store user data under email as key
  alert("Signup Successful! Redirecting to login...");
  
  document.getElementById("signupPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
});


// 🔹 Login Function
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  let userData = JSON.parse(localStorage.getItem(loginEmail)); // Get user data

  if (!userData) {
      alert("User not found! Please sign up.");
      return;
  }

  if (userData.password === loginPassword) {
      alert("Login Successful! Redirecting to Main Content...");

      localStorage.setItem("currentUser", loginEmail);
      localStorage.setItem("currentUsername", userData.username); // Store username

      window.location.assign("index.html"); // Redirect to main content
  } else {
      alert("Invalid email or password!");
  }
});


// 🔹 Reset Password Function
document.getElementById("resetPasswordForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const resetEmail = document.getElementById("resetEmail").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[resetEmail]) {
      alert("Email not found!");
      return;
  }

  if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
  }

  users[resetEmail].password = newPassword;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Password Reset Successful! Redirecting to login...");
  document.getElementById("resetPasswordPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
});
