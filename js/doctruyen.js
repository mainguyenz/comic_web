// ==================================================
// 1. CẤU HÌNH TRANG ĐỌC TRUYỆN
// ==================================================

// Lưu tập trung đường dẫn, giới hạn dữ liệu và thông số giao diện.
// Object.freeze() ngăn các giá trị cấu hình bị thay đổi ngoài ý muốn.

const CAU_HINH_DOC_TRUYEN = Object.freeze({
  trangDangNhap: "login.html", // Trang đăng nhập dùng chung
  trangChiTiet: "trangchitiet.html", // Trang thông tin chi tiết truyện
  trangDocTruyen: "doctruyen.html", // Trang đọc chapter

  chapterMacDinh: 1, // Chapter mặc định khi URL không có chapter
  idToiDa: 1000, // ID truyện lớn nhất được chấp nhận
  chapterToiDa: 100000, // Số chapter lớn nhất được chấp nhận

  binhLuanToiDaKyTu: 500, // Số ký tự tối đa của bình luận
  binhLuanToiDaMoiTruyen: 40, // Số bình luận tối đa của mỗi truyện
  anhToiDaMoiChapter: 500, // Số ảnh tối đa được hiển thị trong một chapter
  ketQuaTimKiemToiDa: 50, // Số truyện tối đa trong kết quả tìm kiếm
  tuKhoaToiDaKyTu: 100, // Độ dài tối đa của từ khóa tìm kiếm

  viTriHienNutLenDauTrang: 300, // Vị trí cuộn để hiện nút lên đầu trang
  viTriBatDauSticky: 100, // Vị trí bắt đầu thanh điều hướng nổi
  khoangCachMepMenu: 10, // Khoảng cách an toàn của menu với mép màn hình
  thoiGianDongMenu: 1000, // Thời gian chờ đóng menu chapter, tính bằng ms
});

// Key localStorage dùng chung với trang chi tiết để lưu bình luận.
// Không thêm dấu cách trước "app_comments".
const KHO_BINH_LUAN_CHUNG = "app_comments";

// Kiểm tra dữ liệu chapter đã được nạp từ datadoctruyen.js hay chưa.
// Nếu không có thì sử dụng mảng rỗng để tránh lỗi.
const duLieuChuong =
  typeof chapters !== "undefined" && Array.isArray(chapters) ? chapters : [];

// Kiểm tra danh sách truyện đã được nạp từ datachitiet.js hay chưa.
const duLieuTruyen =
  typeof danhSachTruyen !== "undefined" && Array.isArray(danhSachTruyen)
    ? danhSachTruyen
    : [];

// Đọc dữ liệu JSON từ localStorage.
// Nếu key không tồn tại hoặc JSON bị lỗi thì trả về giá trị mặc định.
function docJsonLocalStorage(khoa, giaTriMacDinh) {
  try {
    const chuoiJson = localStorage.getItem(khoa);
    if (chuoiJson === null) return giaTriMacDinh;

    const duLieu = JSON.parse(chuoiJson);
    return duLieu ?? giaTriMacDinh;
  } catch (loi) {
    console.warn(`Không đọc được dữ liệu JSON tại khóa ${khoa}.`, loi);
    return giaTriMacDinh;
  }
}

// Chuyển dữ liệu thành JSON và lưu vào localStorage.
// Trả về true nếu lưu thành công, false nếu xảy ra lỗi.
function ghiJsonLocalStorage(khoa, duLieu) {
  try {
    localStorage.setItem(khoa, JSON.stringify(duLieu));
    return true;
  } catch (loi) {
    console.warn(`Không lưu được dữ liệu JSON tại khóa ${khoa}.`, loi);
    return false;
  }
}

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

// Lấy tài khoản đang đăng nhập thông qua hàm dùng chung trong luutru.js.
// Đồng thời tạo thuộc tính tenHienThi để sử dụng trên giao diện.
function layTaiKhoanHienTai() {
  if (typeof layTaiKhoanLuuTruHienTai !== "function") {
    return null;
  }

  const taiKhoan = layTaiKhoanLuuTruHienTai();

  if (!taiKhoan || typeof taiKhoan !== "object" || Array.isArray(taiKhoan)) {
    return null;
  }

  const tenHienThi = gioiHanChuoi(
    taiKhoan.fullname || taiKhoan.username || taiKhoan.email,
    80,
  );

  if (!tenHienThi) return null;

  return {
    ...taiKhoan,
    tenHienThi,
  };
}

// Tạo đường dẫn tới trang đăng nhập kèm trang hiện tại.
// Tham số quaylai dùng để quay về chapter sau khi đăng nhập.
function taoLinkDangNhap() {
  const trangHienTai = `${window.location.pathname}${window.location.search}`;
  return taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDangNhap, {
    quaylai: trangHienTai,
  });
}

// Hiển thị thông báo lỗi trong khu vực đọc truyện
// khi không tìm thấy truyện hoặc chapter.
function hienThiLoiDocTruyen(thongBao) {
  const reader = document.getElementById("reader");
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
  CAU_HINH_DOC_TRUYEN.idToiDa,
);

// Kiểm tra và lấy chapter hợp lệ từ URL.
const soChapter = laySoNguyenDuong(
  thamSoUrl.get("chapter"),
  CAU_HINH_DOC_TRUYEN.chapterMacDinh,
  CAU_HINH_DOC_TRUYEN.chapterToiDa,
);

// Tìm thông tin truyện dựa trên ID.
const truyen = duLieuTruyen.find((item) => item?.id === idTruyen) ?? null;

// Tìm nội dung chapter dựa trên ID truyện và số chapter.
const chap =
  duLieuChuong.find(
    (item) => item?.id === idTruyen && item?.chapter === soChapter,
  ) ?? null;

// Lấy tối đa 40 bình luận gần nhất của truyện từ app_comments.

function layBinhLuanCuaTruyen() {
  if (!truyen) {
    return [];
  }

  const khoBinhLuan = docJsonLocalStorage(KHO_BINH_LUAN_CHUNG, {});

  const danhSach = khoBinhLuan[String(truyen.id)];

  if (!Array.isArray(danhSach)) {
    return [];
  }

  return danhSach.slice(-CAU_HINH_DOC_TRUYEN.binhLuanToiDaMoiTruyen);
}

// Thêm bình luận mới và chỉ giữ lại số lượng bình luận cho phép.
function luuBinhLuanMoi(binhLuan) {
  if (!truyen) {
    return false;
  }

  const khoBinhLuan = docJsonLocalStorage(KHO_BINH_LUAN_CHUNG, {});

  const khoaTruyen = String(truyen.id);

  const danhSachCu = Array.isArray(khoBinhLuan[khoaTruyen])
    ? khoBinhLuan[khoaTruyen]
    : [];

  danhSachCu.push(binhLuan);

  khoBinhLuan[khoaTruyen] = danhSachCu.slice(
    -CAU_HINH_DOC_TRUYEN.binhLuanToiDaMoiTruyen,
  );

  return ghiJsonLocalStorage(KHO_BINH_LUAN_CHUNG, khoBinhLuan);
}
// Tạo một phần tử HTML hiển thị tên, thời gian và nội dung bình luận.
function taoDongBinhLuan(binhLuan) {
  const item = document.createElement("div");
  item.classList.add("comment-item");

  const thoiGian = document.createElement("span");
  thoiGian.classList.add("comment-time");

  const ten = document.createElement("strong");

  ten.textContent =
    gioiHanChuoi(binhLuan.fullname || binhLuan.ten || binhLuan.email, 80) ||
    "Người dùng";

  thoiGian.appendChild(ten);

  thoiGian.appendChild(
    document.createTextNode(
      ` · ${gioiHanChuoi(binhLuan.ngayDang || binhLuan.thoiGian, 40)}`,
    ),
  );

  const noiDung = document.createElement("p");
  noiDung.classList.add("comment-text");
  noiDung.textContent = gioiHanChuoi(
    binhLuan.noiDung,
    CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu,
  );

  item.append(thoiGian, noiDung);
  return item;
}

// Lọc và hiển thị những bình luận thuộc chapter hiện tại.
// Bình luận mới nhất được hiển thị trước.
function renderBinhLuanChapter(commentList) {
  if (!commentList || !chap) return;

  xoaNoiDungPhanTu(commentList);
  const danhSach = layBinhLuanCuaTruyen()
    .filter((binhLuan) => Number(binhLuan?.chapterSo) === Number(chap.chapter))
    .reverse();
  if (danhSach.length === 0) {
    const thongBao = document.createElement("p");
    thongBao.classList.add("comment-empty");
    thongBao.textContent =
      "Chưa có bình luận nào ở chapter này. Hãy là người đầu tiên!";
    commentList.appendChild(thongBao);
    return;
  }

  const fragment = document.createDocumentFragment();
  danhSach.forEach((binhLuan) => {
    fragment.appendChild(taoDongBinhLuan(binhLuan));
  });
  commentList.appendChild(fragment);
}

// Khởi tạo khu vực bình luận.
// Chỉ cho phép người đã đăng nhập gửi bình luận.
function khoiTaoBinhLuan() {
  const form = document.getElementById("commentForm");
  const input = document.getElementById("commentInput");
  const list = document.getElementById("commentList");
  const thongBaoDangNhap = document.getElementById("blThongBaoDangNhap");
  const linkDangNhap = document.getElementById("blLinkDangNhap");

  if (!form || !input || !list || !truyen || !chap) return;

  input.maxLength = CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu;
  const taiKhoan = layTaiKhoanHienTai();

  form.hidden = !taiKhoan;
  if (thongBaoDangNhap) thongBaoDangNhap.hidden = Boolean(taiKhoan);
  if (linkDangNhap) linkDangNhap.href = taoLinkDangNhap();

  renderBinhLuanChapter(list);

  form.addEventListener("submit", (event) => {
    // Ngăn trình duyệt tải lại trang khi gửi bình luận.

    event.preventDefault();
    // Kiểm tra lại trạng thái đăng nhập tại thời điểm gửi.

    const taiKhoanMoi = layTaiKhoanHienTai();
    if (!taiKhoanMoi) {
      window.location.assign(taoLinkDangNhap());
      return;
    }
    // Chuẩn hóa và giới hạn nội dung bình luận.
    const noiDung = gioiHanChuoi(
      input.value,
      CAU_HINH_DOC_TRUYEN.binhLuanToiDaKyTu,
    );
    if (!noiDung) return;
    // Tạo dữ liệu bình luận theo cấu trúc dùng chung với trang chi tiết.

    const binhLuan = {
      id: Date.now(),

      fullname: taiKhoanMoi.fullname || taiKhoanMoi.tenHienThi || null,

      email: taiKhoanMoi.email || "Ẩn danh",

      noiDung,

      ngayDang: new Date().toLocaleString("vi-VN"),

      saoDanhGia: 0,

      chapterSo: Number(chap.chapter),
    };

    if (luuBinhLuanMoi(binhLuan)) {
      input.value = "";
      renderBinhLuanChapter(list);
    } else {
      alert(
        "Không thể lưu bình luận. Vui lòng kiểm tra dung lượng trình duyệt.",
      );
    }
  });
}
// Kiểm tra truyện hiện tại có nằm trong danh sách theo dõi của tài khoản đang đăng nhập hay không.
function kiemTraTheoDoi() {
  if (!truyen || typeof kiemTraDaTheoDoi !== "function") {
    return false;
  }

  return Boolean(kiemTraDaTheoDoi(truyen.id));
}

// Thêm hoặc xóa truyện khỏi danh sách theo dõi thông qua luutru.js.
function daoTrangThaiTheoDoi() {
  if (!truyen || typeof toggleTheoDoiId !== "function") {
    return false;
  }

  return Boolean(toggleTheoDoiId(truyen.id));
}

// Cập nhật biểu tượng, nội dung và trạng thái giao diện của một nút yêu thích.
function capNhatNutYeuThich(nut, dangTheoDoi) {
  let icon = nut.querySelector("i");
  if (!icon) {
    icon = document.createElement("i");
    nut.prepend(icon);
  }

  icon.className = dangTheoDoi ? "fa-solid fa-heart" : "fa-regular fa-heart";

  let nhan = nut.querySelector(".love-label");
  if (!nhan) {
    Array.from(nut.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });
    nhan = document.createElement("span");
    nhan.classList.add("love-label");
    nut.appendChild(nhan);
  }

  nhan.textContent = dangTheoDoi ? "Đã thích" : "Yêu thích";
  nut.classList.toggle("is-loved", dangTheoDoi);
  nut.setAttribute("aria-pressed", String(dangTheoDoi));
}

// Khởi tạo tất cả nút yêu thích ở đầu và cuối trang.
// Nếu chưa đăng nhập thì chuyển người dùng tới trang đăng nhập.
function khoiTaoYeuThich() {
  if (!truyen) return;

  const cacNut = document.querySelectorAll(".love");
  const taiKhoan = layTaiKhoanHienTai();
  const capNhatTatCa = (trangThai) => {
    cacNut.forEach((nut) => capNhatNutYeuThich(nut, trangThai));
  };

  capNhatTatCa(taiKhoan ? kiemTraTheoDoi() : false);

  cacNut.forEach((nut) => {
    nut.addEventListener("click", () => {
      const taiKhoanMoi = layTaiKhoanHienTai();
      if (!taiKhoanMoi) {
        window.location.assign(taoLinkDangNhap());
        return;
      }

      capNhatTatCa(daoTrangThaiTheoDoi());
    });
  });
}

// Lưu chapter hiện tại làm tiến độ đọc của tài khoản.
// Người chưa đăng nhập sẽ không được lưu tiến độ.
function luuTienDoHienTai() {
  if (!truyen || !chap) return;

  if (typeof luuTienDoDoc !== "function") {
    console.warn("Không tìm thấy hàm lưu tiến độ.");
    return;
  }

  const daLuu = luuTienDoDoc(truyen.id, chap.chapter);

  if (!daLuu) {
    console.info("Chưa đăng nhập nên không lưu tiến độ.");
  }
}

// Gắn ID truyện vào các liên kết quay về trang chi tiết.
function ganLienKetCoBan() {
  if (!truyen) return;

  document.querySelectorAll(".menus").forEach((menu) => {
    menu.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangChiTiet, {
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

  nut.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDocTruyen, {
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

  const reader = document.getElementById("reader");
  if (!reader) return;

  xoaNoiDungPhanTu(reader);
  const fragment = document.createDocumentFragment();
  const danhSachAnh = Array.isArray(chap.images)
    ? chap.images.slice(0, CAU_HINH_DOC_TRUYEN.anhToiDaMoiChapter)
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
      link.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangDocTruyen, {
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
  link.href = taoDuongDan(CAU_HINH_DOC_TRUYEN.trangChiTiet, { id: item.id });

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
    .slice(0, CAU_HINH_DOC_TRUYEN.ketQuaTimKiemToiDa)
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
        if (viTri.top < CAU_HINH_DOC_TRUYEN.khoangCachMepMenu) {
          nut.classList.remove("open-up");
        } else if (
          viTri.bottom >
          document.documentElement.clientHeight -
            CAU_HINH_DOC_TRUYEN.khoangCachMepMenu
        ) {
          nut.classList.add("open-up");
        }
      });
    });

    nut.addEventListener("mouseleave", () => {
      boDemDong = setTimeout(() => {
        if (!nut.classList.contains("active")) menu.classList.remove("show");
      }, CAU_HINH_DOC_TRUYEN.thoiGianDongMenu);
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
      nutLenDauTrang.hidden =
        viTriMoi <= CAU_HINH_DOC_TRUYEN.viTriHienNutLenDauTrang;
    }

    if (viTriMoi <= CAU_HINH_DOC_TRUYEN.viTriBatDauSticky || daChamFooter) {
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
      goiY.innerHTML = "<p style='padding:12px'>Không tìm thấy truyện</p>";

      goiY.style.display = "block";
      return;
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

// Hàm chính khởi tạo toàn bộ chức năng của trang đọc truyện. Tránh khởi tạo menu chapter, thanh điều hướng và chức năng khác khi truyện hoặc chapter không tồn tại.
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
  khoiTaoBinhLuan();
  khoiTaoYeuThich();
  luuTienDoHienTai();
}

document.addEventListener("DOMContentLoaded", khoiTaoTrangDocTruyen);
document.addEventListener("DOMContentLoaded", function () {
  ganTimKiem();
});
