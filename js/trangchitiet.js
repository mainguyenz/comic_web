// KHỞI TẠO TIỆN ÍCH CHUNG 
const layThamSoURL = (tenThamSo) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(tenThamSo);
};

const safeParseJSON = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Lỗi đọc LocalStorage key "${key}":`, e);
    return fallback;
  }
};

const xoaHetCon = (element) => {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const taoTextNode = (text) => document.createTextNode(String(text ?? ''));

const idThamSo = layThamSoURL("id");
const idTruyen = Number(idThamSo);

const idHopLe = Number.isInteger(idTruyen) && idTruyen > 0;

const truyen = (idHopLe && typeof layTruyenTheoId === "function") 
  ? layTruyenTheoId(idTruyen) 
  : null;

// XỬ LÝ LỖI (404)
const xuLyHienThiLoi404 = () => {
  const containerChinh = document.getElementById("container-truyen");
  const khungLoi = document.getElementById("khung-loi");
  const lblNoiDungLoi = document.getElementById("lblNoiDungLoi");
  const breadcrumb = document.querySelector(".breadcrumb");

  if (containerChinh) containerChinh.classList.add("error-hidden");
  if (breadcrumb) breadcrumb.style.display = "none";

  if (khungLoi) {
    khungLoi.classList.remove("error-hidden");
    if (lblNoiDungLoi) {
      xoaHetCon(lblNoiDungLoi);
      lblNoiDungLoi.appendChild(
        taoTextNode("Không tìm thấy truyện hoặc ID không hợp lệ trong hệ thống!")
      );
    }
  }
};

let currentUser = safeParseJSON("currentUser", null);
let thuTuChapter = "desc";
let chapterMoRong = false;
let saoDangChon = 0;

// CHỨC NĂNG: MÀN HÌNH CHI TIẾT TRUYỆN & MENU

const capNhatHienThiDiemDanhGia = () => {
  if (!truyen) return;
  const lblDiemTb = document.getElementById("lblDiemTb");
  const dungTichSao = document.getElementById("dungTichSao");
  const diemSo = Number(truyen.diemDanhGia) || 0.0;

  if (lblDiemTb) {
    xoaHetCon(lblDiemTb);
    lblDiemTb.appendChild(taoTextNode(diemSo.toFixed(1)));
  }
  if (dungTichSao) {
    xoaHetCon(dungTichSao);
    const lamTronSao = Math.round(diemSo);
    dungTichSao.appendChild(taoTextNode("★".repeat(lamTronSao) + "☆".repeat(5 - lamTronSao)));
  }
};

const capNhatDiemDanhGiaTrungBinh = (dsBinhLuan) => {
  if (!truyen) return;
  const coDanhGia = dsBinhLuan.filter((bl) => bl.saoDanhGia > 0);
  if (coDanhGia.length === 0) return;
  const tong = coDanhGia.reduce((acc, bl) => acc + bl.saoDanhGia, 0);
  truyen.diemDanhGia = tong / coDanhGia.length;
  capNhatHienThiDiemDanhGia();
};

const hienThiChiTietTruyen = () => {
  if (!truyen) return;
  document.title = `${truyen.ten} - Comic Web`;

  const brTenTruyen = document.getElementById("breadcrumbTenTruyen");
  const lblTenTruyen = document.getElementById("lblTenTruyen");

  if (brTenTruyen) {
    xoaHetCon(brTenTruyen);
    brTenTruyen.appendChild(taoTextNode(truyen.ten));
  }
  if (lblTenTruyen) {
    xoaHetCon(lblTenTruyen);
    lblTenTruyen.appendChild(taoTextNode(truyen.ten));
  }

  const imgAnhBia = document.getElementById("imgAnhBia");
  if (imgAnhBia) {
    imgAnhBia.src = truyen.anhBia;
    imgAnhBia.alt = truyen.ten;
  }

  const boxTenKhac = document.getElementById("boxTenKhac");
  const lblTenKhac = document.getElementById("lblTenKhac");
  const coTenKhac = Array.isArray(truyen.tenKhac) && truyen.tenKhac.length > 0;

  if (boxTenKhac) boxTenKhac.classList.toggle("alias-hidden", !coTenKhac);
  if (lblTenKhac && coTenKhac) {
    xoaHetCon(lblTenKhac);
    lblTenKhac.appendChild(taoTextNode(truyen.tenKhac.join(", ")));
  }

  const lblTacGia = document.getElementById("lblTacGia");
  if (lblTacGia) {
    xoaHetCon(lblTacGia);
    lblTacGia.appendChild(taoTextNode(truyen.tacGia || "Đang cập nhật"));
  }

  const lblTrangThai = document.getElementById("lblTrangThai");
  if (lblTrangThai) {
    const tinhTrang = truyen.tinhTrang || "Đang cập nhật";
    xoaHetCon(lblTrangThai);
    lblTrangThai.appendChild(taoTextNode(tinhTrang));

    let classTrangThai = "dang-ra";
    if (/hoàn thành/i.test(tinhTrang)) classTrangThai = "hoan-thanh";
    else if (/sắp ra mắt/i.test(tinhTrang)) classTrangThai = "sap-ra-mat";

    lblTrangThai.className = `tinh-trang-badge ${classTrangThai}`;
  }

  capNhatHienThiDiemDanhGia();

  const lblLuotXem = document.getElementById("lblLuotXem");
  if (lblLuotXem) {
    xoaHetCon(lblLuotXem);
    lblLuotXem.appendChild(taoTextNode(truyen.luotXem || "0"));
  }

  const lblSynopsis = document.getElementById("lblSynopsis");
  const btnDocThemSynopsis = document.getElementById("btnDocThemSynopsis");
  const noiDungMoTa = (truyen.moTa && truyen.moTa.trim() !== "") 
    ? truyen.moTa 
    : "Không có tóm tắt cho truyện này.";

  if (lblSynopsis) {
    xoaHetCon(lblSynopsis);
    lblSynopsis.appendChild(taoTextNode(noiDungMoTa));
    lblSynopsis.classList.add("synopsis-hidden");

    if (btnDocThemSynopsis) {
      const chieuCaoThuGon = lblSynopsis.clientHeight;
      lblSynopsis.classList.remove("synopsis-hidden");
      const chieuCaoThucTe = lblSynopsis.scrollHeight;
      lblSynopsis.classList.add("synopsis-hidden");

      if (chieuCaoThucTe > chieuCaoThuGon) {
        btnDocThemSynopsis.style.display = "inline-block";
        btnDocThemSynopsis.addEventListener("click", () => {
          const thuGon = lblSynopsis.classList.toggle("synopsis-hidden");
          xoaHetCon(btnDocThemSynopsis);
          btnDocThemSynopsis.appendChild(taoTextNode(thuGon ? "Đọc thêm" : "Thu gọn"));
        });
      } else {
        btnDocThemSynopsis.style.display = "none";
        lblSynopsis.classList.remove("synopsis-hidden");
      }
    }
  }

  const boxTheLoai = document.getElementById("boxTheLoai");
  if (boxTheLoai && Array.isArray(truyen.theLoai)) {
    xoaHetCon(boxTheLoai);
    const fragment = document.createDocumentFragment();
    truyen.theLoai.forEach((tl) => {
      const tag = document.createElement("a");
      tag.className = "tag";
      tag.href = `theloai.html?theloai=${encodeURIComponent(tl)}`;
      tag.appendChild(taoTextNode(tl));
      fragment.appendChild(tag);
    });
    boxTheLoai.appendChild(fragment);
  }
};

// CHỨC NĂNG: THEO DÕI TRUYỆN

const capNhatGiaoDienTheoDoi = (daTheoDoi) => {
  if (!truyen) return;
  const btnTheoDoi = document.getElementById("btnTheoDoi");
  const lblLuotTheoDoi = document.getElementById("lblLuotTheoDoi");

  if (btnTheoDoi) {
    xoaHetCon(btnTheoDoi);

    const icon = document.createElement("i");
    btnTheoDoi.classList.toggle("da-theo-doi", daTheoDoi);

    if (daTheoDoi) {
      icon.className = "bi bi-heart-fill";
      icon.style.color = "#e74c3c";
      btnTheoDoi.appendChild(icon);
      btnTheoDoi.appendChild(taoTextNode(" Đã theo dõi"));
    } else {
      icon.className = "bi bi-heart";
      btnTheoDoi.appendChild(icon);
      btnTheoDoi.appendChild(taoTextNode(" Theo dõi"));
    }
  }

  if (lblLuotTheoDoi) {
    xoaHetCon(lblLuotTheoDoi);

    const soLuotGocStr = typeof layLuotTheoThucTe === "function" 
      ? layLuotTheoThucTe(idTruyen) 
      : truyen.luotTheo || "0";

    let soLuotSo = Number(String(soLuotGocStr).replace(/,/g, "")) || 0;
    if (daTheoDoi) soLuotSo += 1;

    const soLuotHienThi = soLuotSo.toLocaleString("en-US");
    lblLuotTheoDoi.appendChild(taoTextNode(soLuotHienThi));
  }
};

const thietLapChucNangTheoDoi = () => {
  if (!truyen) return;
  const btnTheoDoi = document.getElementById("btnTheoDoi");
  if (!btnTheoDoi) return;
  const daTheoDoi = typeof kiemTraDaTheoDoi === "function" 
    ? kiemTraDaTheoDoi(idTruyen) 
    : false;

  capNhatGiaoDienTheoDoi(daTheoDoi);

  btnTheoDoi.addEventListener("click", () => {
    if (typeof toggleTheoDoiId === "function") {
      const ketQuaToggle = toggleTheoDoiId(idTruyen);
      if (typeof ketQuaToggle === "boolean") {
        capNhatGiaoDienTheoDoi(ketQuaToggle);
      }
    }
  });
};

// CHỨC NĂNG: QUẢN LÝ DANH SÁCH CHAPTER

const thietLapNutDocTruyen = () => {
  const btnDocTuDau = document.getElementById("btnDocTuDau");
  const btnDocMoiNhat = document.getElementById("btnDocMoiNhat");

  const xuLyChuyenTrang = function () {
    const url = this.dataset.url;
    if (url) {
      window.location.href = url;
    }
  };

  if (btnDocTuDau) {
    btnDocTuDau.addEventListener("click", xuLyChuyenTrang);
  }
  if (btnDocMoiNhat) {
    btnDocMoiNhat.addEventListener("click", xuLyChuyenTrang);
  }
};

const renderDanhSachChapter = () => {
  if (!truyen) return;
  const listEl = document.getElementById("danhSachChapter");
  const btnXemThem = document.getElementById("btnXemThemChapter");
  const chapterDem = document.getElementById("chapterDem");

  if (!listEl) return;
  xoaHetCon(listEl);

  const mangChapter = Array.isArray(truyen.danhSachChapter)
    ? [...truyen.danhSachChapter]
    : [];

  if (chapterDem) {
    xoaHetCon(chapterDem);
    chapterDem.appendChild(taoTextNode(`(${mangChapter.length})`));
  }

  if (mangChapter.length === 0) return;

  const btnDocTuDau = document.getElementById("btnDocTuDau");
  const btnDocMoiNhat = document.getElementById("btnDocMoiNhat");

  const chapDau = mangChapter.reduce((min, c) => (c.so < min.so ? c : min), mangChapter[0]);
  const chapMoiNhat = mangChapter.reduce((max, c) => (c.so > max.so ? c : max), mangChapter[0]);

  if (btnDocTuDau && chapDau) {
    btnDocTuDau.dataset.url = `doctruyen.html?id=${idTruyen}&chapter=${chapDau.so}`;
  }
  if (btnDocMoiNhat && chapMoiNhat) {
    btnDocMoiNhat.dataset.url = `doctruyen.html?id=${idTruyen}&chapter=${chapMoiNhat.so}`;
  }

  mangChapter.sort((a, b) => (thuTuChapter === "desc" ? b.so - a.so : a.so - b.so));

  const soLuongHienThi = chapterMoRong ? mangChapter.length : 5;
  const dsHienThi = mangChapter.slice(0, soLuongHienThi);

  const fragment = document.createDocumentFragment();

  dsHienThi.forEach((chap) => {
    const link = document.createElement("a");
    link.className = "chapter-item";
    link.href = `doctruyen.html?id=${idTruyen}&chapter=${chap.so}`;

    const spanSo = document.createElement("span");
    spanSo.className = "chapter-so";
    spanSo.appendChild(taoTextNode(`Chương ${chap.so}`));

    if (chap.isMoi) {
      const badgeMoi = document.createElement("span");
      badgeMoi.className = "chapter-moi-badge";
      badgeMoi.appendChild(taoTextNode("NEW"));
      spanSo.appendChild(badgeMoi);
    }

    const spanNgay = document.createElement("span");
    spanNgay.className = "chapter-ngay";
    spanNgay.appendChild(taoTextNode(chap.ngay || "Vừa xong"));

    link.appendChild(spanSo);
    link.appendChild(spanNgay);
    fragment.appendChild(link);
  });

  listEl.appendChild(fragment);

  if (btnXemThem) {
    btnXemThem.style.display = mangChapter.length <= 5 ? "none" : "inline-block";
    xoaHetCon(btnXemThem);
    btnXemThem.appendChild(
      taoTextNode(chapterMoRong ? "Thu gọn danh sách" : "Xem thêm chương")
    );
  }
};

const thietLapTuongTacChapter = () => {
  const btnDaoNguoc = document.getElementById("btnDaoNguoc");
  const btnXemThem = document.getElementById("btnXemThemChapter");

  if (btnDaoNguoc) {
    btnDaoNguoc.addEventListener("click", () => {
      thuTuChapter = thuTuChapter === "desc" ? "asc" : "desc";
      btnDaoNguoc.setAttribute("data-order", thuTuChapter);

      const textNode = btnDaoNguoc.querySelector(".sort-text");
      if (textNode) {
        xoaHetCon(textNode);
        textNode.appendChild(
          taoTextNode(thuTuChapter === "desc" ? "Mới nhất trước" : "Cũ nhất trước")
        );
      }
      renderDanhSachChapter();
    });
  }

  if (btnXemThem) {
    btnXemThem.addEventListener("click", () => {
      chapterMoRong = !chapterMoRong;
      renderDanhSachChapter();
    });
  }
};

// CHỨC NĂNG: ĐÁNH GIÁ SAO VÀ BÌNH LUẬN

const khoBinhLuan = {};

const layKhoBinhLuan = () => {
  if (!khoBinhLuan[idTruyen]) {
    khoBinhLuan[idTruyen] = [];
  }
  return khoBinhLuan[idTruyen];
};

const thietLapDanhGiaSao = () => {
  const stars = document.querySelectorAll("#starsGroup .star-pick");
  const lblDiem = document.getElementById("lblDiemDanhGia");

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      saoDangChon = Number(this.getAttribute("data-value")) || 0;

      stars.forEach((s) => {
        const val = Number(s.getAttribute("data-value"));
        s.classList.toggle("active", val <= saoDangChon);
      });

      if (lblDiem) {
        xoaHetCon(lblDiem);
        lblDiem.appendChild(taoTextNode(`${saoDangChon}/5`));
      }
    });
  });
};

const renderDanhSachBinhLuan = () => {
  const khuBinhLuan = document.getElementById("khuBinhLuan");
  if (!khuBinhLuan) return;

  xoaHetCon(khuBinhLuan);

  const dsSapXep = [...layKhoBinhLuan()].reverse();

  if (dsSapXep.length === 0) {
    const emptyP = document.createElement("p");
    emptyP.className = "empty-comment-text";
    emptyP.appendChild(
      taoTextNode("Chưa có bình luận nào. Hãy là người đầu tiên bình luận và đánh giá!")
    );
    khuBinhLuan.appendChild(emptyP);
    return;
  }

  const fragment = document.createDocumentFragment();

  dsSapXep.forEach((bl) => {
    const card = document.createElement("div");
    card.className = "binh-luan-item";

    const tenHienThi = bl.fullname || bl.email || "Độc giả";

    const avatar = document.createElement("div");
    avatar.className = "bl-avatar";
    avatar.appendChild(taoTextNode(tenHienThi.trim().charAt(0).toUpperCase()));

    const body = document.createElement("div");
    body.className = "bl-noidung";

    const meta = document.createElement("div");
    meta.className = "bl-meta";

    const name = document.createElement("strong");
    name.appendChild(taoTextNode(tenHienThi));
    meta.appendChild(name);

    if (bl.saoDanhGia > 0) {
      const starsSpan = document.createElement("span");
      starsSpan.className = "bl-stars";
      starsSpan.appendChild(
        taoTextNode(" ★".repeat(bl.saoDanhGia) + "☆".repeat(5 - bl.saoDanhGia))
      );
      meta.appendChild(starsSpan);
    }

    const time = document.createElement("span");
    time.className = "bl-time";
    time.appendChild(taoTextNode(` · ${bl.ngayDang || "Gần đây"}`));
    meta.appendChild(time);

    const content = document.createElement("p");
    content.appendChild(taoTextNode(bl.noiDung));

    body.appendChild(meta);
    body.appendChild(content);

    card.appendChild(avatar);
    card.appendChild(body);

    fragment.appendChild(card);
  });

  khuBinhLuan.appendChild(fragment);
};

const thietLapFormBinhLuan = () => {
  const formBinhLuan = document.getElementById("formBinhLuan");
  const txtBinhLuan = document.getElementById("txtBinhLuan");
  const thongBaoDangNhapBL = document.getElementById("thongBaoDangNhapBL");

  if (!formBinhLuan) return;

  if (thongBaoDangNhapBL) {
    const linkLogin = thongBaoDangNhapBL.querySelector("a");
    if (linkLogin) {
      const duongDanHienTai = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      linkLogin.href = `login.html?quaylai=${duongDanHienTai}`;
    }
  }

  formBinhLuan.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này!");
      return;
    }

    const noiDung = txtBinhLuan ? txtBinhLuan.value.trim() : "";
    if (noiDung.length < 1 || noiDung.length > 500) {
      alert("Nội dung bình luận phải từ 1 đến 500 ký tự!");
      return;
    }

    const dsMoi = layKhoBinhLuan();
    dsMoi.push({
      id: Date.now(),
      fullname: currentUser.fullname || null,
      email: currentUser.email || "Ẩn danh",
      noiDung: noiDung,
      ngayDang: new Date().toLocaleString("vi-VN"),
      saoDanhGia: saoDangChon,
    });

    capNhatDiemDanhGiaTrungBinh(dsMoi);

    if (txtBinhLuan) txtBinhLuan.value = "";
    saoDangChon = 0;

    document
      .querySelectorAll("#starsGroup .star-pick")
      .forEach((s) => s.classList.remove("active"));

    const lblDiem = document.getElementById("lblDiemDanhGia");
    if (lblDiem) {
      xoaHetCon(lblDiem);
      lblDiem.appendChild(taoTextNode("0/5"));
    }

    renderDanhSachBinhLuan();
  });

  const loggedIn = !!currentUser;
  formBinhLuan.classList.toggle("bl-login-hidden", !loggedIn);
  if (thongBaoDangNhapBL) {
    thongBaoDangNhapBL.classList.toggle("bl-login-hidden", loggedIn);
  }
};

// CHỨC NĂNG: GỢI Ý TRUYỆN LIÊN QUAN 

const renderTruyenLQuan = () => {
  const khuTruyenLQuan = document.getElementById("khuTruyenLQuan");
  if (!khuTruyenLQuan) return;

  xoaHetCon(khuTruyenLQuan);

  const dsLoc =
    typeof layTruyenLienQuan === "function"
      ? layTruyenLienQuan(idTruyen, 4)
      : typeof danhSachTruyen !== "undefined"
        ? danhSachTruyen.filter((t) => t.id !== idTruyen).slice(0, 4)
        : [];

  const fragment = document.createDocumentFragment();

  dsLoc.forEach((t) => {
    const card = document.createElement("a");
    card.className = "lien-quan-card";
    card.href = `trangchitiet.html?id=${t.id}`;

    const img = document.createElement("img");
    img.src = t.anhBia;
    img.alt = t.ten;

    const info = document.createElement("div");
    info.className = "lien-quan-info";

    const ten = document.createElement("div");
    ten.className = "lien-quan-ten";
    ten.appendChild(taoTextNode(t.ten));

    const tacGia = document.createElement("div");
    tacGia.className = "lien-quan-tacgia";
    tacGia.appendChild(taoTextNode(t.tacGia || "Đang cập nhật"));

    info.appendChild(ten);
    info.appendChild(tacGia);
    card.appendChild(img);
    card.appendChild(info);
    fragment.appendChild(card);
  });

  khuTruyenLQuan.appendChild(fragment);
};

// TIỆN ÍCH TRANG
const ganMenu = () => {
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
};

const ganNutQuayLai = () => {
  const btnQuayLai = document.getElementById("quaylai");
  if (!btnQuayLai) return;

  window.addEventListener("scroll", () => {
    btnQuayLai.style.display = window.scrollY > 300 ? "block" : "none";
  });

  btnQuayLai.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

const ganTimKiem = () => {
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
      p.style.padding = "12px";
      p.appendChild(taoTextNode("Không tìm thấy truyện"));
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
        ten.appendChild(taoTextNode(t.ten));

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
};

document.addEventListener("DOMContentLoaded", () => {
  ganMenu();
  ganTimKiem();
  ganNutQuayLai();

  if (!truyen) {
    xuLyHienThiLoi404();
    return;
  }

  hienThiChiTietTruyen();
  thietLapChucNangTheoDoi();
  renderDanhSachChapter();
  thietLapNutDocTruyen();
  thietLapTuongTacChapter();
  renderTruyenLQuan();
  thietLapDanhGiaSao();
  renderDanhSachBinhLuan();
  thietLapFormBinhLuan();
});