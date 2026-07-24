// ============================================================================
// HÀM BỔ TRỢ (UTILITIES & LOCALSTORAGE)
// ============================================================================

const layThamSoURL = (tenThamSo) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(tenThamSo);
};

const safeParseJSON = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return fallback;
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

const taoTextNode = (text) => document.createTextNode(String(text));

// ============================================================================
// KIỂM TRA LỖI TRUYỆN KHÔNG TỒN TẠI (404)
// ============================================================================

const idThamSo = layThamSoURL("id");
const idTruyen = idThamSo && idThamSo.trim() !== "" ? Number(idThamSo) : NaN;
const idHopLe = !isNaN(idTruyen) && Number.isInteger(idTruyen) && idTruyen > 0;

const truyen =
  idHopLe && typeof layTruyenTheoId === "function"
    ? layTruyenTheoId(idTruyen)
    : null;

if (!truyen) {
  document.addEventListener("DOMContentLoaded", () => {
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
          taoTextNode(
            "Không tìm thấy truyện hoặc ID không hợp lệ trong hệ thống!",
          ),
        );
      }
    }
  });
  throw new Error("LỖI 404: Không tìm thấy truyện.");
}

// ============================================================================
// TRẠNG THÁI TOÀN CỤC (GLOBAL STATE)
// ============================================================================

let currentUser = safeParseJSON("currentUser", null);
let thuTuChapter = "desc";
let chapterMoRong = false;
let saoDangChon = 0;

// ============================================================================
// CHỨC NĂNG: MÀN HÌNH CHI TIẾT TRUYỆN & MENU
// ============================================================================

const thietLapMenu = () => {
  const khuChuaDangNhap = document.getElementById("khuChuaDangNhap");
  const khuDaDangNhap = document.getElementById("khuDaDangNhap");
  const tenTaiKhoan = document.getElementById("tenTaiKhoan");

  if (currentUser) {
    if (khuChuaDangNhap) khuChuaDangNhap.classList.add("tai-khoan-an");
    if (khuDaDangNhap) {
      khuDaDangNhap.classList.remove("tai-khoan-an");
      if (tenTaiKhoan) {
        xoaHetCon(tenTaiKhoan);
        const { fullname, email } = currentUser;
        tenTaiKhoan.appendChild(taoTextNode(fullname || email || "Độc giả"));
      }
    }
  } else {
    if (khuChuaDangNhap) khuChuaDangNhap.classList.remove("tai-khoan-an");
    if (khuDaDangNhap) khuDaDangNhap.classList.add("tai-khoan-an");
  }
};

const capNhatHienThiDiemDanhGia = () => {
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
    const chuoiSao = "★".repeat(lamTronSao) + "☆".repeat(5 - lamTronSao);
    dungTichSao.appendChild(taoTextNode(chuoiSao));
  }
};

const capNhatDiemDanhGiaTrungBinh = (dsBinhLuan) => {
  const coDanhGia = dsBinhLuan.filter((bl) => bl.saoDanhGia > 0);
  if (coDanhGia.length === 0) return;

  const tong = coDanhGia.reduce((acc, bl) => acc + bl.saoDanhGia, 0);
  truyen.diemDanhGia = tong / coDanhGia.length;

  capNhatHienThiDiemDanhGia();
};

const hienNutDocTiep = () => {
  const btnDocTiep = document.getElementById("btnDocTiep");
  if (!btnDocTiep) return;

  if (typeof layChapterDangDocDo !== "function") {
    btnDocTiep.style.display = "none";
    return;
  }

  const chapterDaDoc = layChapterDangDocDo(idTruyen);
  const { danhSachChapter } = truyen;

  const chapterVanConTonTai =
    chapterDaDoc &&
    Array.isArray(danhSachChapter) &&
    danhSachChapter.some((c) => c.so === chapterDaDoc);

  if (chapterVanConTonTai) {
    btnDocTiep.href = `doctruyen.html?id=${idTruyen}&chapter=${chapterDaDoc}`;
    xoaHetCon(btnDocTiep);
    btnDocTiep.appendChild(taoTextNode(`▶ Đọc Tiếp - Chương ${chapterDaDoc}`));
    btnDocTiep.style.display = "block";
  } else {
    btnDocTiep.style.display = "none";
  }
};

const hienThiChiTietTruyen = () => {
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
  if (Array.isArray(truyen.tenKhac) && truyen.tenKhac.length > 0) {
    if (boxTenKhac) boxTenKhac.classList.remove("alias-hidden");
    if (lblTenKhac) {
      xoaHetCon(lblTenKhac);
      lblTenKhac.appendChild(taoTextNode(truyen.tenKhac.join(", ")));
    }
  } else if (boxTenKhac) {
    boxTenKhac.classList.add("alias-hidden");
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

  const lblLuotTheoDoi = document.getElementById("lblLuotTheoDoi");
  const dsTheoDoi =
    typeof layDanhSachTheoDoi === "function" ? layDanhSachTheoDoi() : [];
  const dangTheoDoi = dsTheoDoi.includes(idTruyen);

  const chuoiLuotTheo = String(truyen.luotTheo || "0").replace(/,/g, "");
  const soTheoDoiGoc = parseInt(chuoiLuotTheo, 10) || 0;

  if (lblLuotTheoDoi) {
    xoaHetCon(lblLuotTheoDoi);
    lblLuotTheoDoi.appendChild(
      taoTextNode(
        (dangTheoDoi ? soTheoDoiGoc + 1 : soTheoDoiGoc).toLocaleString("vi-VN"),
      ),
    );
  }

  const lblSynopsis = document.getElementById("lblSynopsis");
  const btnDocThemSynopsis = document.getElementById("btnDocThemSynopsis");
  const noiDungMoTa =
    truyen.moTa && truyen.moTa.trim() !== ""
      ? truyen.moTa
      : "Không có tóm tắt cho truyện này.";

  if (lblSynopsis) {
    xoaHetCon(lblSynopsis);
    lblSynopsis.appendChild(taoTextNode(noiDungMoTa));
    lblSynopsis.classList.add("synopsis-hidden");
  }

  if (btnDocThemSynopsis && lblSynopsis) {
    setTimeout(() => {
      const chieuCaoThuGon = lblSynopsis.clientHeight;
      lblSynopsis.classList.remove("synopsis-hidden");
      const chieuCaoThucTe = lblSynopsis.scrollHeight;
      lblSynopsis.classList.add("synopsis-hidden");

      if (chieuCaoThucTe > chieuCaoThuGon) {
        btnDocThemSynopsis.style.display = "inline-block";

        btnDocThemSynopsis.addEventListener("click", () => {
          const expanded = lblSynopsis.classList.toggle("synopsis-hidden");
          xoaHetCon(btnDocThemSynopsis);
          btnDocThemSynopsis.appendChild(
            taoTextNode(!expanded ? "Thu gọn" : "Đọc thêm"),
          );
        });
      } else {
        btnDocThemSynopsis.style.display = "none";
        lblSynopsis.classList.remove("synopsis-hidden");
      }
    }, 50);
  }

  const boxTheLoai = document.getElementById("boxTheLoai");
  if (boxTheLoai) {
    xoaHetCon(boxTheLoai);
    if (Array.isArray(truyen.theLoai)) {
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
  }
  const btnTheoDoi = document.getElementById("btnTheoDoi");
  if (btnTheoDoi) {
    const iconHeart = btnTheoDoi.querySelector("i");

    const capNhatGiaoDienTheoDoi = () => {
      const hienTaiDangTheoDoi =
        typeof kiemTraDaTheoDoi === "function"
          ? kiemTraDaTheoDoi(idTruyen)
          : false;

      btnTheoDoi.classList.toggle("dang-theo-doi", hienTaiDangTheoDoi);

      if (iconHeart) {
        iconHeart.className = hienTaiDangTheoDoi
          ? "bi bi-check-lg"
          : "bi bi-heart";
      }

      Array.from(btnTheoDoi.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .forEach((node) => node.remove());

      btnTheoDoi.appendChild(
        taoTextNode(hienTaiDangTheoDoi ? " Bỏ theo dõi" : " Theo dõi"),
      );

      if (lblLuotTheoDoi) {
        xoaHetCon(lblLuotTheoDoi);
        lblLuotTheoDoi.appendChild(
          taoTextNode(
            (hienTaiDangTheoDoi
              ? soTheoDoiGoc + 1
              : soTheoDoiGoc
            ).toLocaleString("vi-VN"),
          ),
        );
      }
    };

    capNhatGiaoDienTheoDoi();

    btnTheoDoi.addEventListener("click", () => {
      if (typeof toggleTheoDoiId !== "function") {
        alert("Hệ thống lưu trữ đang bận, vui lòng thử lại sau!");
        return;
      }
      toggleTheoDoiId(idTruyen);
      capNhatGiaoDienTheoDoi();
    });
  }

  hienNutDocTiep();
};

// ============================================================================
// CHỨC NĂNG: QUẢN LÝ DANH SÁCH CHAPTER
// ============================================================================

const renderDanhSachChapter = () => {
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

  mangChapter.sort((a, b) =>
    thuTuChapter === "desc" ? b.so - a.so : a.so - b.so,
  );

  if (mangChapter.length > 0) {
    const mangGocTangDan = [...mangChapter].sort((a, b) => a.so - b.so);
    const btnDocTuDau = document.getElementById("btnDocTuDau");
    const btnDocMoiNhat = document.getElementById("btnDocMoiNhat");

    if (btnDocTuDau) {
      btnDocTuDau.href = `doctruyen.html?id=${idTruyen}&chapter=${mangGocTangDan[0].so}`;
    }
    if (btnDocMoiNhat) {
      btnDocMoiNhat.href = `doctruyen.html?id=${idTruyen}&chapter=${mangGocTangDan[mangGocTangDan.length - 1].so}`;
    }
  }

  const soLuongHienThi = chapterMoRong ? mangChapter.length : 5;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < Math.min(mangChapter.length, soLuongHienThi); i++) {
    const chap = mangChapter[i];

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
  }

  listEl.appendChild(fragment);

  if (btnXemThem) {
    btnXemThem.style.display =
      mangChapter.length <= 5 ? "none" : "inline-block";
    xoaHetCon(btnXemThem);
    btnXemThem.appendChild(
      taoTextNode(chapterMoRong ? "Thu gọn danh sách" : "Xem thêm chương"),
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
          taoTextNode(
            thuTuChapter === "desc" ? "Mới nhất trước" : "Cũ nhất trước",
          ),
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

// ============================================================================
// CHỨC NĂNG: ĐÁNH GIÁ SAO VÀ BÌNH LUẬN
// ============================================================================

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

const layKhoBinhLuan = () => safeParseJSON("app_comments", {})[idTruyen] || [];

const luuBinhLuanCuaTruyen = (dsBinhLuan) => {
  const toanBoBinhLuan = safeParseJSON("app_comments", {});
  toanBoBinhLuan[idTruyen] = dsBinhLuan.slice(-40);
  localStorage.setItem("app_comments", JSON.stringify(toanBoBinhLuan));
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
      taoTextNode(
        "Chưa có bình luận nào. Hãy là người đầu tiên bình luận và đánh giá!",
      ),
    );
    khuBinhLuan.appendChild(emptyP);
    return;
  }

  const fragment = document.createDocumentFragment();

  dsSapXep.forEach((bl) => {
    const card = document.createElement("div");
    card.className = "binh-luan-item";

    const avatar = document.createElement("div");
    avatar.className = "bl-avatar";
    const tenHienThi = bl.fullname || bl.email || "Độc giả";
    avatar.appendChild(taoTextNode(tenHienThi.trim().charAt(0).toUpperCase()));

    const body = document.createElement("div");
    body.className = "bl-noidung";

    const meta = document.createElement("div");
    meta.className = "bl-meta";

    const name = document.createElement("strong");
    name.appendChild(taoTextNode(tenHienThi));
    meta.appendChild(name);

    if (bl.chapterSo) {
      const tagChap = document.createElement("span");
      tagChap.className = "bl-chapter-badge";
      tagChap.style.color = "#ff9800";
      tagChap.style.fontWeight = "bold";
      tagChap.appendChild(taoTextNode(` Chương ${bl.chapterSo}`));
      meta.appendChild(tagChap);
    }

    if (bl.saoDanhGia > 0) {
      const starsSpan = document.createElement("span");
      starsSpan.className = "bl-stars";
      starsSpan.appendChild(
        taoTextNode(" ★".repeat(bl.saoDanhGia) + "☆".repeat(5 - bl.saoDanhGia)),
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
        window.location.pathname + window.location.search,
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

    luuBinhLuanCuaTruyen(dsMoi);
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

// ============================================================================
// CHỨC NĂNG: GỢI Ý TRUYỆN LIÊN QUAN
// ============================================================================

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

    if (typeof danhSachTruyen === "undefined") return;

    const ketQua = danhSachTruyen.filter((truyen) => {
      const ten = (truyen.ten || "").toLowerCase();
      const tacGia = (truyen.tacGia || "").toLowerCase();
      const theLoai = (truyen.theLoai || []).join(" ").toLowerCase();

      return (
        ten.includes(tuKhoa) ||
        tacGia.includes(tuKhoa) ||
        theLoai.includes(tuKhoa)
      );
    });

    if (ketQua.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Không tìm thấy truyện";
      p.style.padding = "12px";
      goiY.appendChild(p);
    } else {
      ketQua.forEach((truyen) => {
        const link = document.createElement("a");
        link.href = `trangchitiet.html?id=${truyen.id}`;
        link.className = "item-goi-y";

        const img = document.createElement("img");
        img.src = truyen.anhBia;
        img.alt = truyen.ten;

        const ten = document.createElement("span");
        ten.textContent = truyen.ten;

        link.append(img, ten);
        goiY.appendChild(link);
      });
    }

    goiY.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    if (!document.querySelector(".search").contains(e.target)) {
      goiY.style.display = "none";
    }
  });
}
// ============================================================================
// KHỞI TẠO ỨNG DỤNG (ENTRY POINT)
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  ganMenu();
  ganTimKiem();
  ganNutQuayLai();
  thietLapMenu();
  hienThiChiTietTruyen();
  renderDanhSachChapter();
  thietLapTuongTacChapter();
  thietLapDanhGiaSao();
  renderDanhSachBinhLuan();
  thietLapFormBinhLuan();
  renderTruyenLQuan();
});
