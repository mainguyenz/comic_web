// 1. CẤU HÌNH TRANG THEO DÕI
const CAU_HINH_THEO_DOI = Object.freeze({
  trangDangNhap: "login.html",
  trangChiTiet: "trangchitiet.html",
  viTriHienNutQuayLai: 300,
});

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

// 2. RENDER DANH SÁCH TRUYỆN DƯỚI LƯỚI
function renderDanhSachTheoDoi(tuKhoa = "") {
  const grid = document.getElementById("tdDanhSach");
  const thongBaoRong = document.getElementById("tdRong");
  if (!grid || !thongBaoRong) return;

  if (!layTaiKhoanLuuTruHienTai()) {
    xoaNoiDungPhanTu(grid);
    xoaNoiDungPhanTu(thongBaoRong);
    thongBaoRong.style.display = "block";

    thongBaoRong.appendChild(document.createTextNode("Bạn cần "));
    const linkDangNhap = document.createElement("a");
    linkDangNhap.href = CAU_HINH_THEO_DOI.trangDangNhap;
    linkDangNhap.textContent = "đăng nhập";
    thongBaoRong.appendChild(linkDangNhap);
    thongBaoRong.appendChild(
      document.createTextNode(" để xem danh sách truyện đang theo dõi.")
    );
    return;
  }

  const dsTheoDoi = typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];
  const tuKhoaThuong = String(tuKhoa).trim().toLowerCase();

  const dsLoc = dsTheoDoi.filter((truyen) => {
    if (!truyen) return false;
    const ten = String(truyen.ten || truyen.tenTruyen || "").toLowerCase();
    const tacGia = String(truyen.tacGia || "").toLowerCase();
    return (
      tuKhoaThuong === "" ||
      ten.includes(tuKhoaThuong) ||
      tacGia.includes(tuKhoaThuong)
    );
  });

  if (dsTheoDoi.length === 0) {
    xoaNoiDungPhanTu(grid);
    xoaNoiDungPhanTu(thongBaoRong);
    thongBaoRong.style.display = "block";
    thongBaoRong.textContent =
      "Bạn chưa theo dõi truyện nào. Hãy tìm truyện ở thanh tìm kiếm phía trên nhé!";
    return;
  }

  thongBaoRong.style.display = "none";

  if (dsLoc.length === 0) {
    xoaNoiDungPhanTu(grid);
    const pThongBao = document.createElement("p");
    pThongBao.className = "td-thong-bao-rong-manga";
    pThongBao.textContent =
      "Không tìm thấy truyện phù hợp trong danh sách đã theo dõi.";
    grid.appendChild(pThongBao);
    return;
  }

  xoaNoiDungPhanTu(grid);
  const fragment = document.createDocumentFragment();

  dsLoc.forEach((truyen) => {
    const khung = document.createElement("div");
    khung.className = "khungtruyenrieng td-the";

    const btnBo = document.createElement("button");
    btnBo.type = "button";
    btnBo.className = "td-nut-bo";
    btnBo.dataset.id = String(truyen.id);
    btnBo.title = "Bỏ theo dõi";
    btnBo.textContent = "✕";

    const linkDetail = document.createElement("a");
    linkDetail.href = `${CAU_HINH_THEO_DOI.trangChiTiet}?id=${truyen.id}`;

    const img = document.createElement("img");
    img.src = String(truyen.anhBia || truyen.hinhAnh || "");
    img.alt = String(truyen.ten || truyen.tenTruyen || "");

    const h3 = document.createElement("h3");
    h3.textContent = String(truyen.ten || truyen.tenTruyen || "");

    linkDetail.appendChild(img);
    linkDetail.appendChild(h3);

    const spanTacGia = document.createElement("span");
    spanTacGia.textContent = truyen.tacGia || "Đang cập nhật";

    khung.appendChild(btnBo);
    khung.appendChild(linkDetail);
    khung.appendChild(spanTacGia);

    fragment.appendChild(khung);
  });

  grid.appendChild(fragment);
}

// 3. TÌM KIẾM NỘI BỘ TRANG THEO DÕI
function ganTimKiemTDTruyen() {
  const input = document.getElementById("inputTimKiemToanBo");
  const goiY = document.getElementById("dropdownKetQuaTheoDoi");
  if (!input || !goiY) return;

  let dsTruyenDuocChon = new Set();

  input.addEventListener("input", () => {
    const tuKhoa = input.value.trim().toLowerCase();
    xoaNoiDungPhanTu(goiY);
    dsTruyenDuocChon.clear();

    if (tuKhoa === "") {
      goiY.style.display = "none";
      renderDanhSachTheoDoi("");
      return;
    }

    renderDanhSachTheoDoi(tuKhoa);

    const dsTheoDoiHienTai = typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];
    const dsIdDaTheoDoi = dsTheoDoiHienTai.map((item) => Number(item.id));

    let dem = 0;
    const fragmentList = document.createDocumentFragment();

    duLieuTruyen.forEach((truyen) => {
      if (!truyen) return;
      const ten = String(truyen.tenTruyen || truyen.ten || "").toLowerCase();

      if (ten.includes(tuKhoa)) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "dropdown-item-truyen";

        const itemInfo = document.createElement("div");
        itemInfo.className = "item-info";
        itemInfo.addEventListener("click", () => {
          window.location.href = `${CAU_HINH_THEO_DOI.trangChiTiet}?id=${truyen.id}`;
        });

        const img = document.createElement("img");
        img.src = truyen.hinhAnh || truyen.anhBia || "";

        const itemText = document.createElement("div");
        itemText.className = "item-text";

        const itemTen = document.createElement("div");
        itemTen.className = "item-ten";
        itemTen.textContent = truyen.tenTruyen || truyen.ten;

        itemText.appendChild(itemTen);
        itemInfo.appendChild(img);
        itemInfo.appendChild(itemText);

        const rightAction = document.createElement("div");
        rightAction.className = "item-right-action";

        const daTheoDoi = dsIdDaTheoDoi.includes(Number(truyen.id));

        if (daTheoDoi) {
          const badge = document.createElement("span");
          badge.className = "badge-da-theo-doi";
          badge.textContent = "Đã theo dõi";
          rightAction.appendChild(badge);
        } else {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = truyen.id;
          checkbox.className = "chk-truyen";

          checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
              dsTruyenDuocChon.add(Number(truyen.id));
            } else {
              dsTruyenDuocChon.delete(Number(truyen.id));
            }
            capNhatTrangThaiNutThaoTac();
          });

          rightAction.appendChild(checkbox);
        }

        itemDiv.appendChild(itemInfo);
        itemDiv.appendChild(rightAction);
        fragmentList.appendChild(itemDiv);
        dem++;
      }
    });

    if (dem === 0) {
      const divRong = document.createElement("div");
      divRong.className = "dropdown-rong";
      divRong.textContent = "Không tìm thấy truyện phù hợp";
      goiY.appendChild(divRong);
    } else {
      goiY.appendChild(fragmentList);

      const footer = document.createElement("div");
      footer.className = "dropdown-footer-actions";

      const spanDem = document.createElement("span");
      spanDem.id = "thongBaoSoLuongChon";
      spanDem.textContent = "Chưa chọn truyện nào";

      const btnThem = document.createElement("button");
      btnThem.type = "button";
      btnThem.id = "btnThemNhieuTruyen";
      btnThem.className = "btn-them-tat-ca";
      btnThem.disabled = true;
      btnThem.textContent = "Thêm đã chọn";

      btnThem.addEventListener("click", () => {
        if (dsTruyenDuocChon.size > 0) {
          if (typeof themNhieuTheoDoi === "function") {
            themNhieuTheoDoi(Array.from(dsTruyenDuocChon));
          }
          goiY.style.display = "none";
          input.value = "";
          renderDanhSachTheoDoi("");
        }
      });

      footer.appendChild(spanDem);
      footer.appendChild(btnThem);
      goiY.appendChild(footer);
    }

    goiY.style.display = "block";
  });

  function capNhatTrangThaiNutThaoTac() {
    const btn = document.getElementById("btnThemNhieuTruyen");
    const span = document.getElementById("thongBaoSoLuongChon");
    const count = dsTruyenDuocChon.size;

    if (btn && span) {
      btn.disabled = count === 0;
      span.textContent = count > 0 ? `Đã chọn: ${count} truyện` : "Chưa chọn truyện nào";
      btn.textContent = count > 0 ? `Thêm ${count} truyện đã chọn` : "Thêm đã chọn";
    }
  }

  document.addEventListener("click", (e) => {
    const container = document.querySelector(".tim-kiem-theo-doi-container");
    if (container && !container.contains(e.target)) {
      goiY.style.display = "none";
    }
  });
}

// 4. SỰ KIỆN XÓA TRUYỆN DƯỚI LƯỚI
function ganSuKienDanhSachTheoDoi() {
  const grid = document.getElementById("tdDanhSach");
  const inputTimKiem = document.getElementById("inputTimKiemToanBo");

  if (grid) {
    grid.addEventListener("click", (event) => {
      const nut = event.target.closest(".td-nut-bo");
      if (!nut) return;

      const idTruyen = Number(nut.dataset.id);

      if (typeof toggleTheoDoiId === "function") {
        toggleTheoDoiId(idTruyen);
      }

      renderDanhSachTheoDoi(inputTimKiem ? inputTimKiem.value : "");
    });
  }
}

// 5. TÌM KIẾM MẸO/MENU HEADER
function ganTimKiem() {
  const input = document.getElementById("inputsearch");
  const goiY = document.getElementById("goiYTimKiem");

  if (!input || !goiY) return;

  input.addEventListener("input", function () {
    const tuKhoa = input.value.trim().toLowerCase();

    xoaNoiDungPhanTu(goiY);

    if (tuKhoa === "") {
      goiY.style.display = "none";
      return;
    }

    if (typeof danhSachTruyen === "undefined") return;

    const ketQua = danhSachTruyen.filter((t) => {
      const ten = (t.ten || "").toLowerCase();
      const tacGia = (t.tacGia || "").toLowerCase();
      const theLoai = (t.theLoai || []).join(" ").toLowerCase();

      return (
        ten.includes(tuKhoa) ||
        tacGia.includes(tuKhoa) ||
        theLoai.includes(tuKhoa)
      );
    });

    if (ketQua.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Không tìm thấy truyện";
      goiY.appendChild(p);
    } else {
      const fragment = document.createDocumentFragment();

      ketQua.forEach((t) => {
        const link = document.createElement("a");
        link.href = `trangchitiet.html?id=${t.id}`;
        link.className = "item-goi-y";

        const img = document.createElement("img");
        img.src = t.anhBia;
        img.alt = t.ten;

        const ten = document.createElement("span");
        ten.textContent = t.ten;

        link.appendChild(img);
        link.appendChild(ten);
        fragment.appendChild(link);
      });

      goiY.appendChild(fragment);
    }

    goiY.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    const searchContainer = document.querySelector(".search");
    if (searchContainer && !searchContainer.contains(e.target)) {
      goiY.style.display = "none";
    }
  });
}

// 6. TIỆN ÍCH TRANG
function ganNutQuayLai() {
  const nut = document.getElementById("quaylai");
  if (!nut) return;

  window.addEventListener("scroll", () => {
    nut.style.display =
      window.scrollY > CAU_HINH_THEO_DOI.viTriHienNutQuayLai ? "block" : "none";
  });

  nut.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

function ganMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  document.addEventListener("click", () => menu.classList.remove("active"));
}

// KHỞI TẠO TRANG
document.addEventListener("DOMContentLoaded", () => {
  renderDanhSachTheoDoi();
  ganSuKienDanhSachTheoDoi();
  ganTimKiemTDTruyen();
  ganTimKiem();
  ganNutQuayLai();
  ganMenu();
});