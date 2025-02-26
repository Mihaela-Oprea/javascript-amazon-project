import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import renderCheckoutHeader from "./checkoutHeader.js";

// Functia care renderizeaza rezumatul comenzii
export function renderOrderSummary() {
  let cartSummaryHTML = "";

  // Parcurgem fiecare produs din cosul de cumparaturi
  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    // Gasim produsul corespunzator din lista de produse
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    // Gasim optiunea de livrare corespunzatoare
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // Calculam data de livrare
    const dateString = calculateDeliveryDate(deliveryOption);

    // Adaugam detaliile produsului in HTML
    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${
            matchingProduct.id
          }">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${
                matchingProduct.id
              }">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link js-update-link js-update-link-${
              matchingProduct.id
            } link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${
              matchingProduct.id
            }" type="number">
            <span class="save-quantity-link js-save-link js-save-quantity-${
              matchingProduct.id
            } link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link js-delete-link js-delete-link-${
              matchingProduct.id
            }" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a shipping option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  // Functia care genereaza HTML-ul pentru optiunile de livrare
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option js-delivery-option-${
        matchingProduct.id
      }-${deliveryOption.id}" data-product-id="${
        matchingProduct.id
      }" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? "checked" : ""}
          class="delivery-option-input js-delivery-option-input-${
            matchingProduct.id
          }-${deliveryOption.id}"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `;
    });

    return html;
  }

  // Daca avem elemente in cos, le afisam. In caz contrar, afisam un mesaj ca cosul este gol
  if (cartSummaryHTML) {
    document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
  } else {
    document.querySelector(".js-order-summary").innerHTML = `
    <div class="empty-cart" data-testid="empty-cart-message">
      Your cart is empty.
    </div>
    <div>
      <a class="button-primary view-products-link" href="amazon.html">
        See products
      </a>
    </div>
    `;
  }

  // Functie pentru stergerea unui produs din cos la click
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  renderCheckoutHeader();

  // Functie pentru actualizarea cantitatii unui produs in cos
  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );

      const quantity = quantityLabel.innerHTML;

      container.classList.add("is-editing-quantity");

      quantityInput.value = quantity;
    });
  });

  // Functie pentru salvarea cantitatii actualizate in cos
  document.querySelectorAll(".js-save-link").forEach((link) => {
    const updateCart = () => {
      const { productId } = link.dataset;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );

      container.classList.remove("is-editing-quantity");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );

      const newQuantity = Number(quantityInput.value);

      // Verificam daca cantitatea introdusa este valida
      if (newQuantity < 0 || newQuantity >= 1000) {
        alert("Cantitatea trebuie sa fie intre 0 si 1000");
        return;
      } else if (!newQuantity) {
        removeFromCart(productId);

        renderOrderSummary();
        renderPaymentSummary();
        renderCheckoutHeader();
        return;
      }

      cart.updateQuantity(productId, newQuantity);

      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );

      quantityLabel.innerHTML = newQuantity;

      renderCheckoutHeader();

      renderOrderSummary();
      renderPaymentSummary();
    };
    link.addEventListener("click", updateCart);
    const { productId } = link.dataset;

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    quantityInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        updateCart();
      }
    });
  });

  // Functie pentru actualizarea optiunii de livrare aleasa
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    const { productId, deliveryOptionId } = element.dataset;
    element.addEventListener("click", () => {
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
