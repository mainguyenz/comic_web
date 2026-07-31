//  Họ tên: Trần Gia Huy
//  MSSV: B2408792
//  Email: huyb2408792@student.ctu.edu.vn
//  Tài liệu tham khảo:
//  + BGR
//  + TLTK3
//  + w3school
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

  // Lưu tài khoản
  function saveAccount(account) {
    localStorage.setItem("account", JSON.stringify(account));
  }

  // Hàm kiểm tra định dạng email hợp lệ
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Xóa trạng thái lỗi/thành công của một hàng
  function resetRow(row) {
    row.classList.remove("success", "failure");
    const msg = row.querySelector(".notification");
    if (msg) msg.textContent = "";
  }

  // Đánh dấu lỗi cho một hàng (màu đỏ, hiển thị thông báo)
  function setError(row, message, msgElement) {
    row.classList.remove("success");
    row.classList.add("failure");
    if (msgElement) {
      msgElement.textContent = "\u274C " + message;
    }
  }

  // Đánh dấu thành công cho một hàng (màu xanh, hiển thị "Thành công!")
  function setSuccess(row, msgElement) {
    row.classList.remove("failure");
    row.classList.add("success");
    if (msgElement) {
      msgElement.textContent = "Thành công!";
    }
  }

  // Xác thực tên người dùng (sự kiện blur)
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

  // Xác thực email (sự kiện blur)
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

    setSuccess(emailRow, emailMsg);
  }

  // Xác thực mật khẩu (sự kiện blur)
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

    // Nếu đã có xác nhận mật khẩu, kiểm tra lại luôn
    if (confirmInput.value) {
      validateConfirm();
    }
  }

  //  Xác thực xác nhận mật khẩu (sự kiện blur)
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

  // Gán sự kiện blur cho các trường
  usernameInput.addEventListener("blur", validateUsername);
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("blur", validatePassword);
  confirmInput.addEventListener("blur", validateConfirm);

  // Nút hiển thị/ẩn mật khẩu
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  // Xử lý sự kiện submit form
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

    // Gọi lại các hàm validation để cập nhật trạng thái mới nhất
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirm();

    // Kiểm tra tất cả các trường đều hợp lệ
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

    // Tạo tài khoản mới
    const newAccount = {
      fullname: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passwordInput.value,
      createdAt: new Date().toISOString(),
    };

    // Lưu tài khoản (ghi đè)
    saveAccount(newAccount);

    alert("Form đã được gửi thành công! Chuyển hướng đến trang đăng nhập!");
    window.location.href = "login.html";
  });

  // Nếu đã đăng nhập, chuyển về trang chủ
  if (localStorage.getItem("currentUser")) {
    window.location.href = "trangchu.html";
  }
});
