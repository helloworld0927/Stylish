let orderList = []; // for localStorage
let urlParams = window.location.search;
let orderNumber = urlParams.replace("?orderNumber=", "");

getStorageData();
showOrderNumber(orderNumber);

function getStorageData() {
  if (localStorage.getItem("list") !== null) {
    orderList = JSON.parse(localStorage.getItem("list"));
    amountOfCart();
  } else {
    localStorage.setItem("list", JSON.stringify(orderList));
    amountOfCart();
  }
}

function showOrderNumber(orderNumber) {
  document.getElementById(
    "bookingNumber"
  ).innerHTML = `訂單號碼&nbsp&nbsp:&nbsp&nbsp${orderNumber}`;
}

function amountOfCart() {
  let cartAmount = document.getElementById("cartAmount");
  let cartAmountMobile = document.getElementById("cartAmountMobile");

  cartAmount.innerHTML = orderList.length;
  cartAmountMobile.innerHTML = orderList.length;
}

// ========== Search ========== //
window.onload = enterSumit;

function enterSumit() {
  let keywordElementW = document.getElementById("searchValueW");
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
  let key = encodeURIComponent(keywordElement.value);

  if (key.trim().length === 0) {
    alert("親，請輸入有效字元");
  } else {
    window.location = "index.html?key=" + key;
  }
}

function searchProductWeb() {
  let keywordElement = document.getElementById("searchValueW");
  let key = keywordElement.value;

  if (key.trim().length === 0) {
    alert("親，請輸入有效字元");
  } else {
    window.location = "index.html?key=" + key;
  }
}
