/*
  Họ tên: Lê Khánh Băng
  MSSV: B2404852
  Email: bangb2404852@student.ctu.edu.vn
  Tài liệu tham khảo: 
  + BGR 
  + TLTK3 (c5,c6)
  + W3Schools (https://www.w3schools.com/)
  + Bootstrap Icons (https://icons.getbootstrap.com/ & jsDelivr CDN)
*/
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
    id: Number(truyenChiTiet.id),
    ten: truyenChiTiet.ten || truyenChiTiet.tenTruyen,
    anhBia: truyenChiTiet.anhBia || truyenChiTiet.hinhAnh,
    tacGia: truyenChiTiet.tacGia || "Đang cập nhật",
    tinhTrang: truyenChiTiet.tinhTrang || "Đang ra",
    moTa: truyenChiTiet.moTa || "Chưa có mô tả cho truyện này.",
    ngayTheoDoi: new Date().toLocaleString("vi-VN") 
  };

  danhSach.push(thongTinLuu);
  luuDanhSachTheoDoi(danhSach);
  alert("Đã thêm truyện vào danh sách theo dõi!");
  return true;
}

// 4. THÊM NHIỀU TRUYỆN HÀNG LOẠT
function themNhieuTheoDoi(danhSachId) {
  if (!layTaiKhoanLuuTruHienTai()) {
    alert("Bạn cần đăng nhập để theo dõi truyện!");
    return false;
  }

  let danhSach = layDanhSachTheoDoi();
  let soLuongThem = 0;

  danhSachId.forEach((id) => {
    const idNum = Number(id);
    const daCo = danhSach.some((item) => Number(item.id) === idNum);

    if (!daCo) {
      const truyenChiTiet = typeof layTruyenTheoId === "function" ? layTruyenTheoId(idNum) : null;
      const truyen = truyenChiTiet || (typeof duLieuTruyen !== "undefined" ? duLieuTruyen.find(t => Number(t.id) === idNum) : null);

      if (truyen) {
        danhSach.push({
          id: Number(truyen.id),
          ten: truyen.ten || truyen.tenTruyen,
          anhBia: truyen.anhBia || truyen.hinhAnh,
          tacGia: truyen.tacGia || "Đang cập nhật",
          tinhTrang: truyen.tinhTrang || "Đang ra",
          moTa: truyen.moTa || "Chưa có mô tả.",
          ngayTheoDoi: new Date().toLocaleString("vi-VN")
        });
        soLuongThem++;
      }
    }
  });

  if (soLuongThem > 0) {
    luuDanhSachTheoDoi(danhSach);
    alert(`Đã thêm ${soLuongThem} truyện vào danh sách theo dõi!`);
    return true;
  }
  return false;
}