
// 1. CẤU HÌNH TRANG THEO DÕI

const CAU_HINH_THEO_DOI = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  viTriHienNutQuayLai: 300,
});

// Dữ liệu từ datachitiet.js (dùng làm dự phòng nếu cần)
const duLieuTruyen =
  typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen)
    ? danhSachTruyen
    : [];

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

// 3. RENDER DANH SÁCH TRUYỆN THEO DÕI

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
      document.createTextNode(" để xem danh sách truyện đang theo dõi.")
    );
    return;
  }

  // Lấy thẳng mảng Object truyện từ LocalStorage (cơ chế giỏ hàng)
  const dsTheoDoi = typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];
  const tuKhoaThuong = String(tuKhoa).trim().toLowerCase();

  // Lọc truyện theo từ khóa (Tên hoặc Tác giả)
  const dsLoc = dsTheoDoi.filter((truyen) => {
    if (!truyen) return false;
    const ten = String(truyen.ten || "").toLowerCase();
    const tacGia = String(truyen.tacGia || "").toLowerCase();
    return tuKhoaThuong === "" || ten.includes(tuKhoaThuong) || tacGia.includes(tuKhoaThuong);
  });

  // 2. Chưa theo dõi truyện nào
  if (dsTheoDoi.length === 0) {
    xoaNoiDungPhanTu(grid);
    xoaNoiDungPhanTu(thongBaoRong);
    thongBaoRong.style.display = "block";
    thongBaoRong.appendChild(
      document.createTextNode(
        'Bạn chưa theo dõi truyện nào. Hãy vào một truyện và bấm nút " Theo Dõi" nhé!'
      )
    );
    return;
  }

  thongBaoRong.style.display = "none";

  // 3. Có theo dõi nhưng tìm kiếm không khớp
  if (dsLoc.length === 0) {
    xoaNoiDungPhanTu(grid);
    const p = document.createElement("p");
    p.textContent = "Không tìm thấy truyện phù hợp.";
    p.style.cssText = "color: white; text-align: center; grid-column: 1 / -1; padding: 40px;";
    grid.appendChild(p);
    return;
  }

  // 4. Render danh sách truyện
  xoaNoiDungPhanTu(grid);
  const fragment = document.createDocumentFragment();

  dsLoc.forEach((truyen) => {
    const khung = document.createElement("div");
    khung.className = "khungtruyenrieng td-the";

    // Nút Bỏ theo dõi (X)
    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "td-nut-bo";
    nut.dataset.id = String(truyen.id);
    nut.title = "Bỏ theo dõi";
    nut.appendChild(document.createTextNode("✕"));

    // Link đến trang chi tiết
    const link = document.createElement("a");
    link.href = `${CAU_HINH_THEO_DOI.trangChiTiet}?id=${truyen.id}`;

    const img = document.createElement("img");
    img.src = String(truyen.anhBia || "");
    img.alt = String(truyen.ten || "");

    const h3 = document.createElement("h3");
    h3.appendChild(document.createTextNode(String(truyen.ten || "")));

    link.appendChild(img);
    link.appendChild(h3);

    // Hiển thị tác giả
    const span = document.createElement("span");
    span.appendChild(document.createTextNode(truyen.tacGia || "Đang cập nhật"));

    khung.appendChild(nut);
    khung.appendChild(link);
    khung.appendChild(span);

    fragment.appendChild(khung);
  });

  grid.appendChild(fragment);
}


// SỰ KIỆN TƯƠNG TÁC DỮ LIỆU

function ganSuKienDanhSachTheoDoi() {
  const grid = document.getElementById("tdDanhSach");
  const inputTimKiem = document.getElementById("inputsearch");

  if (grid) {
    grid.addEventListener("click", (event) => {
      const nut = event.target.closest(".td-nut-bo");
      if (!nut) return;

      const idTruyen = Number(nut.dataset.id);

      // Gọi hàm xóa khỏi LocalStorage
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

    // Lấy danh sách truyện từ LocalStorage để gợi ý
    const dsTheoDoi = typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];
    let dem = 0;

    dsTheoDoi.forEach((truyen) => {
      if (!truyen) return;
      const ten = String(truyen.ten || "").toLowerCase();

      if (ten.includes(tuKhoa)) {
        const link = document.createElement("a");
        link.href = `${CAU_HINH_THEO_DOI.trangChiTiet}?id=${truyen.id}`;
        link.className = "item-goi-y";

        const img = document.createElement("img");
        img.src = truyen.anhBia || "";

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
// TIỆN ÍCH TRANG
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


document.addEventListener("DOMContentLoaded", () => {
  renderDanhSachTheoDoi();
  ganSuKienDanhSachTheoDoi();
  ganTimKiem();
  ganNutQuayLai();
  ganMenu();
});