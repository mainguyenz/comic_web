// ==================================================
// 1. CẤU HINH TRANG THEO DÕI
// ==================================================

const CAU_HINH_THEO_DOI = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  viTriHienNutQuayLai: 300,
});

// Kiểm tra danh sách truyện đã được nạp từ datachitiet.js hay chưa
const duLieuTruyen =
  typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen)
    ? danhSachTruyen
    : [];

// ==================================================
// 2. HÀM HỖ TRỢ DOM VÀ STORAGE
// ==================================================

// Xóa sạch toàn bộ node con của một phần tử thuần DOM
function xoaNoiDungPhanTu(phanTu) {
  if (!phanTu) return;
  while (phanTu.firstChild) {
    phanTu.removeChild(phanTu.firstChild);
  }
}

// Lấy thông tin tài khoản đang đăng nhập
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

function renderDanhSachTheoDoi(tuKhoa) {
  if (tuKhoa === undefined) tuKhoa = "";

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

  const dsTruyen = duLieuTruyen.filter(function (truyen) {
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

  // 2. Trường hợp tài khoản chưa theo dõi truyện nào
  if (dsId.length === 0) {
    xoaNoiDungPhanTu(grid);
    xoaNoiDungPhanTu(thongBaoRong);
    thongBaoRong.style.display = "block";
    thongBaoRong.appendChild(
      document.createTextNode(
        'Bạn chưa theo dõi truyện nào. Hãy vào một truyện và bấm nút "🔔 Theo Dõi" nhé!',
      ),
    );
    return;
  }

  thongBaoRong.style.display = "none";

  // 3. Có truyện theo dõi nhưng tìm kiếm không ra kết quả
  if (dsTruyen.length === 0) {
    xoaNoiDungPhanTu(grid);

    const p = document.createElement("p");
    p.appendChild(document.createTextNode("Không tìm thấy truyện phù hợp."));
    p.style.color = "white";
    p.style.textAlign = "center";
    p.style.gridColumn = "1 / -1";
    p.style.padding = "40px";

    grid.appendChild(p);
    return;
  }

  // 4. Render danh sách thẻ truyện theo dõi
  xoaNoiDungPhanTu(grid);
  const fragment = document.createDocumentFragment();

  dsTruyen.forEach(function (truyen) {
    const khung = document.createElement("div");
    khung.className = "khungtruyenrieng td-the";

    // Nút Bỏ theo dõi (X)
    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "td-nut-bo";
    nut.dataset.id = String(truyen.id);
    nut.title = "Bỏ theo dõi";
    nut.appendChild(document.createTextNode("✕"));

    // Link thẻ truyện
    const link = document.createElement("a");
    link.href = CAU_HINH_THEO_DOI.trangChiTiet + "?id=" + String(truyen.id);

    const img = document.createElement("img");
    img.src = String(truyen.anhBia || "");
    img.alt = String(truyen.ten || "");

    const h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(String(truyen.ten || "")));

    link.appendChild(img);
    link.appendChild(h3);

    // Thể loại
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
    grid.addEventListener("click", function (event) {
      const nut = event.target.closest(".td-nut-bo");
      if (!nut) return;

      const idTruyen = Number(nut.dataset.id);

      // Gọi hàm bỏ/thêm theo dõi từ luutru.js
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

  input.addEventListener("input", function () {
    const tuKhoa = input.value.trim().toLowerCase();

    goiY.replaceChildren();

    if (tuKhoa === "") {
      goiY.style.display = "none";
      return;
    }

    const dsId =
      typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];

    let dem = 0;

    duLieuTruyen.forEach(function (truyen) {
      // chỉ tìm truyện đang theo dõi
      if (!dsId.includes(Number(truyen.id))) return;

      const ten = truyen.ten.toLowerCase();

      if (ten.includes(tuKhoa)) {
        const link = document.createElement("a");

        link.href = "trangchitiet.html?id=" + truyen.id;

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

  document.addEventListener("click", function (e) {
    if (!document.querySelector(".search").contains(e.target)) {
      goiY.style.display = "none";
    }
  });
}

function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");
  if (!nut) return;

  window.addEventListener("scroll", function () {
    nut.style.display =
      window.scrollY > CAU_HINH_THEO_DOI.viTriHienNutQuayLai ? "block" : "none";
  });

  nut.addEventListener("click", function () {
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

  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  menu.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    menu.classList.remove("active");
  });
}

// ==================================================
// 5. KHỞI CHẠY TRANG
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
  renderDanhSachTheoDoi();
  ganSuKienDanhSachTheoDoi();
  ganNutQuayLai();
  ganMenu();
  ganTimKiem();
});
