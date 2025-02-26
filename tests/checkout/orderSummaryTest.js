import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";
import { cart, Cart } from "../../data/cart.js";
import { loadProductsFetch } from "../../data/products.js";

// Descrierea suitei de teste pentru funcția renderOrderSummary
describe("test suite: renderOrderSummary", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  // Înainte de toate testele, încarcă produsele dintr-o sursă externă
  beforeAll(async () => {
    await loadProductsFetch();
  });

  beforeEach(() => {
    // Interceptează metodele localStorage înainte de instanțierea clasei
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: "2",
        },
      ]);
    });

    // Inițializează containerul DOM
    document.querySelector(".js-test-container").innerHTML = `
    <div class="js-order-summary"></div>
    <div class="js-checkout-header-middle-section"></div>
    <div class="js-payment-summary"></div>
  `;

    // Creează o instanță a clasei Cart pentru a asigura încărcarea din stocare
    const testCart = new Cart("cart");

    // Înlocuiește cart-ul existent cu instanța de test
    Object.assign(cart, testCart);

    // Randează sumarul comenzii
    renderOrderSummary();
  });

  afterEach(() => {
    // Curăță containerul DOM după fiecare test
    document.querySelector(".js-test-container").innerHTML = "";
  });

  // Testează dacă coșul este afișat corect
  it("afișează coșul", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2
    );
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain("Quantity: 2");
    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText
    ).toContain("Quantity: 1");
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText
    ).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual("Intermediate Size Basketball");
    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText
    ).toContain("$");
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toContain("$");
  });

  // Testează eliminarea unui produs din coș
  it("șterge un produs", () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      1
    );
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId2);
  });

  // Testează actualizarea opțiunii de livrare
  it("actualizează opțiunea de livrare", () => {
    document.querySelector(`.js-delivery-option-${productId1}-3`).click();

    expect(
      document.querySelector(`.js-delivery-option-input-${productId1}-3`)
        .checked
    ).toEqual(true);

    expect(cart.cartItems.length).toEqual(2);
    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("3");

    expect(
      document.querySelector(".js-payment-summary-shipping").innerText
    ).toEqual("$14.98");
    expect(
      document.querySelector(".js-payment-summary-total").innerText
    ).toEqual("$63.50");
  });
});
