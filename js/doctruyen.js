// ==================================================
// 1. CẤU HÌNH TRANG ĐỌC TRUYỆN
// ==================================================

const duLieuChuong =
  typeof chapters !== "undefined" && Array.isArray(chapters) ? chapters : [];

// Kiểm tra danh sách truyện đã được nạp từ datachitiet.js hay chưa.
const duLieuTruyen =
  typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen)
    ? danhSachTruyen
    : [];




// Chuyển một giá trị thành số nguyên dương hợp lệ.
// Nếu giá trị rỗng, không phải số hoặc vượt giới hạn thì trả về mặc định.
function laySoNguyenDuong(value, giaTriMacDinh, giaTriToiDa) {
  if (value === null || String(value).trim() === "") return giaTriMacDinh;

  const so = Number(value);
  if (!Number.isSafeInteger(so) || so < 1 || so > giaTriToiDa) {
    return giaTriMacDinh;
  }

  return so;
}

// Chuyển dữ liệu thành chuỗi, xóa khoảng trắng thừa
// và cắt chuỗi theo số ký tự tối đa.
function gioiHanChuoi(value, soKyTuToiDa) {
  return String(value ?? "")
    .trim()
    .slice(0, soKyTuToiDa);
}

function xoaNoiDungPhanTu(phanTu) {
  if (!phanTu) return;

  while (phanTu.firstChild) {
    phanTu.removeChild(phanTu.firstChild);
  }
}

// Tạo đường dẫn URL và thêm các tham số truy vấn hợp lệ.
// Ví dụ: doctruyen.html?id=1&chapter=2
function taoDuongDan(tenTrang, thamSo = {}) {
  const query = new URLSearchParams();

  Object.entries(thamSo).forEach(([ten, giaTri]) => {
    if (giaTri !== null && giaTri !== undefined && giaTri !== "") {
      query.set(ten, String(giaTri));
    }
  });

  const chuoiQuery = query.toString();
  return chuoiQuery ? `${tenTrang}?${chuoiQuery}` : tenTrang;
}




// Hiển thị thông báo lỗi trong khu vực đọc truyện
// khi không tìm thấy truyện hoặc chapter.
function hienThiLoiDocTruyen(thongBao) {
  const reader = document.querySelector(".reader");
  if (!reader) return;

  xoaNoiDungPhanTu(reader);
  const tieuDe = document.createElement("h2");
  tieuDe.textContent = thongBao;
  reader.appendChild(tieuDe);
}

// Đọc id truyện và số chapter từ URL hiện tại.
const thamSoUrl = new URLSearchParams(window.location.search);

// Kiểm tra và lấy ID truyện hợp lệ từ URL.
const idTruyen = laySoNguyenDuong(
  thamSoUrl.get("id"),
  null,
  1000,
);

// Kiểm tra và lấy chapter hợp lệ từ URL.
const soChapter = laySoNguyenDuong(
  thamSoUrl.get("chapter"),
  1,
  100000,
);

// Tìm thông tin truyện dựa trên ID.
const truyen = duLieuTruyen.find((item) => item?.id === idTruyen) ?? null;

// Tìm nội dung chapter dựa trên ID truyện và số chapter.
const chap =
  duLieuChuong.find(
    (item) => item?.id === idTruyen && item?.chapter === soChapter,
  ) ?? null;





// Gắn ID truyện vào các liên kết quay về trang chi tiết.
function ganLienKetCoBan() {
  if (!truyen) return;

  document.querySelectorAll(".menus").forEach((menu) => {
    menu.href = taoDuongDan("trangchitiet.html", {
      id: truyen.id,
    });
  });
}

// Tìm chapter trước và chapter sau, sau đó cập nhật các nút điều hướng ở đầu và cuối trang.
function ganDieuHuongChapter() {
  if (!truyen || !chap) return;

  const danhSachChap = duLieuChuong
    .filter((item) => item?.id === truyen.id)
    .slice()
    .sort((a, b) => a.chapter - b.chapter);
  const viTriHienTai = danhSachChap.findIndex(
    (item) => item.chapter === chap.chapter,
  );
  const chapTruoc = danhSachChap[viTriHienTai - 1];
  const chapSau = danhSachChap[viTriHienTai + 1];

  document.querySelectorAll(".nav_inline").forEach((nav) => {
    const cacNut = nav.querySelectorAll(".arrow-box");
    const nutTruoc = cacNut[0];
    const nutSau = cacNut[1];
    if (!nutTruoc || !nutSau) return;

    ganTrangThaiNutChapter(nutTruoc, chapTruoc, "Đây là chapter đầu tiên");
    ganTrangThaiNutChapter(nutSau, chapSau, "Đây là chapter cuối cùng");
  });
}

// Cập nhật trạng thái một nút chuyển chapter.
// Nếu không có chapter đích thì vô hiệu hóa nút.
function ganTrangThaiNutChapter(nut, chapterDich, thongBaoBien) {
  if (!chapterDich) {
    nut.removeAttribute("href");
    nut.classList.add("disabled");
    nut.setAttribute("aria-disabled", "true");
    nut.title = thongBaoBien;
    return;
  }

  nut.href = taoDuongDan("doctruyen.html", {
    id: truyen.id,
    chapter: chapterDich.chapter,
  });
  nut.classList.remove("disabled");
  nut.setAttribute("aria-disabled", "false");
  nut.title = `Chapter ${chapterDich.chapter}`;
}

// Tạo và hiển thị ảnh của chapter hiện tại.
function renderNoiDungChapter() {
  if (!chap) return;

  document.querySelectorAll(".chapter-name").forEach((phanTu) => {
    phanTu.textContent = `Chapter ${chap.chapter}`;
  });

  const reader = document.querySelector(".reader");
  if (!reader) return;

  xoaNoiDungPhanTu(reader);
  const fragment = document.createDocumentFragment();
  const danhSachAnh = Array.isArray(chap.images)
    ? chap.images.slice(0, 500)
    : [];

  danhSachAnh.forEach((duongDanAnh, index) => {
    const anh = document.createElement("img");
    anh.src = String(duongDanAnh);
    anh.alt = `Trang ${index + 1} - Chapter ${chap.chapter}`;
    anh.loading = index < 2 ? "eager" : "lazy";
    fragment.appendChild(anh);
  });
  reader.appendChild(fragment);
}

// Tạo danh sách chapter của truyện và đánh dấu chapter đang đọc.
function renderDanhSachChapter() {
  if (!truyen) return;

  const danhSach = duLieuChuong
    .filter((item) => item?.id === truyen.id)
    .slice()
    .sort((a, b) => a.chapter - b.chapter);

  document.querySelectorAll(".chapter-list").forEach((khung) => {
    xoaNoiDungPhanTu(khung);
    const fragment = document.createDocumentFragment();

    danhSach.forEach((item) => {
      const link = document.createElement("a");
      link.href = taoDuongDan("doctruyen.html", {
        id: truyen.id,
        chapter: item.chapter,
      });
      link.textContent = `Chapter ${item.chapter}`;
      link.classList.toggle("active", item.chapter === chap?.chapter);
      fragment.appendChild(link);
    });
    khung.appendChild(fragment);
  });
}

// Tạo một thẻ truyện dùng trong kết quả tìm kiếm.
function taoTheTruyen(item) {
  const khung = document.createElement("div");
  khung.classList.add("khungtruyenrieng");

  const link = document.createElement("a");
  link.href = taoDuongDan("trangchitiet.html", {
    id: item.id,
  });

  const anh = document.createElement("img");
  anh.src = String(item.anhBia ?? "");
  anh.alt = gioiHanChuoi(item.ten, 120);
  anh.loading = "lazy";

  const ten = document.createElement("h3");
  ten.textContent = gioiHanChuoi(item.ten, 120);

  const theLoai = document.createElement("span");
  theLoai.textContent = Array.isArray(item.theLoai)
    ? item.theLoai.slice(0, 10).join(" • ")
    : "";

  link.append(anh, ten);
  khung.append(link, theLoai);
  return khung;
}

// Hiển thị danh sách truyện vào khung kết quả.
// Số lượng kết quả được giới hạn theo cấu hình.
function hienThiTruyen(khung, danhSach) {
  if (!khung) return;

  xoaNoiDungPhanTu(khung);
  const fragment = document.createDocumentFragment();
  danhSach
    .slice(0, 50)
    .forEach((item) => fragment.appendChild(taoTheTruyen(item)));
  khung.appendChild(fragment);
}

// Khởi tạo nút đóng/mở menu chính trên màn hình nhỏ.
function khoiTaoMenu() {
  const nutMenu = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!nutMenu || !menu) return;

  nutMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    menu.classList.toggle("active");
  });
  menu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", () => menu.classList.remove("active"));
}

// Khởi tạo danh sách chọn chapter.
// Menu có thể mở lên trên nếu phía dưới không đủ khoảng trống.
function khoiTaoDanhSachChapterNoi() {
  document.querySelectorAll(".check__line").forEach((nut) => {
    const menu = nut.querySelector(".chapter-list");
    if (!menu) return;

    let boDemDong;
    nut.addEventListener("mouseenter", () => {
      clearTimeout(boDemDong);
      menu.classList.add("show");

      requestAnimationFrame(() => {
        const viTri = menu.getBoundingClientRect();
        if (viTri.top < 10) {
          nut.classList.remove("open-up");
        } else if (
          viTri.bottom > document.documentElement.clientHeight - 10
        ) {
          nut.classList.add("open-up");
        }
      });
    });

    nut.addEventListener("mouseleave", () => {
      boDemDong = setTimeout(() => {
        if (!nut.classList.contains("active")) menu.classList.remove("show");
      }, 200);
    });

    nut.addEventListener("click", (event) => {
      event.stopPropagation();
      const dangMo = nut.classList.toggle("active");
      menu.classList.toggle("show", dangMo);
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".check__line").forEach((nut) => {
      nut.classList.remove("active");
      nut.querySelector(".chapter-list")?.classList.remove("show");
    });
  });
}

// Điều khiển thanh chuyển chapter khi cuộn trang.
// Cuộn xuống: thanh nằm dưới.
// Cuộn lên: thanh nằm trên.
// Khi đến thanh điều hướng cuối trang: bỏ trạng thái fixed.
function khoiTaoThanhDieuHuongNoi() {
  const thanhDieuHuong = document.querySelector(".div_main.top");
  const mocFooter = document.querySelector(".div_main.bottom");
  const nutLenDauTrang = document.getElementById("btnScrollTop");
  if (!thanhDieuHuong || !mocFooter) return;

  let viTriCu = window.scrollY;

  nutLenDauTrang?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    const viTriMoi = window.scrollY;
    const daChamFooter =
      viTriMoi + document.documentElement.clientHeight >= mocFooter.offsetTop;

    if (nutLenDauTrang) {
      nutLenDauTrang.hidden = viTriMoi <= 300;
    }

    if (viTriMoi <= 100 || daChamFooter) {
      thanhDieuHuong.classList.remove("fixed-top", "fixed-bottom");
      viTriCu = viTriMoi;
      return;
    }

    const dangCuonXuong = viTriMoi > viTriCu;
    thanhDieuHuong.classList.toggle("fixed-bottom", dangCuonXuong);
    thanhDieuHuong.classList.toggle("fixed-top", !dangCuonXuong);
    document.querySelectorAll(".check__line").forEach((nut) => {
      nut.classList.toggle("open-up", dangCuonXuong);
    });
    viTriCu = viTriMoi;
  });
}
//gắn tìm kiếm truyện
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

    const ketQua = duLieuTruyen.filter((truyen) => {
      return truyen.ten.toLowerCase().includes(tuKhoa);
    });

    if (ketQua.length === 0) {
      const thongBao = document.createElement("p");
      thongBao.textContent = "Không tìm thấy truyện";
      thongBao.style.padding = "12px";
      goiY.appendChild(thongBao);
    }

    ketQua.slice(0, 5).forEach((truyen) => {
      const link = document.createElement("a");

      link.href = `trangchitiet.html?id=${truyen.id}`;
      link.className = "item-goi-y";

      const img = document.createElement("img");
      img.src = truyen.anhBia;

      const span = document.createElement("span");
      span.textContent = truyen.ten;

      link.append(img, span);

      goiY.appendChild(link);
    });

    goiY.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    if (!document.querySelector(".search").contains(e.target)) {
      goiY.style.display = "none";
    }
  });
}

// Hàm chính khởi tạo toàn bộ chức năng của trang đọc truyện. 
//Tránh khởi tạo menu chapter, thanh điều hướng và chức năng khác khi truyện hoặc chapter không tồn tại.
function khoiTaoTrangDocTruyen() {
  khoiTaoMenu();
  khoiTaoDanhSachChapterNoi();
  khoiTaoThanhDieuHuongNoi();

  if (!truyen) {
    hienThiLoiDocTruyen("Không tìm thấy truyện.");
    return;
  }

  ganLienKetCoBan();

  if (!chap) {
    hienThiLoiDocTruyen("Không tìm thấy chapter.");
    return;
  }

  ganDieuHuongChapter();
  renderNoiDungChapter();
  renderDanhSachChapter();
}

document.addEventListener("DOMContentLoaded", khoiTaoTrangDocTruyen);
document.addEventListener("DOMContentLoaded", function () {
  ganTimKiem();
});
