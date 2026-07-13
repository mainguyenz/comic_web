document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");
  const usernameRow = document.getElementById("row-username");
  const emailRow = document.getElementById("row-email");
  const passwordRow = document.getElementById("row-password");
  const confirmRow = document.getElementById("row-confirm");
  const usernameMsg = document.getElementById("usernameMsg");
  const emailMsg = document.getElementById("emailMsg");
  const passwordMsg = document.getElementById("passwordMsg");
  const confirmMsg = document.getElementById("confirmMsg");
  const registerForm = document.getElementById("registerForm");
  const agreeCheck = document.getElementById("agree");

  // Toggle password
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirm = document.getElementById("toggleConfirmPassword");

  // Hàm kiểm tra email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Hàm reset row
  function resetRow(row) {
    row.classList.remove("success", "failure");
    const msg = row.querySelector(".notification");
    if (msg) msg.textContent = "";
  }

  // Hàm đặt lỗi
  function setError(row, message, msgElement) {
    row.classList.remove("success");
    row.classList.add("failure");
    if (msgElement) {
      msgElement.textContent = "\u274C " + message;
    }
  }

  // Hàm đặt thành công
  function setSuccess(row, msgElement) {
    row.classList.remove("failure");
    row.classList.add("success");
    if (msgElement) {
      msgElement.textContent = "Thành công!";
    }
  }

  // ---- Validation Username (blur) ----
  function validateUsername() {
    const val = usernameInput.value.trim();
    usernameMsg.textContent = "";

    if (val === "") {
      setError(usernameRow, "Vui lòng nhập tên người dùng!", usernameMsg);
      return;
    }

    if (val.length < 5) {
      setError(usernameRow, "Tên người dùng phải có ít nhất 5 kí tự!", usernameMsg);
      return;
    }

    setSuccess(usernameRow, usernameMsg);
  }

  // ---- Validation Email (blur) ----
  function validateEmail() {
    const val = emailInput.value.trim();
    emailMsg.textContent = "";

    if (val === "") {
      setError(emailRow, "Vui lòng nhập email!", emailMsg);
      return;
    }

    if (!isValidEmail(val)) {
      setError(emailRow, "Email không hợp lệ!", emailMsg);
      return;
    }

    // Kiểm tra email đã tồn tại
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((user) => user.email === val)) {
      setError(emailRow, "Email đã được đăng ký!", emailMsg);
      return;
    }

    setSuccess(emailRow, emailMsg);
  }

  // ---- Validation Password (blur) ----
  function validatePassword() {
    const val = passwordInput.value;
    passwordMsg.textContent = "";

    if (val === "") {
      setError(passwordRow, "Vui lòng nhập mật khẩu!", passwordMsg);
      return;
    }

    if (val.length < 8) {
      setError(passwordRow, "Mật khẩu phải có ít nhất 8 kí tự!", passwordMsg);
      return;
    }

    setSuccess(passwordRow, passwordMsg);

    // Nếu password thay đổi, kiểm tra lại confirm
    if (confirmInput.value) {
      validateConfirm();
    }
  }

  // ---- Validation Confirm Password (blur) ----
  function validateConfirm() {
    const pass = passwordInput.value;
    const confirm = confirmInput.value;
    confirmMsg.textContent = "";

    if (!pass) {
      // Nếu chưa có password, không cần check confirm
      resetRow(confirmRow);
      confirmMsg.textContent = "";
      return;
    }

    if (confirm === "") {
      setError(confirmRow, "Vui lòng xác nhận mật khẩu!", confirmMsg);
      return;
    }

    if (confirm !== pass) {
      setError(confirmRow, "Mật khẩu không khớp!", confirmMsg);
      return;
    }

    setSuccess(confirmRow, confirmMsg);
  }

  // Gán sự kiện blur
  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  confirmInput.addEventListener("blur", validateConfirm);

  // ---- Toggle hiển thị mật khẩu ----
  togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  toggleConfirm.addEventListener("click", function () {
    const type = confirmInput.getAttribute("type") === "password" ? "text" : "password";
    confirmInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  // ---- Xử lý submit ----
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Gọi lại validation để cập nhật
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirm();

    // Kiểm tra tất cả các row có success không
    const isUsernameValid = usernameRow.classList.contains("success");
    const isEmailValid = emailRow.classList.contains("success");
    const isPasswordValid = passwordRow.classList.contains("success");
    const isConfirmValid = confirmRow.classList.contains("success");
    const isAgreed = agreeCheck.checked;

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmValid || !isAgreed) {
      alert("Form vẫn còn lỗi!");
      return;
    }

    // Lưu user mới
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const newUser = {
      fullname: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Chỉ lưu email để gợi nhớ, không tự động đăng nhập
    localStorage.setItem("lastEmail", newUser.email);
    alert("Form đã được gửi thành công! Chuyển hướng đến trang đăng nhập!");
    window.location.href = "login.html";
  });

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (localStorage.getItem("currentUser")) {
    window.location.href = "trangchu.html";
  }
});
