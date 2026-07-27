// Chờ cho toàn bộ cấu trúc HTML của trang web được tải xong trước khi thực thi script
document.addEventListener("DOMContentLoaded", function () {
    // Lấy phần tử HTML chứa giao diện khi người dùng CHƯA đăng nhập (vd: nút Đăng nhập/Đăng ký)
    const khuChuaDangNhap = document.getElementById("khuChuaDangNhap");
    // Lấy phần tử HTML chứa giao diện khi người dùng ĐÃ đăng nhập (vd: avatar, tên tài khoản)
    const khuDaDangNhap = document.getElementById("khuDaDangNhap");
    // Lấy nút dùng để click vào xem thông tin/bảng tài khoản
    const nutTaiKhoan = document.getElementById("nutTaiKhoan");
    // Lấy bảng/dropdown chứa chi tiết thông tin tài khoản (ẩn/hiện khi click nút)
    const bangTaiKhoan = document.getElementById("bangTaiKhoan");
    // Lấy nút thực hiện hành động đăng xuất
    const nutDangXuat = document.getElementById("nutDangXuat");

    // Kiểm tra an toàn: Nếu trang hiện tại không chứa đủ các phần tử tài khoản này thì dừng script (tránh lỗi Javascript)
    if (
        !khuChuaDangNhap ||
        !khuDaDangNhap ||
        !nutTaiKhoan ||
        !bangTaiKhoan ||
        !nutDangXuat
    ) {
        return; // Thoát khỏi hàm ngay lập tức
    }

    // Khởi tạo biến lưu trữ thông tin người dùng hiện tại, mặc định là null
    let currentUser = null;

    try {
        // Đọc dữ liệu 'currentUser' dạng chuỗi JSON từ localStorage và chuyển thành đối tượng (object)
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch (error) {
        // Nếu chuỗi JSON bị lỗi hoặc không hợp lệ, xóa dữ liệu hỏng trong localStorage để tránh lỗi ứng dụng
        localStorage.removeItem("currentUser");
    }

    // Xử lý trường hợp CHƯA đăng nhập (không có dữ liệu currentUser)
    if (!currentUser) {
        // Bỏ class 'tai-khoan-an' để HIỆN khu vực chưa đăng nhập
        khuChuaDangNhap.classList.remove("tai-khoan-an");
        // Thêm class 'tai-khoan-an' để ẨN khu vực đã đăng nhập
        khuDaDangNhap.classList.add("tai-khoan-an");
        return; // Kết thúc nhánh xử lý chưa đăng nhập
    }

    // Xử lý trường hợp ĐÃ đăng nhập thành công
    // Thêm class 'tai-khoan-an' để ẨN khu vực chưa đăng nhập
    khuChuaDangNhap.classList.add("tai-khoan-an");
    // Bỏ class 'tai-khoan-an' để HIỆN khu vực đã đăng nhập
    khuDaDangNhap.classList.remove("tai-khoan-an");

    // Hiển thị tên tài khoản ở thanh điều hướng: Ưu tiên lấy 'fullname', nếu không có sẽ lấy 'email'
    document.getElementById("tenTaiKhoan").textContent =
        currentUser.fullname || currentUser.email;

    // Hiển thị họ tên đầy đủ trong bảng thông tin: Ưu tiên 'fullname', nếu không có hiển thị "Chưa cập nhật"
    document.getElementById("hoTenTaiKhoan").textContent =
        currentUser.fullname || "Chưa cập nhật";

    // Hiển thị email trong bảng thông tin: Ưu tiên 'email', nếu không có hiển thị "Chưa cập nhật"
    document.getElementById("emailTaiKhoan").textContent =
        currentUser.email || "Chưa cập nhật";

    // Định dạng lại ngày tạo tài khoản theo chuẩn Việt Nam (DD/MM/YYYY), nếu không có thì ghi "Chưa có thông tin"
    const ngayTao = currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString("vi-VN")
        : "Chưa có thông tin";

    // Gán chuỗi ngày tạo tài khoản vừa định dạng vào phần tử HTML tương ứng
    document.getElementById("ngayTaoTaiKhoan").textContent = ngayTao;

    // Lắng nghe sự kiện click vào nút tài khoản để MỞ hoặc ĐÓNG bảng thông tin
    nutTaiKhoan.addEventListener("click", function (event) {
        // Ngăn sự kiện 'click' lan ra ngoài document (tránh việc vừa mở ra đã bị gỡ do sự kiện click document bên dưới)
        event.stopPropagation();
        // Bật/tắt class 'tai-khoan-an' (nếu đang ẩn thì hiện, đang hiện thì ẩn)
        bangTaiKhoan.classList.toggle("tai-khoan-an");
    });

    // Lắng nghe sự kiện click trực tiếp bên trong bảng tài khoản
    bangTaiKhoan.addEventListener("click", function (event) {
        // Ngăn sự kiện 'click' nổi bọt ra ngoài document để bảng không bị đóng khi người dùng thao tác bên trong
        event.stopPropagation();
    });

    // Lắng nghe sự kiện click ở bất kỳ đâu trên toàn bộ trang web
    document.addEventListener("click", function () {
        // Tự động đóng/ẩn bảng tài khoản bằng cách thêm lại class 'tai-khoan-an'
        bangTaiKhoan.classList.add("tai-khoan-an");
    });

    // Lắng nghe sự kiện click vào nút 'Đăng xuất'
    nutDangXuat.addEventListener("click", function () {
        // Xóa thông tin phiên làm việc hiện tại khỏi localStorage
        localStorage.removeItem("currentUser");
        // Xóa thông tin ghi nhớ đăng nhập (nếu có)
        localStorage.removeItem("rememberMe");
        // Chuyển hướng người dùng về lại trang chủ 'trangchu.html'
        window.location.href = "trangchu.html";
    });
});
