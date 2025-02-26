import { cart } from "../../data/cart.js";

function renderCheckoutHeader() {
  let cartQuantity = 0; // Inițializăm numărul de produse din coș
  let checkoutHeaderHTML = ""; // Inițializăm variabila care va conține HTML-ul pentru antetul checkout

  // Iterăm prin produsele din coș și adunăm cantitatea fiecărui produs
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // Construim HTML-ul care va fi adăugat în antetul checkout
  checkoutHeaderHTML += `
    Checkout (<a class="return-to-home-link"
    href="amazon.html">${cartQuantity} items</a>)
  `;

  // Inserăm HTML-ul generat în secțiunea din mijloc a antetului
  document.querySelector(".js-checkout-header-middle-section").innerHTML =
    checkoutHeaderHTML;
}

export default renderCheckoutHeader;
