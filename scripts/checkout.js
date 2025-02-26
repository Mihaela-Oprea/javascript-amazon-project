import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import "../data/cart.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCartFetch } from "../data/cart.js";

// Funcția loadPage se ocupă cu încărcarea produselor și a coșului de cumpărături
async function loadPage() {
  try {
    // Așteaptă încărcarea simultană a produselor și a coșului
    await Promise.all([loadProductsFetch(), loadCartFetch()]);
  } catch (error) {
    // În caz de eroare, afișează un mesaj în consolă
    console.log(error);
    console.log("Unexpected error. Please try again later.");
  }

  // După ce produsele și coșul au fost încărcate, renderizează rezumatul comenzii și rezumatul plății
  renderOrderSummary();
  renderPaymentSummary();
}

// Apelează funcția loadPage pentru a încărca datele și a actualiza pagina
loadPage();
