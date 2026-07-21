document.addEventListener("DOMContentLoaded", function () {
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

  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirm = document.getElementById("toggleConfirmPassword");

  // Lấy tài khoản đã đăng ký (nếu có)
  function getAccounts() {
    const data = localStorage.getItem("accounts");
    return data ? JSON.parse(data) : [];
  }

  function saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function resetRow(row) {
    row.classList.remove("success", "failure");
    const msg = row.querySelector(".notification");
    if (msg) msg.textContent = "";
  }

  function setError(row, message, msgElement) {
    row.classList.remove("success");
    row.classList.add("failure");
    if (msgElement) {
      msgElement.textContent = "\u274C " + message;
    }
  }

  function setSuccess(row, msgElement) {
    row.classList.remove("failure");
    row.classList.add("success");
    if (msgElement) {
      msgElement.textContent = "Thành công!";
    }
  }

  // Validate Username
  function validateUsername() {
    const val = usernameInput.value.trim();
    usernameMsg.textContent = "";

    if (val === "") {
      setError(usernameRow, "Vui lòng nhập tên người dùng!", usernameMsg);
      return;
    }
    if (val.length < 5) {
      setError(
        usernameRow,
        "Tên người dùng phải có ít nhất 5 kí tự!",
        usernameMsg,
      );
      return;
    }
    setSuccess(usernameRow, usernameMsg);
  }

  // Validate Email
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
    // Lấy danh sách tài khoản
    const accounts = getAccounts();

    // Kiểm tra email đã tồn tại chưa
    const tonTai = accounts.some(function (account) {
      return account.email.toLowerCase() === val.toLowerCase();
    });

    if (tonTai) {
      setError(emailRow, "Email đã được đăng ký!", emailMsg);
      return;
    }

    setSuccess(emailRow, emailMsg);
  }

  // Validate Password
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

    if (confirmInput.value) {
      validateConfirm();
    }
  }

  // Validate Confirm Password
  function validateConfirm() {
    const pass = passwordInput.value;
    const confirm = confirmInput.value;
    confirmMsg.textContent = "";

    if (!pass) {
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

  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  confirmInput.addEventListener("blur", validateConfirm);

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  toggleConfirm.addEventListener("click", function () {
    const type =
      confirmInput.getAttribute("type") === "password" ? "text" : "password";
    confirmInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirm();

    const isUsernameValid = usernameRow.classList.contains("success");
    const isEmailValid = emailRow.classList.contains("success");
    const isPasswordValid = passwordRow.classList.contains("success");
    const isConfirmValid = confirmRow.classList.contains("success");
    const isAgreed = agreeCheck.checked;

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmValid ||
      !isAgreed
    ) {
      alert("Form vẫn còn lỗi!");
      return;
    }

    // Tạo tài khoản mới (ghi đè tài khoản cũ)
    const newAccount = {
      fullname: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      createdAt: new Date().toISOString(),
    };

    // Chỉ lưu account, KHÔNG lưu currentUser
    const accounts = getAccounts();

    accounts.push(newAccount);

    saveAccounts(accounts);
    window.location.href = "login.html";
  });

  // Nếu đã đăng nhập, chuyển về trang chủ
  if (localStorage.getItem("currentUser")) {
    window.location.href = "trangchu.html";
  }
});
