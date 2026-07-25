/* ============================================================================
   XỬ LÝ HIỂN THỊ VÀ TƯƠNG TÁC TRANG THEO DÕI (THEODOI.JS)
   ============================================================================ */

// ==================================================
// 1. CẤU HÌNH TRANG THEO DÕI
// ==================================================

const CAU_HINH_THEO_DOI = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  viTriHienNutQuayLai: 300,
});

// Kiểm tra dữ liệu truyện nạp từ datachitiet.js
const duLieuTruyen =
  typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen)
    ? danhSachTruyen
    : [];

// ==================================================
// 2. HÀM HỖ TRỢ DOM VÀ STORAGE
// ==================================================

function xoaNoiDungPhanTu(phanTu) {
  if (!phanTu) return;
  while (phanTu.firstChild) {
    phanTu.removeChild(phanTu.firstChild);
  }
}

function layTaiKhoanHienTai() {
  try {
    const chuoi = localStorage.getItem("currentUser");
    return chuoi ? JSON.parse(chuoi) : null;
  } catch (loi) {
    console.warn("Không đọc được dữ liệu currentUser.", loi);
    return null;
  }
}

// ==================================================
// 3. RENDER DANH SÁCH TRUYỆN THEO DÕI
// ==================================================

function renderDanhSachTheoDoi(tuKhoa = "") {
  const grid = document.getElementById("tdDanhSach");
  const thongBaoRong = document.getElementById("tdRong");
  if (!grid || !thongBaoRong) return;

  const taiKhoan = layTaiKhoanHienTai();

  // 1. Trường hợp chưa đăng nhập
  if (!taiKhoan) {
    xoaNoiDungPhanTu(grid);
    xoaNoiDungPhanTu(thongBaoRong);
    thongBaoRong.style.display = "block";

    thongBaoRong.appendChild(document.createTextNode("Bạn cần "));
    const link = document.createElement("a");
    link.href = CAU_HINH_THEO_DOI.trangDangNhap;
    link.appendChild(document.createTextNode("đăng nhập"));
    thongBaoRong.appendChild(link);
    thongBaoRong.appendChild(
      document.createTextNode(" để xem danh sách truyện đang theo dõi."),
    );
    return;
  }

  // Lấy danh sách ID truyện theo dõi từ luutru.js
  const dsId =
    typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];
  const tuKhoaThuong = String(tuKhoa).trim().toLowerCase();

  const dsTruyen = duLieuTruyen.filter((truyen) => {
    if (!truyen) return false;
    const daTheoDoi = dsId.includes(Number(truyen.id));

    const ten = String(truyen.ten || "").toLowerCase();
    const tacGia = String(truyen.tacGia || "").toLowerCase();
    const theLoai = Array.isArray(truyen.theLoai)
      ? truyen.theLoai.join(" ").toLowerCase()
      : "";

    const dungTuKhoa =
      tuKhoaThuong === "" ||
      ten.includes(tuKhoaThuong) ||
      tacGia.includes(tuKhoaThuong) ||
      theLoai.includes(tuKhoaThuong);

    return daTheoDoi && dungTuKhoa;
  });

  // 2. Chưa theo dõi truyện nào
  if (dsId.length === 0) {
    xoaNoiDungPhanTu(grid);
    xoaNoiDungPhanTu(thongBaoRong);
    thongBaoRong.style.display = "block";
    thongBaoRong.appendChild(
      document.createTextNode(
        'Bạn chưa theo dõi truyện nào. Hãy vào một truyện và bấm nút " Theo Dõi" nhé!',
      ),
    );
    return;
  }

  thongBaoRong.style.display = "none";

  // 3. Có theo dõi nhưng lọc/tìm kiếm không tìm thấy
  if (dsTruyen.length === 0) {
    xoaNoiDungPhanTu(grid);
    const p = document.createElement("p");
    p.textContent = "Không tìm thấy truyện phù hợp.";
    p.style.cssText = "color: white; text-align: center; grid-column: 1 / -1; padding: 40px;";
    grid.appendChild(p);
    return;
  }

  // 4. Render danh sách các thẻ truyện
  xoaNoiDungPhanTu(grid);
  const fragment = document.createDocumentFragment();

  dsTruyen.forEach((truyen) => {
    const khung = document.createElement("div");
    khung.className = "khungtruyenrieng td-the";

    // Nút Xóa / Bỏ theo dõi
    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "td-nut-bo";
    nut.dataset.id = String(truyen.id);
    nut.title = "Bỏ theo dõi";
    nut.appendChild(document.createTextNode("✕"));

    // Thẻ liên kết chuyển sang trang chi tiết
    const link = document.createElement("a");
    link.href = `${CAU_HINH_THEO_DOI.trangChiTiet}?id=${truyen.id}`;

    const img = document.createElement("img");
    img.src = String(truyen.anhBia || "");
    img.alt = String(truyen.ten || "");

    const h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(String(truyen.ten || "")));

    link.appendChild(img);
    link.appendChild(h3);

    // Hiển thị thể loại
    const span = document.createElement("span");
    const chuoiTheLoai = Array.isArray(truyen.theLoai)
      ? truyen.theLoai.join(" - ")
      : "";
    span.appendChild(document.createTextNode(chuoiTheLoai));

    khung.appendChild(nut);
    khung.appendChild(link);
    khung.appendChild(span);

    fragment.appendChild(khung);
  });

  grid.appendChild(fragment);
}

// ==================================================
// 4. SỰ KIỆN TƯƠNG TÁC
// ==================================================

function ganSuKienDanhSachTheoDoi() {
  const grid = document.getElementById("tdDanhSach");
  const inputTimKiem = document.getElementById("inputsearch");

  if (grid) {
    grid.addEventListener("click", (event) => {
      const nut = event.target.closest(".td-nut-bo");
      if (!nut) return;

      const idTruyen = Number(nut.dataset.id);

      // Gọi hàm bỏ theo dõi từ luutru.js
      if (typeof toggleTheoDoiId === "function") {
        toggleTheoDoiId(idTruyen);
      }

      const tuKhoa = inputTimKiem ? inputTimKiem.value : "";
      renderDanhSachTheoDoi(tuKhoa);
    });
  }
}

function ganTimKiem() {
  const input = document.getElementById("inputsearch");
  const goiY = document.getElementById("goiYTimKiem");

  if (!input || !goiY) return;

  input.addEventListener("input", () => {
    const tuKhoa = input.value.trim().toLowerCase();
    goiY.replaceChildren();

    if (tuKhoa === "") {
      goiY.style.display = "none";
      return;
    }

    const dsId =
      typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];

    let dem = 0;

    duLieuTruyen.forEach((truyen) => {
      if (!dsId.includes(Number(truyen.id))) return;

      const ten = String(truyen.ten || "").toLowerCase();

      if (ten.includes(tuKhoa)) {
        const link = document.createElement("a");
        link.href = `${CAU_HINH_THEO_DOI.trangChiTiet}?id=${truyen.id}`;
        link.className = "item-goi-y";

        const img = document.createElement("img");
        img.src = truyen.anhBia;

        const span = document.createElement("span");
        span.textContent = truyen.ten;

        link.appendChild(img);
        link.appendChild(span);
        goiY.appendChild(link);

        dem++;
      }
    });

    if (dem === 0) {
      const p = document.createElement("p");
      p.textContent = "Không tìm thấy truyện";
      p.style.padding = "12px";
      goiY.appendChild(p);
    }

    goiY.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    const searchContainer = document.querySelector(".search");
    if (searchContainer && !searchContainer.contains(e.target)) {
      goiY.style.display = "none";
    }
  });
}

function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");
  if (!nut) return;

  window.addEventListener("scroll", () => {
    nut.style.display =
      window.scrollY > CAU_HINH_THEO_DOI.viTriHienNutQuayLai ? "block" : "none";
  });

  nut.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function ganMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    menu.classList.remove("active");
  });
}

// ==================================================
// 5. KHỞI CHẠY TRANG
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
  renderDanhSachTheoDoi();
  ganSuKienDanhSachTheoDoi();
  ganNutQuayLai();
  ganMenu();
  ganTimKiem();
});