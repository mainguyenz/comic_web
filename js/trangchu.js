//Nút Cuộn Lên Đầu Trang
function ganNutQuayLai() {
  const nutQuayLai = document.querySelector(".quaylai");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      //Nếu khoảng cách đã cuộn trên 300
      nutQuayLai.style.display = "block"; //Hiển thị nút quay lại
    } else {
      nutQuayLai.style.display = "none"; //Ẩn nút
    }
  });
  nutQuayLai.addEventListener("click", function () {
    //Khi người dùng nhấn vào nút quay lại
    window.scrollTo({
      top: 0, //Cuộn về vị trí 0px
      behavior: "smooth", // Hiệu ứng mượt
    });
  });
}
//Tìm Kiếm Truyện
function ganTimKiem() {
  const input = document.getElementById("inputsearch");
  const goiY = document.getElementById("goiYTimKiem");

  input.addEventListener("input", function () {
    const tuKhoa = input.value.trim().toLowerCase();

    goiY.replaceChildren();

    if (tuKhoa === "") {
      goiY.style.display = "none";
      return;
    }

    const tatCaTruyen = document.querySelectorAll(".khungtruyenrieng");
    const daThem = new Set();
    let dem = 0;

    tatCaTruyen.forEach(function (truyen) {
      const ten = truyen.querySelector("h3").textContent.trim();

      if (daThem.has(ten.toLowerCase())) return;

      if (ten.toLowerCase().includes(tuKhoa)) {
        daThem.add(ten.toLowerCase());

        const link = document.createElement("a");
        link.href = truyen.querySelector("a").href;
        link.className = "item-goi-y";

        const img = document.createElement("img");
        img.src = truyen.querySelector("img").src;
        img.alt = ten;

        const tenTruyen = document.createElement("span");
        tenTruyen.textContent = ten;

        link.appendChild(img);
        link.appendChild(tenTruyen);

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
//Nút Xem Thêm
function ganNutXemThem() {
  const btnXemThem = document.getElementById("btnXemThem");
  const khungDeCu = document.querySelector(".khungtruyen_decu");
  let moRong = false;
  btnXemThem.addEventListener("click", function () {
    if (moRong === false) {
      khungDeCu.style.maxHeight = khungDeCu.scrollHeight + "px"; //Mở rộng khung
      btnXemThem.textContent = "Thu Gọn";
      moRong = true;
    } else {
      khungDeCu.style.maxHeight = "950px";
      btnXemThem.textContent = "Xem Thêm";
      moRong = false;
    }
  });
}
//Hiệu Ứng Khi Cuộn Xuống
function ganHieuUngCuon() {
  const sections = document.querySelectorAll(".hidden");
  //IntersectionObserver: theo dõi một phần tử đã xuất hiện trên màn hình hay chưa
  //entries: danh sách những phần tử đang được theo dõi
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show"); //Thêm class show
        observer.unobserve(entry.target); //Sau khi hiện nội dung thì ngừng theo dõi
      }
    });
  });
  //Cho observer theo dõi từng section
  sections.forEach(function (section) {
    observer.observe(section);
  });
}
//Nút Khám Phá
function ganNutKhamPha() {
  const btnKhamPha = document.querySelector(".content_background button");
  const mucTheLoai = document.getElementById("theloai");
  btnKhamPha.addEventListener("click", function () {
    mucTheLoai.scrollIntoView({
      behavior: "smooth",
    });
  });
}
//Hiệu Ứng Chuyển Đổi Nền
function ganChuyenNen() {
  const background = document.getElementById("background");
  const images = ["img/bg1.png", "img/bg2.jpg", "img/bg3.jpg"]; //Tạo danh sách ảnh
  let index = 0;
  //Sau 5s sẽ chạy đoạn code bên trong
  setInterval(function () {
    index++;
    if (index >= images.length) {
      index = 0;
    }

    background.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${images[index]}')`;
  }, 5000);
}

//Nút Menu
function ganMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  //e: Event Object
  menuToggle.addEventListener("click", function (e) {
    //stopPropagation: ngăn sự kiện click lan trên các phần tử cha
    e.stopPropagation();
    menu.classList.toggle("active");
  });
  menu.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  //Khi click bên ngoài thì xóa luôn class active
  document.addEventListener("click", function () {
    menu.classList.remove("active");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  ganNutQuayLai();
  ganTimKiem();
  ganNutXemThem();
  ganHieuUngCuon();
  ganNutKhamPha();
  ganChuyenNen();
  ganMenu();
});
