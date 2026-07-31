//  Họ tên: Trần Gia Huy
//  MSSV: B2408792
//  Email: huyb2408792@student.ctu.edu.vn
//  Tài liệu tham khảo:
//  + BGR
//  + TLTK3
//  + w3school
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const emailRow = document.getElementById("row-email");
  const passwordRow = document.getElementById("row-password");
  const emailMsg = document.getElementById("emailMsg");
  const passwordMsg = document.getElementById("passwordMsg");
  const loginForm = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");

  // Lấy tài khoản đã đăng ký
  function getAccount() {
    const data = localStorage.getItem("account");
    return data ? JSON.parse(data) : null;
  }

  // Hàm kiểm tra email hợp lệ
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Hàm reset trạng thái của một hàng
  function resetRow(row) {
    row.classList.remove("success", "failure");
    const msg = row.querySelector(".notification");
    if (msg) msg.textContent = "";
  }

  // Hàm đặt lỗi cho một hàng
  function setError(row, message, msgElement) {
    row.classList.remove("success");
    row.classList.add("failure");
    if (msgElement) {
      msgElement.textContent = "\u274C " + message;
    }
  }

  // Hàm đặt thành công cho một hàng
  function setSuccess(row, msgElement) {
    row.classList.remove("failure");
    row.classList.add("success");
    if (msgElement) {
      msgElement.textContent = "";
    }
  }

  // Xác thực email (sự kiện blur)
  function validateEmailOnBlur() {
    const email = emailInput.value.trim();
    emailMsg.textContent = "";

    if (email === "") {
      setError(emailRow, "Vui lòng nhập email!", emailMsg);
      return;
    }
    if (!isValidEmail(email)) {
      setError(emailRow, "Email không hợp lệ!", emailMsg);
      return;
    }
    setSuccess(emailRow, emailMsg);
  }

  // Xác thực mật khẩu (sự kiện blur)
  function validatePasswordOnBlur() {
    const password = passwordInput.value;
    passwordMsg.textContent = "";

    if (password === "") {
      setError(passwordRow, "Vui lòng nhập mật khẩu!", passwordMsg);
      return;
    }
    if (password.length < 8) {
      setError(passwordRow, "Mật khẩu phải có ít nhất 8 kí tự!", passwordMsg);
      return;
    }
    setSuccess(passwordRow, passwordMsg);
  }

  // Gán sự kiện blur cho các trường
  emailInput.addEventListener("blur", validateEmailOnBlur);
  passwordInput.addEventListener("blur", validatePasswordOnBlur);

  //Nút hiển thị/ẩn mật khẩu
  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    const icon = this.querySelector("i");
    icon.classList.toggle("bi-eye");
    icon.classList.toggle("bi-eye-slash");
  });

  //Xử lý submit form đăng nhập
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Gọi lại validation để cập nhật trạng thái mới nhất
    validateEmailOnBlur();
    validatePasswordOnBlur();

    // Kiểm tra cả hai trường đều hợp lệ
    const isEmailValid = emailRow.classList.contains("success");
    const isPasswordValid = passwordRow.classList.contains("success");

    if (!isEmailValid || !isPasswordValid) {
      alert("Form vẫn còn lỗi!");
      return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Lấy tài khoản đã đăng ký
    const account = getAccount();

    // Nếu chưa có tài khoản
    if (!account) {
      setError(emailRow, "Email chưa được đăng ký!", emailMsg);
      resetRow(passwordRow);
      passwordMsg.textContent = "";
      return;
    }

    // So sánh email và mật khẩu với tài khoản
    if (account.email === email && account.password === password) {
      // Lưu thông tin người dùng hiện tại (để hiển thị trên header)
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          fullname: account.fullname,
          email: account.email,
          createdAt: account.createdAt || new Date().toISOString(),
        }),
      );

      alert("Đăng nhập thành công! Chuyển hướng đến trang chủ!");
      window.location.href = "trangchu.html";
    } else {
      // Nếu email đúng nhưng mật khẩu sai
      const userExists = account.email === email;
      if (userExists) {
        setError(passwordRow, "Mật khẩu không chính xác!", passwordMsg);
        if (isValidEmail(email)) {
          setSuccess(emailRow, emailMsg);
        }
      } else {
        // Email không tồn tại
        setError(emailRow, "Email chưa được đăng ký!", emailMsg);
        resetRow(passwordRow);
        passwordMsg.textContent = "";
      }
    }
  });

  //Kiểm tra nếu đã đăng nhập thì chuyển về trang chủ
  if (localStorage.getItem("currentUser")) {
    window.location.href = "trangchu.html";
  }
});
