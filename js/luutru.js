
// 1. QUẢN LÝ TÀI KHOẢN 

function layTaiKhoanLuuTruHienTai() {
  try {
    const chuoi = localStorage.getItem("currentUser");
    return chuoi ? JSON.parse(chuoi) : null;
  } catch (error) {
    console.warn("Lỗi đọc currentUser từ localStorage:", error);
    return null;
  }
}

function layMaTaiKhoanLuuTru() {
  return "comic_user";
}

function layMaTaiKhoanTheoDoi() {
  return layMaTaiKhoanLuuTru();
}

// 2. TRUY XUẤT LOCALSTORAGE THEO DÕI (CƠ CHẾ GIỎ HÀNG)

const KHOA_THEO_DOI_PREFIX = "theoDoi_";

function layKhoaTheoDoi() {
  return KHOA_THEO_DOI_PREFIX + layMaTaiKhoanLuuTru(); 
  // Kết quả cố định: "theoDoi_comic_user"
}

function layDanhSachTheoDoi() {
  const khoa = layKhoaTheoDoi();
  try {
    const chuoi = localStorage.getItem(khoa);
    const danhSach = chuoi ? JSON.parse(chuoi) : [];
    return Array.isArray(danhSach) ? danhSach : [];
  } catch (error) {
    console.warn("Lỗi đọc danh sách theo dõi:", error);
    return [];
  }
}

function luuDanhSachTheoDoi(danhSach) {
  try {
    const khoa = layKhoaTheoDoi();
    localStorage.setItem(khoa, JSON.stringify(danhSach));
    return true;
  } catch (error) {
    console.error("Lỗi lưu danh sách theo dõi:", error);
    return false;
  }
}

// 3. THAO TÁC THEO DÕI (KIỂM TRA / THÊM / XÓA OBJECT)

function kiemTraDaTheoDoi(idTruyen) {
  const idNum = Number(idTruyen);
  const danhSach = layDanhSachTheoDoi();
  // Kiểm tra id nằm trong mảng các Object truyện
  return danhSach.some((item) => Number(item.id) === idNum);
}

function toggleTheoDoiId(idTruyen) {
  // 1. Kiểm tra đăng nhập
  if (!layTaiKhoanLuuTruHienTai()) {
    alert("Bạn cần đăng nhập để theo dõi truyện!");
    return false;
  }

  const idNum = Number(idTruyen);
  let danhSach = layDanhSachTheoDoi();
  const index = danhSach.findIndex((item) => Number(item.id) === idNum);

  // 2. Nếu đã có -> Xóa khỏi danh sách (Bỏ theo dõi)
  if (index !== -1) {
    danhSach.splice(index, 1);
    luuDanhSachTheoDoi(danhSach);
    alert("Đã bỏ theo dõi truyện!");
    return false;
  } 

  // 3. Nếu chưa có -> Lấy Object chi tiết và lưu vào mảng
  const truyenChiTiet =
    typeof layTruyenTheoId === "function" ? layTruyenTheoId(idNum) : null;

  if (!truyenChiTiet) {
    alert("Lỗi: Không tìm thấy thông tin truyện!");
    return false;
  }

  const thongTinLuu = {
    id: truyenChiTiet.id,
    ten: truyenChiTiet.ten,
    anhBia: truyenChiTiet.anhBia,
    tacGia: truyenChiTiet.tacGia || "Đang cập nhật",
    tinhTrang: truyenChiTiet.tinhTrang || "Đang ra",
    moTa: truyenChiTiet.moTa || "Chưa có mô tả cho truyện này.",
    // Lưu thẳng theo chuẩn ngày/giờ chuẩn Việt Nam (24h)
    ngayTheoDoi: new Date().toLocaleString("sv-SE") 
  };

  danhSach.push(thongTinLuu);
  luuDanhSachTheoDoi(danhSach);
  alert("Đã thêm truyện vào danh sách theo dõi!");
  return true;
}