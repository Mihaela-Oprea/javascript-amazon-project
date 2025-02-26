import { cart } from "../../data/cart.js";

// Funcția care calculează și afișează cantitatea totală de produse din coș
function renderCartQuantity() {
  let cartQuantity = 0; // Inițializarea cantității totale
  let cartQuantityHTML = ""; // Inițializarea variabilei care va conține cantitatea în format HTML

  // Parcurge toate elementele din coș și adună cantitatea fiecărui produs
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity; // Adună cantitatea produsului la total
  });

  // Adaugă cantitatea totală în variabila HTML
  cartQuantityHTML += `${cartQuantity}`;

  // Afișează cantitatea totală de produse în elementul HTML cu clasa 'js-cart-quantity'
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantityHTML;
}

// Exportă funcția pentru a putea fi folosită în alte părți ale aplicației
export default renderCartQuantity;
