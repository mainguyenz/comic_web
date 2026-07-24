//object
const iconTieuChi = {
  luotXem: "👁",
  luotTheo: "❤",
  diemDanhGia: "★",
};

const SO_MUC_HIEN = 7;
let tieuChiHienTai = "luotXem";
let danhSachMoRong = false;

function xoaHetCon(el) {
  if (!el) return;
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function layGiaTriSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];
  if (typeof giaTri === "number") return giaTri;
  return parseInt(String(giaTri || "0").replace(/,/g, ""), 10) || 0; //Chuyển từ chuỗi thành số
}

function xepHangTruyen(tieuChi) {
  const ds = [...danhSachTruyen]; //Copy mảng
  ds.sort((a, b) => layGiaTriSo(b, tieuChi) - layGiaTriSo(a, tieuChi)); //Sắp xếp theo giảm dần
  return ds;
}

// Hàm định dạng tạo các node phần tử
function dinhDangChiSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];
  let chuoiSo = giaTri;

  if (tieuChi === "diemDanhGia") {
    chuoiSo = Number(giaTri).toFixed(1); //Ví dụ: 9->9.0 hoặc 9.75->9.8
  }

  const spanIcon = document.createElement("span"); // tạo html span để hiển thị icon
  spanIcon.className = "xh-chiso-icon";
  spanIcon.textContent = iconTieuChi[tieuChi];

  const spanText = document.createElement("span"); // tạo html để hiển thị số
  spanText.className = "xh-chiso-so";
  spanText.textContent = chuoiSo;

  const fragment = document.createDocumentFragment();
  fragment.append(spanIcon, spanText);
  return fragment;
}

function renderTrangXepHang() {
  const el = document.getElementById("xhDanhSach");
  if (!el) return;

  xoaHetCon(el);

  const dsXepHang = xepHangTruyen(tieuChiHienTai);
  const gioiHan = danhSachMoRong ? dsXepHang.length : 3 + SO_MUC_HIEN;
  const dsHienThi = dsXepHang.slice(0, gioiHan);

  dsHienThi.forEach((truyen, chiSo) => {
    //Lặp từng truyện sau đó tạo html
    const a = document.createElement("a");
    a.className = "xh-hang-muc";
    a.href = `trangchitiet.html?id=${truyen.id}`;

    const hangSoNho = document.createElement("div");
    hangSoNho.className = "xh-hang-so-nho";
    hangSoNho.textContent = chiSo + 1;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "xh-hang-muc-info";

    const ten = document.createElement("div");
    ten.className = "xh-hang-muc-ten";
    ten.textContent = truyen.ten;

    const tacgia = document.createElement("div");
    tacgia.className = "xh-hang-muc-tacgia";
    tacgia.textContent = truyen.tacGia || "Đang cập nhật";

    info.appendChild(ten);
    info.appendChild(tacgia);

    const chiso = document.createElement("div");
    chiso.className = "xh-hang-muc-chiso";
    // Thêm các element span con vào div chỉ số
    chiso.appendChild(dinhDangChiSo(truyen, tieuChiHienTai));

    a.append(hangSoNho, img, info, chiso);
    el.appendChild(a); //Thêm vào trang
  });
  //Nếu có trên 10 truyện thì hiện nút xem thêm
  if (dsXepHang.length > 3 + SO_MUC_HIEN) {
    const wrap = document.createElement("div");
    wrap.className = "xh-xem-them";

    const btn = document.createElement("button");
    btn.textContent = danhSachMoRong ? "▲ Thu gọn" : "▼ Xem thêm";
    btn.addEventListener("click", toggleDanhSachXepHang);

    wrap.appendChild(btn);
    el.appendChild(wrap);
  }
}

function toggleDanhSachXepHang() {
  danhSachMoRong = !danhSachMoRong;
  renderTrangXepHang();
}
//Khi click xóa active cũ và thêm active mới
function ganSuKienTab() {
  const cacNut = document.querySelectorAll(".xh-tab-nut");
  cacNut.forEach((nut) => {
    nut.addEventListener("click", function () {
      cacNut.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
      tieuChiHienTai = this.dataset.key;
      danhSachMoRong = false;
      renderTrangXepHang();
    });
  });
}

function ganNutQuayLai() {
  const nutQuayLai = document.getElementById("quaylai");
  if (!nutQuayLai) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      nutQuayLai.style.display = "block";
    } else {
      nutQuayLai.style.display = "none";
    }
  });

  nutQuayLai.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function ganTimKiem() {
  const input = document.getElementById("inputsearch");
  const goiY = document.getElementById("goiYTimKiem");

  if (!input || !goiY) return;

  input.addEventListener("input", function () {
    const tuKhoa = input.value.trim().toLowerCase();

    xoaHetCon(goiY);

    if (tuKhoa === "") {
      goiY.style.display = "none";
      return;
    }

    const daThem = new Set();
    let dem = 0;

    danhSachTruyen.forEach(function (truyen) {
      const ten = truyen.ten || "";

      if (daThem.has(ten.toLowerCase())) return;

      if (ten.toLowerCase().includes(tuKhoa)) {
        daThem.add(ten.toLowerCase());

        const link = document.createElement("a");
        link.href = `trangchitiet.html?id=${truyen.id}`;
        link.className = "item-goi-y";

        const img = document.createElement("img");
        img.src = truyen.anhBia;
        img.alt = ten;

        const span = document.createElement("span");
        span.textContent = ten;

        link.append(img, span);
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

document.addEventListener("DOMContentLoaded", () => {
  ganSuKienTab();
  renderTrangXepHang();
  ganNutQuayLai();
  ganTimKiem();
  ganMenu();
});
