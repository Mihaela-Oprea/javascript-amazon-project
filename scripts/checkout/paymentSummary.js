import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

// Funcția care renderizează sumarul plății
export function renderPaymentSummary() {
  let productPriceCents = 0; // Prețul total al produselor
  let shippingPriceCents = 0; // Prețul total al livrării

  // Parcurge fiecare element din coș și calculează prețul produselor și livrării
  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId); // Obține produsul corespunzător
    productPriceCents += product.priceCents * cartItem.quantity; // Calcul preț total produse

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId); // Obține opțiunea de livrare
    shippingPriceCents += deliveryOption.priceCents; // Calcul preț total livrare
  });

  // Calculul totalului înainte de taxe și adăugarea taxei
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1; // Taxa de 10%
  const totalCents = totalBeforeTaxCents + taxCents; // Total final (cu taxă)

  let cartQuantity = 0; // Cantitatea totală de produse

  // Parcurge coșul pentru a calcula cantitatea totală de produse
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity; // Adună cantitatea fiecărui produs
  });

  // Crează HTML-ul pentru sumarul plății
  const paymentSummaryHTML = `
  <div class="payment-summary-title">
    Order Summary <!-- Titlul sumarului comenzii -->
  </div>

  <div class="payment-summary-row">
    <div>Items (${cartQuantity}):</div>
    <div class="payment-summary-money">$${formatCurrency(
      productPriceCents
    )}</div> <!-- Preț total produse -->
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money js-payment-summary-shipping">$${formatCurrency(
      shippingPriceCents
    )}</div> <!-- Preț livrare -->
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">$${formatCurrency(
      totalBeforeTaxCents
    )}</div> <!-- Total înainte de taxe -->
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">$${formatCurrency(
      taxCents
    )}</div> <!-- Taxă estimată -->
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money js-payment-summary-total">$${formatCurrency(
      totalCents
    )}</div> <!-- Total final -->
  </div>

  <div class="js-payment-buttons-container payment-buttons-disabled">
    <button class="place-order-button button-primary js-place-order">
      Place your order <!-- Butonul de plasare a comenzii -->
    </button>
  </div>
  `;

  // Afișează sumarul plății în pagina web
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  // Verifică dacă coșul este gol și ascunde sau arată butoanele de plasare a comenzii
  if (cart.cartItems.length === 0) {
    document
      .querySelector(".js-payment-buttons-container")
      .classList.add("false"); // Ascunde butoanele dacă coșul este gol
  } else {
    document
      .querySelector(".js-payment-buttons-container")
      .classList.remove("false"); // Arată butoanele dacă există produse în coș
  }

  // Adaugă event listener pe butonul de plasare a comenzii
  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      try {
        // Trimite comanda la backend pentru procesare
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart, // Trimite coșul cu toate produsele
          }),
        });
        const order = await response.json(); // Obține răspunsul de la server
        addOrder(order); // Adaugă comanda la lista de comenzi
      } catch (error) {
        console.log("Unexpected error. Try again later."); // Mesaj de eroare în caz de eșec
      }

      cart.resetCart(); // Resetează coșul
      cart.saveToStorage(); // Salvează coșul în stocare

      // După plasarea comenzii, redirecționează utilizatorul către pagina cu comenzi
      window.location.href = "orders.html";
    });
}
