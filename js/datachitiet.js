// ============================================================================
// HÀM HỖ TRỢ TẠO DỮ LIỆU CHAPTER
// ============================================================================

function demSoChapter(idTruyen) {
  if (typeof chapters === "undefined" || !Array.isArray(chapters)) return 0;

  const cuaTruyenNay = chapters.filter((c) => c.id === idTruyen);
  if (cuaTruyenNay.length === 0) return 0;

  return Math.max(...cuaTruyenNay.map((c) => c.chapter));
}

function taoChapter(
  tongChapter,
  chapterDacBiet = [],
  ngayBatDau = new Date(),
  soNgayMoiChap = 7
) {
  const ds = [];
  const nowMs = ngayBatDau.getTime();
  const dayInMs = 86400000; // 24 * 60 * 60 * 1000

  for (let i = tongChapter; i >= 1; i--) {
    const soChapterLuiVe = tongChapter - i;
    const ngayChap = new Date(nowMs - soChapterLuiVe * soNgayMoiChap * dayInMs);

    ds.push({
      so: i,
      ngay: ngayChap.toLocaleDateString("vi-VN"),
      isMoi: soChapterLuiVe < 4,
    });
  }

  // Ghi đè các chapter có cấu hình đặc biệt
  if (Array.isArray(chapterDacBiet) && chapterDacBiet.length > 0) {
    const mapDacBiet = new Map(chapterDacBiet.map((item) => [item.so, item]));
    return ds.map((item) =>
      mapDacBiet.has(item.so) ? { ...item, ...mapDacBiet.get(item.so) } : item
    );
  }

  return ds;
}

// ============================================================================
// DANH SÁCH DỮ LIỆU TRUYỆN
// ============================================================================

const danhSachTruyen = [
  {
    id: 1,
    ten: "Thanh Gươm Diệt Quỷ",
    tenKhac: ["Kimetsu no Yaiba", "鬼滅の刃", "Demon Slayer"],
    tacGia: "Koyoharu Gotouge",
    tinhTrang: "Hoàn Thành",
    theLoai: ["Drama", "Fantasy", "Manga", "Shounen"],
    luotXem: "18,500,000",
    luotTheo: "1,200,000",
    diemDanhGia: 4.9,
    anhBia: "https://phongvu.vn/cong-nghe/wp-content/uploads/2025/08/hinh-nen-thanh-guom-diet-quy-55-576x1024.jpg",
    moTa: `Thanh Gươm Diệt Quỷ kể về câu chuyện diễn ra trong một thế giới nơi loài quỷ ăn thịt người hoành hành khắp nơi. Sau khi gia đình bị quỷ sát hại và em gái Nezuko bị biến thành quỷ, Kamado Tanjiro quyết tâm bước lên con đường trở thành kiếm sĩ diệt quỷ.`,
    danhSachChapter: taoChapter(demSoChapter(1) || 205),
    binhLuan: [],
  },
  {
    id: 2,
    ten: "Chú Thuật Hồi Chiến",
    tenKhac: ["Jujutsu Kaisen", "呪術廻戦", "JJK"],
    tacGia: "Gege Akutami",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Fantasy", "Shounen", "Horror"],
    luotXem: "15,200,000",
    luotTheo: "980,000",
    diemDanhGia: 4.8,
    anhBia: "https://t.ctcdn.com.br/BgnIXmwrGYCtXF919pg8qHMgTfo=/600x600/smart/i975461.jpeg",
    moTa: `Yuji Itadori là một học sinh trung học bình thường với sức mạnh thể chất phi thường. Cuộc đời cậu thay đổi hoàn toàn khi cậu vô tình nuốt một ngón tay của Ryomen Sukuna — vị vua nguyền của thế giới chú thuật.`,
    danhSachChapter: taoChapter(demSoChapter(2) || 266),
    binhLuan: [],
  },
  {
    id: 3,
    ten: "Thám Tử Conan",
    tenKhac: ["Detective Conan", "名探偵コナン"],
    tacGia: "Gosho Aoyama",
    tinhTrang: "Đang Ra",
    theLoai: ["Comedy", "Drama", "Manga", "Romance", "School Life", "Trinh Thám"],
    luotXem: "22,100,000",
    luotTheo: "1,450,000",
    diemDanhGia: 4.8,
    anhBia: "https://i.pinimg.com/736x/af/f1/a3/aff1a34e425f8c69447c0cfda16d1753.jpg",
    moTa: `Shinichi Kudo là một học sinh trung học và thám tử thiên tài nổi tiếng với khả năng suy luận xuất sắc. Cuộc đời cậu thay đổi hoàn toàn khi bị ép uống một loại thuốc độc khiến cơ thể bị thu nhỏ.`,
    danhSachChapter: taoChapter(demSoChapter(3) || 1120),
    binhLuan: [],
  },
  {
    id: 4,
    ten: "Black Clover - Thế Giới Phép Thuật",
    tenKhac: ["Black Clover", "ブラッククローバー"],
    tacGia: "Yuki Tabata",
    tinhTrang: "Hoàn Thành",
    theLoai: ["Action"],
    luotXem: "19,800,000",
    luotTheo: "540,000",
    diemDanhGia: 4.6,
    anhBia: "https://dicasgeeks.com.br/wp-content/uploads/2019/11/capa.jpg",
    moTa: `Black Clover kể về câu chuyện của Asta, một cậu bé sinh ra trong thế giới mà mọi người đều sở hữu ma pháp, ngoại trừ chính cậu. Dù không có phép thuật, Asta vẫn nuôi dưỡng ước mơ trở thành Ma Pháp Vương.`,
    danhSachChapter: taoChapter(demSoChapter(4) || 370),
    binhLuan: [],
  },
  {
    id: 5,
    ten: "Mairimashita! Iruma-kun",
    tenKhac: ["Welcome to Demon School! Iruma-kun"],
    tacGia: "Osamu Nishi",
    tinhTrang: "Đang Ra",
    theLoai: ["Comedy", "Drama", "Fantasy", "Manga", "School Life", "Shounen"],
    luotXem: "11,300,000",
    luotTheo: "310,000",
    diemDanhGia: 4.5,
    anhBia: "https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/9439/1734434359439-i",
    moTa: `Mairimashita! Iruma-kun kể về Suzuki Iruma, một cậu bé 14 tuổi bị cha mẹ vô trách nhiệm bán cho ác quỷ Sullivan. Tuy nhiên, cậu lại được Sullivan nhận làm cháu nuôi và đưa đến sống tại Ma giới.`,
    danhSachChapter: taoChapter(demSoChapter(5) || 280),
    binhLuan: [],
  },
  {
    id: 6,
    ten: "Wistoria Bản Hùng Ca Kiếm Và Pháp Trượng",
    tenKhac: ["Wistoria: Wand and Sword"],
    tacGia: "Hyun Sub Shin",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Adventure", "Fantasy", "Comedy", "Manga", "School Life"],
    luotXem: "2,100,000",
    luotTheo: "150,000",
    diemDanhGia: 4.4,
    anhBia: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx182300-IYkq5KrkQq1V.jpg",
    moTa: `Wistoria: Wand and Sword kể về Will Serfort, một chàng trai trẻ không thể sử dụng ma pháp trong một thế giới nơi sức mạnh phép thuật quyết định tất cả.`,
    danhSachChapter: taoChapter(demSoChapter(6) || 65),
    binhLuan: [],
  },
  {
    id: 7,
    ten: "Blue Lock",
    tenKhac: ["ブルーロック"],
    tacGia: "Muneyuki Kaneshiro, Yusuke Nomura",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Sport"],
    luotXem: "8,700,000",
    luotTheo: "620,000",
    diemDanhGia: 4.7,
    anhBia: "https://sm.ign.com/t/ign_pk/cover/b/blue-lock-/blue-lock-the-movie-episode-nagi_qgvd.600.jpg",
    moTa: `Blue Lock kể về hành trình của Yoichi Isagi, một tiền đạo trẻ đầy tiềm năng được chọn tham gia dự án Blue Lock — chương trình đào tạo bí mật nhằm tạo ra tiền đạo xuất sắc nhất thế giới.`,
    danhSachChapter: taoChapter(demSoChapter(7) || 280),
    binhLuan: [],
  },
  {
    id: 8,
    ten: "Captain Tsubasa: Rising Sun",
    tenKhac: ["キャプテン翼"],
    tacGia: "Yoichi Takahashi",
    tinhTrang: "Đang Ra",
    theLoai: ["Manga", "Sport"],
    luotXem: "3,400,000",
    luotTheo: "190,000",
    diemDanhGia: 4.3,
    anhBia: "https://play-lh.googleusercontent.com/h9W8nSt2ZbzlmihOsqneMa7BWKVcIq7oRvUH3xq1GMgV4tSLOapAJzL6hgE0gEhVtdlTKiTbh9gGNo6W44Gh",
    moTa: `Captain Tsubasa: Rising Sun tiếp tục câu chuyện về Tsubasa Ozora và các đồng đội khi họ đại diện cho đội tuyển U-23 Nhật Bản tham gia đấu trường bóng đá quốc tế.`,
    danhSachChapter: taoChapter(demSoChapter(8) || 45),
    binhLuan: [],
  },
  {
    id: 9,
    ten: "Tôi Mộng Giữa Ban Ngày",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Manhua", "Ngôn Tình", "School Life", "Truyện Màu"],
    luotXem: "1,250,000",
    luotTheo: "88,000",
    diemDanhGia: 4.2,
    anhBia: "https://soaicacomic2.top/wp-content/uploads/2023/05/toi-mong-giua-ban-ngay-720x970.jpg",
    moTa: `Tôi Mộng Giữa Ban Ngày kể về câu chuyện tình cảm thanh xuân giữa Lâm Ngữ Kinh và Thẩm Quyện tại ngôi trường mới.`,
    danhSachChapter: taoChapter(demSoChapter(9) || 40),
    binhLuan: [],
  },
  {
    id: 10,
    ten: "Còn Ra Thể Thống Gì Nữa",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "980,000",
    luotTheo: "62,000",
    diemDanhGia: 4.1,
    anhBia: "https://static2.vieon.vn/vieplay-image/poster_v4/2026/02/09/ehwpq0wc_660x946-conrathethongginua.png",
    moTa: `Còn Ra Thể Thống Gì Nữa kể về hành trình đầy hài hước và bất ngờ của nữ chính sau khi vô tình xuyên không vào một thế giới kỳ lạ.`,
    danhSachChapter: taoChapter(demSoChapter(10) || 30),
    binhLuan: [],
  },
  {
    id: 11,
    ten: "Thế Giới Sau Tận Thế",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Comedy", "Manhwa", "Truyện Màu"],
    luotXem: "1,600,000",
    luotTheo: "105,000",
    diemDanhGia: 4.3,
    anhBia: "https://i.redd.it/ws2ml66sx55h1.jpeg",
    moTa: `Thế Giới Sau Tận Thế kể về hành trình sinh tồn và khám phá của những con người còn sống sót sau khi thế giới rơi vào thảm họa diệt vong.`,
    danhSachChapter: taoChapter(demSoChapter(11) || 55),
    binhLuan: [],
  },
  {
    id: 12,
    ten: "Ma Vương Tái Sinh Trở Thành Pháp Sư Mạnh Nhất",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Adventure", "Fantasy", "Manga", "Romance"],
    luotXem: "2,050,000",
    luotTheo: "134,000",
    diemDanhGia: 4.4,
    anhBia: "img/tt6.jpg",
    moTa: `Ma Vương Tái Sinh Trở Thành Pháp Sư Mạnh Nhất kể về Varvatos, Ma Vương mạnh nhất trong lịch sử quyết định tái sinh vào tương lai.`,
    danhSachChapter: taoChapter(demSoChapter(12) || 48),
    binhLuan: [],
  },
  {
    id: 13,
    ten: "Bạo Thực Giả",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "890,000",
    luotTheo: "51,000",
    diemDanhGia: 4.0,
    anhBia: "https://truyenqq.com.vn/media/book/bao-thuc-gia.png",
    moTa: `Bạo Thực Giả kể về Fate Graphite, một chàng trai bị mọi người khinh thường vì sở hữu kỹ năng Bạo Thực tưởng chừng vô dụng.`,
    danhSachChapter: taoChapter(demSoChapter(13) || 25),
    binhLuan: [],
  },
  {
    id: 14,
    ten: "Bá Vương Sủng Ái Cô Vợ Mù",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Chuyển Sinh", "Manhwa", "Ngôn Tình", "Truyện Màu"],
    luotXem: "1,780,000",
    luotTheo: "142,000",
    diemDanhGia: 4.5,
    anhBia: "img/tt1.png",
    moTa: `Bá Vương Sủng Ái Cô Vợ Mù kể về câu chuyện tình yêu đầy cảm xúc giữa một tổng tài quyền lực và người vợ mù của anh.`,
    danhSachChapter: taoChapter(demSoChapter(14) || 60),
    binhLuan: [],
  },
  {
    id: 15,
    ten: "Ác Chi Hoàn",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "670,000",
    luotTheo: "38,000",
    diemDanhGia: 3.9,
    anhBia: "img/tt14.jpg",
    moTa: `Ác Chi Hoàn kể về hành trình sinh tồn đầy căng thẳng của những con người bị cuốn vào một thế giới tàn khốc.`,
    danhSachChapter: taoChapter(demSoChapter(15) || 20),
    binhLuan: [],
  },
  {
    id: 16,
    ten: "Thế Giới Này Không Tồn Tại Ma Quỷ",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "540,000",
    luotTheo: "29,000",
    diemDanhGia: 3.8,
    anhBia: "img/tt2.png",
    moTa: `Thế Giới Này Không Tồn Tại Ma Quỷ kể về câu chuyện của một chàng trai vô tình phát hiện ra thế giới không bình thường như vẻ bề ngoài.`,
    danhSachChapter: taoChapter(demSoChapter(16) || 18),
    binhLuan: [],
  },
  {
    id: 17,
    ten: "Phát Sóng Của Siêu Việt Giả",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "710,000",
    luotTheo: "44,000",
    diemDanhGia: 4.0,
    anhBia: "img/tt3.png",
    moTa: `Phát Sóng Của Siêu Việt Giả kể về hành trình của một người sở hữu năng lực đặc biệt khi trở thành tâm điểm của hệ thống phát sóng bí ẩn.`,
    danhSachChapter: taoChapter(demSoChapter(17) || 22),
    binhLuan: [],
  },
  {
    id: 18,
    ten: "Tỏ Tình",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Manhua", "Ngôn Tình", "Romance", "Truyện Màu"],
    luotXem: "1,020,000",
    luotTheo: "76,000",
    diemDanhGia: 4.2,
    anhBia: "img/tt4.png",
    moTa: `Tỏ Tình kể về câu chuyện tình yêu thanh xuân đầy ngọt ngào và cảm động giữa những con người trẻ tuổi.`,
    danhSachChapter: taoChapter(demSoChapter(18) || 35),
    binhLuan: [],
  },
  {
    id: 19,
    ten: "Sức Mạnh Tối Đa? Ta Lại Là Vong Linh Sư",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Manhua", "Action", "Truyện Màu"],
    luotXem: "1,340,000",
    luotTheo: "97,000",
    diemDanhGia: 4.3,
    anhBia: "img/tt5.png",
    moTa: `Sức Mạnh Tối Đa? Ta Lại Là Vong Linh Sư kể về hành trình của một chàng trai bất ngờ thức tỉnh với thiên phú cấp cao nhất.`,
    danhSachChapter: taoChapter(demSoChapter(19) || 38),
    binhLuan: [],
  },
  {
    id: 20,
    ten: "Kiếm Thực",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "img/tt8.png",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 21,
    ten: "Cuộc Sống Hiện Đại Của Đấng Tối Cao",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "img/tt7.jpg",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 22,
    ten: "Top Ranker",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "img/tt9.png",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 23,
    ten: "Chiến Lược Chinh Phục Tòa Tháp Của Gã Hanam",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Sắp Ra Mắt",
    theLoai: ["Action"],
    luotXem: "0",
    luotTheo: "0",
    diemDanhGia: 0,
    anhBia: "img/tt10.png",
    moTa: "Truyện sắp ra mắt — nội dung sẽ được cập nhật khi phát hành chương đầu tiên.",
    danhSachChapter: [],
    binhLuan: [],
  },
  {
    id: 24,
    ten: "Sinh Tồn Với Tư Cách Là Một Huyết Vương",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "620,000",
    luotTheo: "41,000",
    diemDanhGia: 4.0,
    anhBia: "img/tt12.png",
    moTa: `Sinh Tồn Với Tư Cách Là Một Huyết Vương kể về hành trình sinh tồn của nhân vật chính sau khi tái sinh thành Huyết Vương.`,
    danhSachChapter: taoChapter(demSoChapter(24) || 28),
    binhLuan: [],
  },
  {
    id: 25,
    ten: "Cách Thức Sinh Tồn Của Pháo Hôi Khuê Nữ",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Cổ Đại", "Manhua", "Ngôn Tình", "Truyện Màu", "Xuyên Không"],
    luotXem: "870,000",
    luotTheo: "59,000",
    diemDanhGia: 4.1,
    anhBia: "img/tt13.png",
    moTa: `Cách Thức Sinh Tồn Của Pháo Hôi Khuê Nữ kể về một cô gái bất ngờ xuyên không vào tiểu thuyết và trở thành nhân vật phụ bi thảm.`,
    danhSachChapter: taoChapter(demSoChapter(25) || 33),
    binhLuan: [],
  },
  {
    id: 26,
    ten: "Toàn Dân Chuyển Chức Duy Ta Vô Chức Tàn Nhẫn",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action", "Chuyển Sinh", "Manhua", "Truyện Màu", "Xuyên Không"],
    luotXem: "1,450,000",
    luotTheo: "112,000",
    diemDanhGia: 4.3,
    anhBia: "img/tt11.png",
    moTa: `Toàn Dân Chuyển Chức: Duy Ta Vô Chức Tàn Nhẫn kể về một thế giới nơi mọi người đều có thể thức tỉnh nghề nghiệp.`,
    danhSachChapter: taoChapter(demSoChapter(26) || 42),
    binhLuan: [],
  },
  {
    id: 27,
    ten: "Phối Sắc Giã",
    tenKhac: [],
    tacGia: "Đang cập nhật",
    tinhTrang: "Đang Ra",
    theLoai: ["Action"],
    luotXem: "480,000",
    luotTheo: "27,000",
    diemDanhGia: 3.8,
    anhBia: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgdHCv00x-sIEPnpm6NvBW6FO4QwM_o72ZHA&s",
    moTa: `Phối Sắc Giã kể về hành trình của một nhân vật trẻ tuổi sở hữu năng lực đặc biệt liên quan đến màu sắc.`,
    danhSachChapter: taoChapter(demSoChapter(27) || 15),
    binhLuan: [],
  }
];

// ============================================================================
// HÀM TRUY VẤN DỮ LIỆU
// ============================================================================

function layTruyenTheoId(id) {
  const numericId = Number(id);
  if (isNaN(numericId)) return null;
  return danhSachTruyen.find((truyen) => truyen.id === numericId) || null;
}

function layTruyenLienQuan(idHienTai, soLuong = 4) {
  const truyenHienTai = layTruyenTheoId(idHienTai);
  if (!truyenHienTai) return danhSachTruyen.slice(0, soLuong);

  // Lọc truyện khác truyện hiện tại
  const ungVien = danhSachTruyen.filter((t) => t.id !== truyenHienTai.id);

  // Lọc truyện có trùng thể loại
  const cungTheLoai = ungVien.filter((t) =>
    Array.isArray(t.theLoai) &&
    t.theLoai.some((tl) => truyenHienTai.theLoai.includes(tl))
  );

  const danhSachChon = cungTheLoai.length >= soLuong ? cungTheLoai : ungVien;

  // Xáo trộn mảng ngẫu nhiên (Fisher-Yates Shuffle)
  for (let i = danhSachChon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [danhSachChon[i], danhSachChon[j]] = [danhSachChon[j], danhSachChon[i]];
  }

  return danhSachChon.slice(0, soLuong);
}