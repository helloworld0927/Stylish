let hostSrc = "https://api.appworks-school.tw/api/1.0/";
let initPage = 0;
let initCategories = "";
let loadingStatus = false;
let initIndex = 0; // for slideEffect()
let urlParams = window.location.search;
let keyParams;
let redirectionCatalog;

// init function //
redirection();
campaigns();

window.onload = enterSumit;
// should be onloaded first because of 'addEventListener' of null ( first: JS >> last: render)

// ========== Product API ========== //
// step.1  Connect API //
function mainPageAPI(categories, index = 0) {
  let src = hostSrc + "products/" + categories + "?paging=" + index;

  fetch(src, { method: "get" })
    .then(function (response) {
      return response.json();
    })
    .then(function (resJson) {
      renderMainPage(resJson);

      if (resJson.next_paging != undefined) {
        initPage = resJson.next_paging;
        loadingStatus = true;
        initCategories = `${categories}`;
      } else {
        console.log(" All Products are printed ");
        initPage = 0;
        initCategories = "";
      }
    })
    .catch(function (e) {
      console.log("mainPageAPI Error");
    });
}

// step2. render homePage //
function renderMainPage(resJson) {
  let data = resJson.data;
  let products = document.getElementById("products");
  let productSrc = "product.html?id=";

  for (i = 0; i < data.length; i++) {
    // I. createElements
    let product = document.createElement("div");
    product.className = "product";
    let pic = document.createElement("a");
    pic.className = "pic";
    pic.href = productSrc + data[i].id;
    let text = document.createElement("div");
    text.className = "text";
    let colors = document.createElement("div");
    colors.className = "colors";
    let productName = document.createElement("div");
    productName.className = "name";
    let price = document.createElement("div");
    price.className = "price";
    // list products color option
    for (x = 0; x < data[i].colors.length; x++) {
      let color = document.createElement("div");
      color.className = "color";

      color.style.backgroundColor = "#" + data[i].colors[x].code;
      colors.appendChild(color);
    }

    // II. fill content
    pic.innerHTML = `<img src="${data[i].main_image}"/>`;
    productName.innerHTML = data[i].title;
    price.innerHTML = "TWD." + data[i].price;

    // III.  appendChild
    text.appendChild(colors);
    text.appendChild(productName);
    text.appendChild(price);
    product.appendChild(pic);
    product.appendChild(text);
    products.appendChild(product);
  }
}

// Week-1-part-1
// ==========  Step 1: Complete Search Feature, Search API ========== //
function enterSumit() {
  // Web
  let keywordElementW = document.getElementById("searchValueW");
  // Mobile
  let keywordElementM = document.getElementById("searchValueM");

  keywordElementW.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("webSeacrhBtn").click();
    }
  });

  keywordElementM.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("mobileSeacrhBtn").click();
    }
  });
}

function mobileSearch() {
  let mobileSearch = document.getElementById("mobileSearchIcon");
  let mobileSearchBar = document.getElementById("mobileSearchBar");

  mobileSearch.style.display = "none";
  mobileSearchBar.style.display = "block";
}

function searchProductMobile() {
  let keywordElement = document.getElementById("searchValueM");
  let key = keywordElement.value;
  //  no input warning
  if (key.trim().length === 0) {
    alert("請輸入項目");
  } else {
    searchAPI(key);
  }
}

function searchProductWeb() {
  let keywordElement = document.getElementById("searchValueW");
  let key = keywordElement.value;
  //  no input warning
  if (key.trim().length === 0) {
    alert("請輸入項目");
  } else {
    searchAPI(key);
  }
}

function searchAPI(key) {
  let src = hostSrc + "products/search?keyword=" + key;
  document.getElementById("products").innerHTML = "";

  fetch(src, { method: "get" })
    .then(function (response) {
      return response.json();
    })
    .then(function (resJson) {
      // console.log(resJson);
      renderMainPage(resJson);
      if (resJson.data.length === 0) {
        products.innerHTML = " 搜尋結果 : 無相符商品 ";
      }
    })
    .catch(function () {
      console.log(" searchM API error");
    });
}

// ========== Step 2: Complete Paging Feature, loading next page ========== //
// 1. 設置判斷開始條件: scroll event
// 2. 綁定物件: getBoundingClientRect() method.
// 3. 可在全域狀態增加 當前頁面 當前目錄 載入狀態

window.onscroll = function () {
  loadingNextPage();
};

function loadingNextPage() {
  let mainPageProducts = document.getElementById("products");
  let mainPageRect = mainPageProducts.getBoundingClientRect();
  let viewed = window.scrollY + window.innerHeight;
  let lastSpace = mainPageRect.bottom + 700;

  if (viewed >= lastSpace && loadingStatus === true) {
    loadingStatus = false;
    mainPageAPI(initCategories, initPage);
  }
}

//  ========== tags ========== //
function womenProductAPI() {
  products.innerHTML = "";
  mainPageAPI("women");
  gtag("event", "Click", {
    event_category: "Main Page",
    event_label: "進入女裝",
  });
}

function menProductAPI() {
  products.innerHTML = "";
  mainPageAPI("men");
  gtag("event", "Click", {
    event_category: "Main Page",
    event_label: "進入男裝",
  });
}

function accessoriesAPI() {
  products.innerHTML = "";
  mainPageAPI("accessories");
  gtag("event", "Click", {
    event_category: "Main Page",
    event_label: "進入配件",
  });
}

function redirection() {
  if (urlParams.match("key") !== null) {
    //encodeURIComponent : decodeURIComponent
    keyParams = decodeURIComponent(urlParams);
    key = keyParams.replace("?key=", "");
    searchAPI(key);
    return;
  }

  redirectionCatalog = urlParams.replace("?catalog=", "");

  if (redirectionCatalog === "women") {
    womenProductAPI();
  } else if (redirectionCatalog === "men") {
    menProductAPI();
  } else if (redirectionCatalog === "accessories") {
    accessoriesAPI();
  } else {
    mainPageAPI("all"); // 預設載入首頁，需以字串傳入
  }
}

// Week-1-part-2
// ========== Step 1: Get Marketing Campaigns ========== //
function campaigns() {
  let src = hostSrc + "marketing/campaigns";

  ~(async function () {
    await fetch(src, { method: "get" })
      .then(function (response) {
        return response.json();
      })
      .then(function (resJsonCampaigns) {
        // console.log(resJsonCampaigns);
        renderCampaigns(resJsonCampaigns);
      })
      .catch(function (e) {
        console.log(" campaigns API error");
      });
  })();
}

function renderCampaigns(resJsonCampaigns) {
  let bannerWrap = document.getElementById("banner");
  let srcProduct = "https://api.appworks-school.tw/product.html?id=";

  for (let i = 0; i < resJsonCampaigns.data.length; i++) {
    let bannerLink = document.createElement("a");
    bannerLink.className = "bannerLink" + i;
    bannerLink.id = "bannerLink" + i;
    let bannerImg = document.createElement("div");
    bannerImg.className = "bannerImg";
    let bannerStory = document.createElement("div");
    bannerStory.className = "bannerStory";

    let bannerIndexBox = document.createElement("div");
    bannerIndexBox.className = " bannerIndexBox";
    let bannerIndex0 = document.createElement("div");
    bannerIndex0.className = "bannerIndex0" + i;
    let bannerIndex1 = document.createElement("div");
    bannerIndex1.className = "bannerIndex1" + i;
    let bannerIndex2 = document.createElement("div");
    bannerIndex2.className = "bannerIndex2" + i;

    bannerLink.href = srcProduct + resJsonCampaigns.data[i].product_id;
    bannerLink.href = "product.html?id=" + resJsonCampaigns.data[i].product_id;
    bannerImg.innerHTML = "<img src=" + resJsonCampaigns.data[i].picture + ">";
    bannerStory.innerHTML = resJsonCampaigns.data[i].story;

    bannerStory.innerHTML = bannerStory.innerHTML.replace(/\n/g, "<br/>"); // 換行字元(\r\n)替換成html的換行標籤(<br/>

    bannerIndexBox.appendChild(bannerIndex0);
    bannerIndexBox.appendChild(bannerIndex1);
    bannerIndexBox.appendChild(bannerIndex2);

    bannerLink.appendChild(bannerStory);
    bannerLink.appendChild(bannerImg);
    bannerLink.appendChild(bannerIndexBox);
    bannerWrap.appendChild(bannerLink);
  }

  slideEffect();
  amountOfCart();
}

// ========== Step 2: Slide Effect ========== //
function slideEffect() {
  let banner0 = document.getElementById("bannerLink0");
  let banner1 = document.getElementById("bannerLink1");
  let banner2 = document.getElementById("bannerLink2");

  banner = [banner0, banner1, banner2];

  for (let i = 0; i < banner.length; i++) {
    // all display: none
    banner[i].style.display = "none";
  }

  initIndex++;

  if (initIndex === banner.length) {
    initIndex = 0;
  }

  banner[initIndex].style.display = "flex"; // control by initIndex
  banner[initIndex].classList.add("fadeTime");
}
setInterval(slideEffect, 5000); // setInterval: loop ;  setTimeout: once

// Week-2-part-1
// ========== Step 1: Shopping Cart Implementation  ========== //
let orderList = [];
if (localStorage.getItem("list") !== null) {
  orderList = JSON.parse(localStorage.getItem("list"));
} else {
  // console.log("cart is empty")  // if there is no [ data ] in localStorage, assign a empty [] !!!
  localStorage.setItem("list", JSON.stringify(orderList));
}

function amountOfCart() {
  let cartAmount = document.getElementById("cartAmount");
  let cartAmountMobile = document.getElementById("cartAmountMobile");

  cartAmount.innerHTML = orderList.length;
  cartAmountMobile.innerHTML = orderList.length;
}
