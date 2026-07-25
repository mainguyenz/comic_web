/* ============================================================================
   XỬ LÝ LƯU TRỮ TÀI KHOẢN & THEO DÕI (LOCALSTORAGE)
   ============================================================================ */

// ==================================================
// 1. TÀI KHOẢN HIỆN TẠI
// ==================================================

function layTaiKhoanLuuTruHienTai() {
  try {
    const chuoi = localStorage.getItem("currentUser");
    return chuoi ? JSON.parse(chuoi) : null;
  } catch (error) {
    return null;
  }
}

function layMaTaiKhoanLuuTru() {
  return "comic_user";
}

function layMaTaiKhoanTheoDoi() {
  return layMaTaiKhoanLuuTru();
}

// ==================================================
// 2. THEO DÕI (LƯU TRỰC TIẾP OBJECT CHI TIẾT TRUYỆN)
// ==================================================

const KHOA_THEO_DOI_PREFIX = "theoDoi_";

function layKhoaTheoDoi() {
  return KHOA_THEO_DOI_PREFIX + layMaTaiKhoanLuuTru(); 
  // Kết quả cố định luôn là: "theoDoi_comic_user"
}

function layDanhSachTheoDoi() {
  const khoa = layKhoaTheoDoi();

  try {
    const chuoi = localStorage.getItem(khoa);
    const danhSach = chuoi ? JSON.parse(chuoi) : [];

    if (!Array.isArray(danhSach)) {
      return [];
    }

    return danhSach;
  } catch (error) {
    return [];
  }
}

function luuDanhSachTheoDoi(danhSach) {
  const khoa = layKhoaTheoDoi();
  localStorage.setItem(khoa, JSON.stringify(danhSach));
  return true;
}

function kiemTraDaTheoDoi(idTruyen) {
  const idNum = Number(idTruyen);
  const danhSach = layDanhSachTheoDoi();
  // Kiểm tra id nằm trong mảng các Object truyện
  return danhSach.some((item) => Number(item.id) === idNum);
}

function toggleTheoDoiId(idTruyen) {
  if (!layTaiKhoanLuuTruHienTai()) {
    alert("Bạn cần đăng nhập để theo dõi truyện!");
    return false;
  }

  const idNum = Number(idTruyen);
  let danhSach = layDanhSachTheoDoi();
  const index = danhSach.findIndex((item) => Number(item.id) === idNum);

  if (index !== -1) {
    // Đã có trong danh sách -> Xóa (Bỏ theo dõi)
    danhSach.splice(index, 1);
    luuDanhSachTheoDoi(danhSach);
    alert("Đã bỏ theo dõi truyện!");
    return false;
  } else {
    // Chưa có -> Lấy chi tiết truyện để lưu Object đầy đủ thông tin
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
      ngayTheoDoi: new Date().toISOString(),
    };

    danhSach.push(thongTinLuu);
    luuDanhSachTheoDoi(danhSach);
    alert("Đã thêm truyện vào danh sách theo dõi!");
    return true;
  }
}