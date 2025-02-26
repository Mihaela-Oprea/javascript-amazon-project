import { getProduct, loadProductsFetch } from "../data/products.js";
import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import formatCurrency from "./utils/money.js";
import { cart } from "../data/cart.js";
import renderCartQuantity from "./amazon/cartQuantity.js";
import productSearch from "./amazon/productSearch.js";

// Funcția principală care încarcă datele necesare pentru a afisa comenzile
async function loadPage() {
  // Încarcă produsele înainte de a renderiza comenzile
  await loadProductsFetch();

  let ordersHTML = "";

  renderCartQuantity(); // Actualizează cantitatea din coș

  // Parcurge toate comenzile pentru a crea HTML-ul necesar
  orders.forEach((order) => {
    // Formatează data comenzii utilizând dayjs
    const orderTimeString = dayjs(order.orderTime).format("MMMM D");

    // Adaugă HTML-ul pentru fiecare comandă
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsListHTML(order)} <!-- Detaliile produselor din comandă -->
        </div>
      </div>
    `;
  });

  // Funcția care generează lista de produse dintr-o comandă
  function productsListHTML(order) {
    let productsListHTML = "";

    // Parcurge produsele din comandă
    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      // Adaugă detaliile fiecărui produs
      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format(
              "MMMM D"
            )}
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${
            product.id
          }" data-order-id="${order.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
            <span class="buy-again-success">✓ Added</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }

  // Adaugă HTML-ul pentru toate comenzile la pagina principală
  document.querySelector(".js-orders-grid").innerHTML = ordersHTML;

  const addedMessageTimeouts = {}; // Obiect pentru a gestiona timeout-urile mesaje de succes

  // Adaugă eveniment pentru butoanele "Buy it again"
  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.dataset.orderId;
      const productId = button.dataset.productId;
      const prevMessageTimeouts = addedMessageTimeouts[orderId];

      // Șterge orice timeout existent pentru acest produs
      if (prevMessageTimeouts && prevMessageTimeouts[productId]) {
        clearTimeout(prevMessageTimeouts[productId]);
      }

      // Adaugă clasa pentru a arăta mesajul de succes
      button.classList.add("is-buying-again");

      // Setează un nou timeout pentru a șterge clasa după 2 secunde
      addedMessageTimeouts[orderId] = {
        [productId]: setTimeout(() => {
          button.classList.remove("is-buying-again");
          delete addedMessageTimeouts[orderId][productId];
        }, 2000),
      };

      // Adaugă produsul în coș și actualizează cantitatea din coș
      cart.addToCart(productId);
      renderCartQuantity();
    });
  });

  productSearch(); // Căutarea produselor
}

// Apelează funcția loadPage pentru a încărca datele și a actualiza pagina
loadPage();
