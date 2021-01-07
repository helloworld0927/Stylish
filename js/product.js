let hostSrc = "https://api.appworks-school.tw/api/1.0/";
let currentColor = "";
let currentColorName = "";
let currentSize = "";
let currentStock = "";
let currentQty = 1;
let currentID = "";
let currentName = "";
let currentPrice = "";
let sameColorSizes = [];
let sameColorSizesOfStock = [];

// Week-1-part-4
// ========== Step 1: Take Parameter from Page URL (Query String) ========== //
// let id = urlParams.get("id")
// productPageAPI(id)
let urlParams = window.location.search;
let id = urlParams.replace("?id=", "");
productPageAPI(id);

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

// ========== Step 2+3: Connect to Product Details API and  Render Product Page ========== //
function productPageAPI(id) {
  let ProductSrc = hostSrc + "products/details?id=" + id;

  fetch(ProductSrc, { method: "get" })
    .then(function (response) {
      return response.json();
    })
    .then(function (resJson) {
      // console.log(resJson)

      let data = resJson.data;

      currentColor = data.colors[0].code; // default currentColor

      if (data.variants[0].stock === 0) {
        // default currentSize
        currentSize = data.sizes[1];
        currentStock = data.variants[1].stock; // default currentStock
      } else {
        currentSize = data.sizes[0];
        currentStock = data.variants[0].stock;
      }

      currentName = data.title;
      currentID = data.id;
      currentPrice = data.price;
      currentColorName = data.colors[0].name;

      initProductDetail(resJson);
    })
    .catch(function (e) {
      console.log("Product Page API error");

      let products = document.getElementById("products"); // when user enter wrong id in url
      products.style.justifyContent = "center";
      products.innerHTML = " 搜尋結果 : 無相符商品 ";
    });
}

function initProductDetail(resJson) {
  let data = resJson.data;

  for (let i = 0; i < data.variants.length; i++) {
    // update currentProductDetail

    if (data.variants[i].color_code === currentColor) {
      sameColorSizes.push(data.variants[i].size);
      sameColorSizesOfStock.push(data.variants[i].stock);
    }
  }
  renderProductPage(resJson);
}

function renderProductPage(resJson) {
  for (i = 0; i < sameColorSizes.length; i++) {
    if (sameColorSizesOfStock[i] !== 0) {
      currentStock = sameColorSizesOfStock[i];
      currentSize = sameColorSizes[i];

      break;
    }
  }

  let data = resJson.data;

  let products = document.getElementById("products");
  products.innerHTML = "";

  let productImg = document.createElement("div");
  productImg.className = "product--main--image";

  let productContent = document.createElement("div");
  productContent.className = "product--details";
  let itemName = document.createElement("div");
  itemName.className = "product--name";
  itemName.setAttribute("value", `${data.title}`);

  let productID = document.createElement("div");
  productID.className = "product--id";
  let productPrice = document.createElement("div");
  productPrice.className = "product--price";

  let productColor = document.createElement("div");
  productColor.className = "product--colors";
  let colorStr = document.createElement("div");
  colorStr.className = "colors__str";
  let colorMenu = document.createElement("div");
  colorMenu.className = "colors__menu";

  for (let i = 0; i < data.colors.length; i++) {
    let colorEach = document.createElement("div");
    let colorEachBox = document.createElement("div");
    colorEach.className = "colorEach";
    colorEachBox.className = "colors__box";
    colorMenu.appendChild(colorEachBox);
    colorEachBox.appendChild(colorEach);
    colorEach.style.backgroundColor = "#" + data.colors[i].code;
    colorEachBox.name = data.colors[i].code;
    colorEachBox.title = data.colors[i].name;

    if (`${data.colors[i].code}` === currentColor) {
      colorEachBox.className += " active";
    }
  }

  let productSize = document.createElement("div");
  productSize.className = "product--sizes";
  let sizeStr = document.createElement("div");
  sizeStr.className = "sizes__str";
  let sizeMenu = document.createElement("div");
  sizeMenu.className = "sizes__menu";
  sizeMenu.setAttribute("id", "sizes__menu");

  for (let i = 0; i < sameColorSizes.length; i++) {
    let sizeEach = document.createElement("div");
    sizeEach.className = "sizes__each";
    sizeMenu.appendChild(sizeEach);
    sizeEach.innerHTML = `${data.sizes[i]}`;
    sizeEach.setAttribute("name", `${data.sizes[i]}`);
    if (sameColorSizesOfStock[i] === 0) {
      sizeEach.style.opacity = 0.3;
    }

    if (`${data.sizes[i]}` === currentSize) {
      sizeEach.className += " active-Size";
    }
  }

  let productQuantity = document.createElement("div");
  productQuantity.className = "product--quantity";
  let QuantityMenu = document.createElement("div");
  QuantityMenu.className = "quantity__menu";
  let QuantityStr = document.createElement("div");
  QuantityStr.className = "quantity__str";
  let quanSub = document.createElement("button");
  quanSub.className = "quanSub";
  let quan = document.createElement("div");
  quan.className = "quan";

  let quanPlus = document.createElement("button");
  quanPlus.className = "quanPlus";

  let sizeBtn = document.createElement("button");
  sizeBtn.className = "sizeBtn";

  let descriptionWrap = document.createElement("div");
  descriptionWrap.className = "descriptionWrap";
  let descriptionTop = document.createElement("div");
  let descriptionMiddle = document.createElement("div");
  let descriptionBottom = document.createElement("div");

  let productSeparator = document.createElement("div");
  productSeparator.className = "product--separator";
  let productTitle = document.createElement("div");
  productTitle.className = "product--title";
  let productLine = document.createElement("div");
  productLine.className = "product--line";

  let productDetailWrap = document.createElement("div");
  productDetailWrap.className = "product--info";
  let productStory = document.createElement("div");
  productStory.className = "product--story";
  let productImages = document.createElement("div");
  productImages.className = "product--image";

  // < products >
  products.appendChild(productImg);
  products.appendChild(productContent);
  products.appendChild(productSeparator);
  products.appendChild(productDetailWrap);
  productImg.innerHTML = `<img src=${data.main_image} />`;

  // < productContent >
  productContent.appendChild(itemName);
  productContent.appendChild(productID);
  productContent.appendChild(productPrice);
  productContent.appendChild(productColor);
  productContent.appendChild(productSize);
  productContent.appendChild(productQuantity);
  productContent.appendChild(sizeBtn);
  productContent.appendChild(descriptionWrap);

  itemName.innerHTML = data.title;
  currentName = data.title;
  productID.innerHTML = data.id;
  currentID = data.id;
  productPrice.innerHTML = `TWD. ${data.price}`;
  currentPrice = data.price;
  sizeBtn.innerHTML = "加入購物車";
  sizeBtn.setAttribute("onclick", "addToCart()");

  // < productsSize >
  productSize.appendChild(sizeStr);
  productSize.appendChild(sizeMenu);

  sizeStr.innerHTML = "尺寸";

  // <productQuantity >
  productQuantity.appendChild(QuantityStr);
  productQuantity.appendChild(QuantityMenu);
  QuantityMenu.appendChild(quanSub);
  QuantityMenu.appendChild(quan);
  QuantityMenu.appendChild(quanPlus);

  quanSub.innerHTML = "-";
  quanPlus.innerHTML = "+";
  QuantityStr.innerHTML = "數量";

  // <  productColor >
  productColor.appendChild(colorStr);
  productColor.appendChild(colorMenu);

  colorStr.innerHTML = "顏色";

  // < descriptionWrap >
  descriptionWrap.appendChild(descriptionTop);
  descriptionWrap.appendChild(descriptionMiddle);
  descriptionWrap.appendChild(descriptionBottom);

  descriptionTop.innerHTML = `*${data.note}<br/><br/>${data.texture}<br/>`;
  descriptionMiddle.innerHTML = data.description;
  descriptionMiddle.innerHTML = descriptionMiddle.innerHTML.replace(
    /\n/g,
    "<br>"
  );
  descriptionBottom.innerHTML = `<br/>清洗 : ${data.wash}</br>產地 : ${data.place}`;

  // < descriptionDetail >
  productSeparator.appendChild(productTitle);
  productSeparator.appendChild(productLine);

  // productDetailWrap.appendChild(productSeparator)
  productDetailWrap.appendChild(productStory);
  productDetailWrap.appendChild(productImages);

  productTitle.innerHTML = "<strong>更多產品資訊</strong>";
  productStory.innerHTML = data.story;

  for (let i = 2; i < data.images.length; i++) {
    productImages.innerHTML += `<img src=${data.images[i]} />`;
  }

  let cartAmount = document.getElementById("cartAmount");
  let cartAmountMobile = document.getElementById("cartAmountMobile");

  cartAmount.innerHTML = orderList.length;
  cartAmountMobile.innerHTML = orderList.length;
  // quan.innerHTML = 1
  currentColorClick(resJson);
  currentSizeClick(resJson);
}

// Week-1-part-5
// ========== Step 2: Handle Stock of Product Variants (stock record) ========== //
// 1. Get the container element
// 2. Get all <div> with class="colorEachBox" inside the container
// 3. Loop through the <div> and add the active class to the current/clicked <div>
// 4.control current item === 1
function currentColorClick(resJson) {
  let colorMenu = document.querySelector(".colors__menu");
  let colorEachBox = colorMenu.getElementsByClassName("colors__box");

  for (let i = 0; i < colorEachBox.length; i++) {
    colorEachBox[i].addEventListener("click", function () {
      let current = document.getElementsByClassName(" active");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
      }

      this.className += " active";
      currentColor = this.name;
      currentColorName = this.title;

      sameColorSizes = [];
      sameColorSizesOfStock = [];

      for (let i = 0; i < resJson.data.variants.length; i++) {
        // update currentProductDetail
        if (resJson.data.variants[i].color_code === currentColor) {
          sameColorSizes.push(resJson.data.variants[i].size);
          sameColorSizesOfStock.push(resJson.data.variants[i].stock);
        }
      }

      console.log(sameColorSizesOfStock);
      renderProductPage(resJson);
    });
  }
}

function currentSizeClick(resJson) {
  let sizeMenu = document.querySelector(".sizes__menu");
  let sizeEach = sizeMenu.getElementsByClassName("sizes__each");
  quantity();

  for (let j = 0; j < sameColorSizes.length; j++) {
    sizeEach[j].addEventListener("click", function () {
      console.log("size selected");
      quantity();

      let current = document.getElementsByClassName(" active-Size");
      if (current.length > 0) {
        current[0].className = current[0].className.replace(" active-Size", "");
      }

      this.className += " active-Size";

      if (sizeEach[j].name !== currentSize) {
        // sizeEach[j].name:chose
        currentSize = sameColorSizes[j];
        currentStock = sameColorSizesOfStock[j];
      }

      let quan = document.querySelector(".quan");
      if (currentStock === 0) {
        // currentStock === 0, order number = 0 immediately
        currentQty = 0;
        quan.innerHTML = 0;
      } else {
        currentQty = 1;
        quan.innerHTML = 1; // initialize order number when user switch different size
      }
      quan = 0;
    });
    // quantity()
  }
}

function quantity() {
  //  quantity
  let quan = document.querySelector(".quan");
  let quanSub = document.querySelector(".quanSub");
  let quanPlus = document.querySelector(".quanPlus");
  let orderNumber = 1;

  quan.innerHTML = orderNumber;
  quanSub.addEventListener("click", () => {
    orderNumber -= 1;

    if (orderNumber < 1) {
      orderNumber = 1;
    }
    if (currentStock == 0) {
      orderNumber = 0;
    }

    quan.innerHTML = orderNumber;
    currentQty = orderNumber;
  });

  quanPlus.addEventListener("click", () => {
    orderNumber += 1;
    // console.log(currentQty)

    if (orderNumber > currentStock) {
      orderNumber = currentStock;
    }

    quan.innerHTML = orderNumber;
    currentQty = orderNumber;
  });
}
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
  console.log("Cart update");
}

// ========== Step 2: Step 2: Add to Cart Implementation  ========== //
function addToCart() {
  let list = {
    id: currentID,
    name: currentName,
    price: currentPrice,
    color: {
      code: currentColor,
      name: currentColorName,
    },
    size: currentSize,
    qty: currentQty,
  };

  if (currentStock !== 0) {
    if (orderList.length === 0) {
      orderList.push(list);
      localStorage.setItem("list", JSON.stringify(orderList));
      alert("已加入購物車");
      // console.log(orderList)
    } else {
      checkDuplicateOrder();
    }
  } else {
    alert("庫存不足");
  }
  amountOfCart();
}

function checkDuplicateOrder() {
  console.log("Start--檢查重複訂單");
  let checkStock;
  let isDuplicated = false;
  let list = {
    id: currentID,
    name: currentName,
    price: currentPrice,
    color: {
      code: currentColor,
      name: currentColorName,
    },
    size: currentSize,
    qty: currentQty,
  };

  for (i = 0; i < orderList.length; i++) {
    // check Duplicate

    if (
      orderList[i].id === currentID &&
      orderList[i].size === currentSize &&
      orderList[i].color.code === currentColor
    ) {
      checkStock = orderList[i].qty + currentQty;
      isDuplicated = true;

      if (checkStock > currentStock) {
        alert("庫存不足");
      } else {
        orderList[i].qty += currentQty;
        localStorage.setItem("list", JSON.stringify(orderList));
        alert("已新增數量");
        break;
      }
    }
  }

  if (isDuplicated === false) {
    orderList.push(list);
    localStorage.setItem("list", JSON.stringify(orderList));
    alert("已加入購物車");
  }

  isDuplicated === false;
  console.log("End--檢查重複訂單");

  amountOfCart();
}
