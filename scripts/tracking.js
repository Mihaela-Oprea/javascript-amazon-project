import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import renderCartQuantity from "./amazon/cartQuantity.js";
import productSearch from "./amazon/productSearch.js";

// Funcția principală care încarcă datele necesare pentru a afișa pagina de urmărire a comenzii
async function loadPage() {
  // Încarcă produsele înainte de a renderiza pagina de urmărire
  await loadProductsFetch();

  // Actualizează cantitatea din coș
  renderCartQuantity();

  // Obține URL-ul curent și extrage parametrii orderId și productId
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  // Obține detaliile comenzii și produsului
  const order = getOrder(orderId);
  const product = getProduct(productId);

  // Căutăm detaliile produsului din comandă (ex: data estimată de livrare)
  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details; // Înregistrează detaliile produsului specific
    }
  });

  // Obține data curentă și datele comenzii pentru a calcula progresul livrării
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress =
    ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  // Determină mesajul de livrare (în funcție de dacă produsul a fost livrat sau nu)
  const deliveredMessage =
    today < deliveryTime ? "Arriving on" : "Delivered on";

  // Creează HTML-ul pentru pagina de urmărire a comenzii
  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
      ${deliveredMessage} ${dayjs(productDetails.estimatedDeliveryTime).format(
    "dddd, MMMM D"
  )}
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
      <div class="progress-label ${
        percentProgress < 50 ? "current-status" : ""
      }">
        Preparing
      </div>
      <div class="progress-label ${
        percentProgress >= 50 && percentProgress < 100 ? "current-status" : ""
      }">
        Shipped
      </div>
      <div class="progress-label ${
        percentProgress >= 100 ? "current-status" : ""
      }">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  // Afișează HTML-ul pe pagina de urmărire
  document.querySelector(".js-order-tracking").innerHTML = trackingHTML;

  // Apelează funcția de căutare a produselor
  productSearch();
}

// Apelează funcția loadPage pentru a încărca și a renderiza pagina
loadPage();
