import { cart, Cart } from "../../data/cart.js";

// Descrierea suitei de teste pentru funcția addToCart
describe("test suite: addToCart", () => {
  beforeEach(() => {
    // Interceptează metodele localStorage înainte de instanțierea clasei Cart
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([]); // Inițializare coș gol
    });

    // Creează o instanță a clasei Cart pentru a asigura încărcarea din stocare
    const testCart = new Cart("cart");

    // Înlocuiește coșul existent cu instanța de test
    Object.assign(cart, testCart);
  });

  it("adaugă un produs existent în coș", () => {
    // Setează un produs existent în localStorage
    localStorage.getItem.and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
      ]);
    });

    // Reinițializează coșul pentru a prelua valoarea mockată
    const testCart = new Cart("cart");
    Object.assign(cart, testCart);

    // Adaugă produsul existent în coș
    cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(3); // Cantitatea a fost actualizată
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 3,
          deliveryOptionId: "1",
        },
      ])
    );
  });

  it("adaugă un produs nou în coș", () => {
    // Setează coșul gol în localStorage
    localStorage.getItem.and.callFake(() => {
      return JSON.stringify([]);
    });

    // Reinițializează coșul pentru a prelua valoarea mockată
    const testCart = new Cart("cart");
    Object.assign(cart, testCart);

    // Adaugă un produs nou în coș
    cart.addToCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(cart.cartItems[0].quantity).toEqual(1); // Cantitatea este 1 pentru produsul nou
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      '[{"productId":"e43638ce-6aa0-4b85-b27f-e1d07eb678c6","quantity":1,"deliveryOptionId":"1"}]'
    );
  });
});

// Descrierea suitei de teste pentru funcția removeFromCart
describe("test suite: removeFromCart", () => {
  beforeEach(() => {
    // Interceptează metodele localStorage înainte de instanțierea clasei Cart
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });

    // Creează o instanță a clasei Cart pentru a asigura încărcarea din stocare
    const testCart = new Cart("cart");
    Object.assign(cart, testCart);
  });

  it("șterge un produs din coș", () => {
    // Șterge un produs existent din coș
    cart.removeFromCart("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(cart.cartItems.length).toEqual(0); // Coșul trebuie să fie gol
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([])
    );
  });

  it("nu face nimic dacă produsul nu este în coș", () => {
    // Încearcă să ștergi un produs care nu există în coș
    cart.removeFromCart("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
    expect(cart.cartItems.length).toEqual(1); // Coșul rămâne neschimbat
    expect(cart.cartItems[0].productId).toEqual(
      "e43638ce-6aa0-4b85-b27f-e1d07eb678c6"
    );
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ])
    );
  });
});

// Descrierea suitei de teste pentru funcția updateDeliveryOption
describe("test suite: updateDeliveryOption", () => {
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";

  beforeEach(() => {
    // Interceptează metodele localStorage înainte de instanțierea clasei Cart
    spyOn(localStorage, "setItem");
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });

    // Creează o instanță a clasei Cart pentru a asigura încărcarea din stocare
    const testCart = new Cart("cart");
    Object.assign(cart, testCart);
  });

  it("actualizează opțiunea de livrare a unui produs", () => {
    // Actualizează opțiunea de livrare
    cart.updateDeliveryOption(productId1, "3");
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("3"); // Noua opțiune de livrare

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "cart",
      JSON.stringify([
        {
          productId: productId1,
          quantity: 1,
          deliveryOptionId: "3",
        },
      ])
    );
  });

  it("returnează un avertisment dacă opțiunea de livrare nu există", () => {
    // Încearcă să actualizezi cu o opțiune de livrare invalidă
    cart.updateDeliveryOption(productId1, "does-not-exist");
    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productId1);
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual("1"); // Rămâne opțiunea inițială
    expect(localStorage.setItem).toHaveBeenCalledTimes(0); // Nu se salvează nicio modificare
  });
});
