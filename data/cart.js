import { deliveryOptionExist } from "./deliveryOptions.js";

// Clasa Cart care reprezintă coșul de cumpărături
export class Cart {
  cartItems; // Proprietate publică ce stochează articolele din coș
  #localStorageKey; // Cheia privată pentru localStorage
  addedMessageTimeouts = {}; // Obiect pentru gestionarea timeout-urilor mesajelor

  // Constructorul clasei
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey; // Setează cheia pentru localStorage
    this.#loadFromStorage(); // Încarcă datele din localStorage
  }

  // Metodă privată care încarcă datele din localStorage
  #loadFromStorage() {
    // Dacă nu există date în localStorage, se încarcă o valoare implicită
    this.cartItems = JSON.parse(
      localStorage.getItem(this.#localStorageKey)
    ) || [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: "2",
      },
    ];
  }

  // Metodă pentru a salva datele coșului în localStorage
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  // Metodă care arată un mesaj atunci când un produs este adăugat în coș
  addedToCart(productId) {
    const addedMessage = document.querySelector(
      `.js-added-to-cart-${productId}`
    );

    if (!addedMessage) {
      // Dacă nu găsește elementul, afișează un mesaj de avertizare
      console.warn(`No element found for product ID ${productId}`);
      return;
    }

    // Șterge orice timeout existent pentru acest produs
    if (this.addedMessageTimeouts[productId]) {
      clearTimeout(this.addedMessageTimeouts[productId]);
    }

    // Adaugă clasa pentru a arăta mesajul
    addedMessage.classList.add("js-added-to-cart");

    // Setează un timeout pentru a ascunde mesajul după 2 secunde
    this.addedMessageTimeouts[productId] = setTimeout(() => {
      addedMessage.classList.remove("js-added-to-cart");
      delete this.addedMessageTimeouts[productId]; // Curăță timeout-ul din dicționar
    }, 2000);
  }

  // Metodă pentru a adăuga un produs în coș
  addToCart(productId, quantity = 1, deliveryOptionId = "1") {
    const existingItem = this.cartItems.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      // Dacă produsul există deja în coș, se actualizează cantitatea
      existingItem.quantity += quantity;
    } else {
      // Dacă produsul nu există, se adaugă în coș
      this.cartItems.push({ productId, quantity, deliveryOptionId });
    }
    this.addedToCart(productId); // Afișează mesajul că produsul a fost adăugat

    this.saveToStorage(); // Salvează coșul actualizat în localStorage
  }

  // Metodă pentru a elimina un produs din coș
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        // Adaugă în coș doar produsele care nu trebuie eliminate
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart; // Actualizează coșul fără produsul eliminat

    this.saveToStorage(); // Salvează coșul actualizat în localStorage
  }

  // Metodă pentru a actualiza cantitatea unui produs în coș
  updateQuantity(productId, newQuantity) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        // Căutăm produsul care trebuie actualizat
        matchingItem = cartItem;
      }
    });

    matchingItem.quantity = newQuantity; // Actualizează cantitatea produsului

    this.saveToStorage(); // Salvează coșul actualizat în localStorage
  }

  // Metodă pentru a actualiza opțiunea de livrare a unui produs din coș
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        // Căutăm produsul care trebuie actualizat
        matchingItem = cartItem;
      }
    });

    if (!matchingItem) {
      // Dacă nu există produsul în coș, afișează un mesaj de eroare
      console.warn(`No product found in the cart for product ID ${productId}`);
      return;
    } else if (!deliveryOptionExist(deliveryOptionId)) {
      // Dacă opțiunea de livrare nu există, afișează un mesaj de eroare
      console.warn(
        `Delivery option does not exist for option ${deliveryOptionId}`
      );
      return;
    }

    matchingItem.deliveryOptionId = deliveryOptionId; // Actualizează opțiunea de livrare

    this.saveToStorage(); // Salvează coșul actualizat în localStorage
  }

  // Metodă pentru a reseta coșul (a elimina toate produsele)
  resetCart() {
    this.cartItems = []; // Golește coșul
    this.saveToStorage(); // Salvează coșul gol în localStorage
  }
}

// Exportă o instanță a clasei Cart cu cheia 'cart'
export const cart = new Cart("cart");

// Funcție asincronă pentru a încărca coșul dintr-un API extern
export async function loadCartFetch() {
  const response = await fetch("https://supersimplebackend.dev/cart");
  const text = await response.text(); // Obține textul din răspunsul API-ului
  console.log(text); // Afișează răspunsul în consolă
  return text; // Returnează răspunsul
}
