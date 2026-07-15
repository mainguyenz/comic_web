const iconTieuChi = {
  luotXem: "👁",
  luotTheo: "❤",
  diemDanhGia: "★",
};

const SO_MUC_HIEN = 10;
let tieuChiHienTai = "luotXem";
let danhSachMoRong = false;

function xoaHetCon(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function layGiaTriSo(truyen, tieuChi) {
  const giaTri = truyen[tieuChi];

  if (typeof giaTri === "number") {
    return giaTri;
  }

  return parseInt(giaTri.replace(/,/g, "")) || 0;
}

function xepHangTruyen(tieuChi) {
  const ds = [...danhSachTruyen];
  ds.sort((a, b) => layGiaTriSo(b, tieuChi) - layGiaTriSo(a, tieuChi));
  return ds;
}

function dinhDangChiSo(truyen, tieuChi) {
  return `${iconTieuChi[tieuChi]} ${truyen[tieuChi]}`;
}

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

function renderTop3(dsXepHang) {
  const el = document.getElementById("xhTop3");
  xoaHetCon(el);

  const top3 = dsXepHang.slice(0, 3);

  top3.forEach((truyen, chiSo) => {
    const a = document.createElement("a");
    a.className = `xh-top3-the hang-${chiSo + 1}`;
    a.href = `/trangchitiet.html?id=${truyen.id}`;

    const hangSo = document.createElement("div");
    hangSo.className = "xh-hang-so";
    hangSo.textContent = chiSo + 1;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const info = document.createElement("div");
    info.className = "xh-top3-info";

    const ten = document.createElement("div");
    ten.className = "xh-top3-ten";
    ten.textContent = truyen.ten;

    const chiso = document.createElement("div");
    chiso.className = "xh-top3-chiso";
    chiso.textContent = dinhDangChiSo(truyen, tieuChiHienTai);

    info.appendChild(ten);
    info.appendChild(chiso);
    a.appendChild(hangSo);
    a.appendChild(img);
    a.appendChild(info);
    el.appendChild(a);
  });
}

function renderDanhSach(dsXepHang) {
  const el = document.getElementById("xhDanhSach");
  xoaHetCon(el);

  const conLai = dsXepHang.slice(3);
  const dsHienThi = danhSachMoRong ? conLai : conLai.slice(0, SO_MUC_HIEN);

  dsHienThi.forEach((truyen, chiSo) => {
    const a = document.createElement("a");
    a.className = "xh-hang-muc";
    a.href = `/trangchitiet.html?id=${truyen.id}`;

    const hangSoNho = document.createElement("div");
    hangSoNho.className = "xh-hang-so-nho";
    hangSoNho.textContent = chiSo + 4;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const info = document.createElement("div");
    info.className = "xh-hang-muc-info";

    const ten = document.createElement("div");
    ten.className = "xh-hang-muc-ten";
    ten.textContent = truyen.ten;

    const tacgia = document.createElement("div");
    tacgia.className = "xh-hang-muc-tacgia";
    tacgia.textContent = truyen.tacGia;

    info.appendChild(ten);
    info.appendChild(tacgia);

    const chiso = document.createElement("div");
    chiso.className = "xh-hang-muc-chiso";
    chiso.textContent = dinhDangChiSo(truyen, tieuChiHienTai);

    a.appendChild(hangSoNho);
    a.appendChild(img);
    a.appendChild(info);
    a.appendChild(chiso);
    el.appendChild(a);
  });

  if (conLai.length > SO_MUC_HIEN) {
    const wrap = document.createElement("div");
    wrap.className = "xh-xem-them";

    const btn = document.createElement("button");
    btn.textContent = danhSachMoRong ? "▲ Thu gọn" : "▼ Xem thêm";
    btn.addEventListener("click", toggleDanhSachXepHang);

    wrap.appendChild(btn);
    el.appendChild(wrap);
  }
}

function renderTrangXepHang() {
  const dsXepHang = xepHangTruyen(tieuChiHienTai);
  renderTop3(dsXepHang);
  renderDanhSach(dsXepHang);
}

function toggleDanhSachXepHang() {
  danhSachMoRong = !danhSachMoRong;
  const dsXepHang = xepHangTruyen(tieuChiHienTai);
  renderDanhSach(dsXepHang);
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

function ganMenuToggle() {
  const btnToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (!btnToggle || !menu) return;

  btnToggle.addEventListener("click", function () {
    menu.classList.toggle("menu-open");
  });
}

//Tìm Kiếm Truyện
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);
  xoaHetCon(khung);

  danhSach.forEach((truyen) => {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = `/trangchitiet.html?id=${truyen.id}`;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    a.appendChild(img);
    a.appendChild(h3);

    const span = document.createElement("span");
    span.textContent = truyen.theLoai.join(" • ");

    div.appendChild(a);
    div.appendChild(span);
    khung.appendChild(div);
  });
}

function ganTimKiem() {
  const search = document.getElementById("inputsearch");
  const khungKetQua = document.getElementById("khungKetQua");
  const ketquatimkiem = document.getElementById("ketquatimkiem");
  const breadcrumb = document.querySelector(".breadcrumb");
  const xephang = document.getElementById("sectionXepHang");

  search.addEventListener("input", function () {
    const tuKhoa = search.value.trim().toLowerCase();

    if (tuKhoa === "") {
      ketquatimkiem.style.display = "none";
      breadcrumb.style.display = "block";
      xephang.style.display = "block";
      return;
    }

    ketquatimkiem.style.display = "block";
    breadcrumb.style.display = "none";
    xephang.style.display = "none";

    const ketQua = danhSachTruyen.filter(function (truyen) {
      return (
        truyen.ten.toLowerCase().includes(tuKhoa) ||
        truyen.tacGia.toLowerCase().includes(tuKhoa) ||
        truyen.theLoai.join(" ").toLowerCase().includes(tuKhoa)
      );
    });

    if (ketQua.length === 0) {
      xoaHetCon(khungKetQua);
      const p = document.createElement("p");
      p.textContent =
        "🔍 Không tìm thấy truyện phù hợp vui lòng nhập từ khóa khác";
      p.style.color = "white";
      p.style.fontSize = "20px";
      p.style.textAlign = "center";
      p.style.padding = "40px";
      khungKetQua.style.display = "block";
      khungKetQua.appendChild(p);
      return;
    }

    hienThiTruyen("khungKetQua", ketQua);
    khungKetQua.style.display = "grid";
  });
}

//Nút Menu
function ganMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
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
  ganMenuToggle();
  ganTimKiem();
  ganMenu();
});
