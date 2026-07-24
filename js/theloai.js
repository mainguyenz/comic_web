document.addEventListener("DOMContentLoaded", function () {
  // Lấy tham số thể loại từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const theloai = urlParams.get("theloai");

  const khung = document.getElementById("khungTruyenTheoLoai");
  const title = document.getElementById("theloai-title");
  const emptyMsg = document.getElementById("empty-message");

  // Kiểm tra nếu không có tham số theloai -> hiển thị tất cả
  let danhSachHienThi = [];
  let tieuDe = "📚 Tất Cả Thể Loại";

  if (theloai) {
    // Lọc truyện theo thể loại (không phân biệt hoa thường)
    danhSachHienThi = danhSachTruyen.filter((truyen) =>
      truyen.theLoai.some((tl) => tl.toLowerCase() === theloai.toLowerCase()),
    );
    tieuDe = `📚 Thể loại: ${theloai}`;
  } else {
    danhSachHienThi = danhSachTruyen;
  }

  title.textContent = tieuDe;

  // Nếu không có truyện, hiển thị thông báo
  // Nếu không có truyện
  if (danhSachHienThi.length === 0) {
    khung.replaceChildren();
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  khung.replaceChildren();

  danhSachHienThi.forEach(function (truyen) {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = "trangchitiet.html?id=" + truyen.id;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    const span = document.createElement("span");
    span.textContent = truyen.theLoai.join(" - ");

    a.appendChild(img);
    a.appendChild(h3);

    div.appendChild(a);
    div.appendChild(span);

    khung.appendChild(div);
  });
  ganTimKiem();
  ganMenu();
  ganNutQuayLai();
});
function hienThiTruyen(idKhung, danhSach) {
  const khung = document.getElementById(idKhung);

  khung.replaceChildren();

  danhSach.forEach(function (truyen) {
    const div = document.createElement("div");
    div.className = "khungtruyenrieng";

    const a = document.createElement("a");
    a.href = "trangchitiet.html?id=" + truyen.id;

    const img = document.createElement("img");
    img.src = truyen.anhBia;
    img.alt = truyen.ten;

    const h3 = document.createElement("h3");
    h3.textContent = truyen.ten;

    const span = document.createElement("span");
    span.textContent = truyen.theLoai.join(" • ");

    a.appendChild(img);
    a.appendChild(h3);

    div.appendChild(a);
    div.appendChild(span);

    khung.appendChild(div);
  });
}
function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");

  if (!nut) return;

  window.addEventListener("scroll", function () {
    nut.style.display = window.scrollY > 300 ? "block" : "none";
  });

  nut.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
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

    const daThem = new Set();

    let dem = 0;

    danhSachTruyen.forEach(function (truyen) {
      const ten = truyen.ten.toLowerCase();

      if (ten.includes(tuKhoa) && !daThem.has(ten)) {
        daThem.add(ten);

        const link = document.createElement("a");

        link.href = "trangchitiet.html?id=" + truyen.id;

        link.className = "item-goi-y";

        const img = document.createElement("img");

        img.src = truyen.anhBia;

        img.alt = truyen.ten;

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
//Nút Menu
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
