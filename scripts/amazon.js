import { cart } from "../data/cart.js";
import { products, loadProductsFetch, getProduct } from "../data/products.js";
import renderCartQuantity from "./amazon/cartQuantity.js";
import productSearch from "./amazon/productSearch.js";

// Funcția principală pentru a reda produsele în grid-ul de produse
async function renderProductsGrid() {
  let productsHTML = "";

  // Încărcăm produsele din backend folosind fetch
  await loadProductsFetch();

  // Actualizăm cantitatea de produse din coș
  renderCartQuantity();

  // Obținem parametrii din URL pentru a verifica dacă există un search
  const url = new URL(window.location.href);
  const search = url.searchParams.get("search");

  let filteredProducts = products;

  // Dacă există un search în URL, filtrăm produsele pentru a se potrivi cu căutarea
  if (search) {
    filteredProducts = products.filter((product) => {
      const name = product.name.toLowerCase();
      // Verificăm dacă numele produsului conține textul căutat
      return name.includes(search.toLocaleLowerCase());
    });
  }

  // Pentru fiecare produs filtrat, adăugăm HTML-ul corespunzător în grid
  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container" data-product-id="${product.id}">
        <div class="product-image-container">
          <img class="js-product-image product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}" data-product-name="${product.name}">
          Add to Cart
        </button>
      </div>
    `;
  });

  // Dacă nu s-au găsit produse, afișăm un mesaj de eroare
  if (filteredProducts === undefined || filteredProducts.length == 0) {
    document.querySelector(".js-products-grid").innerHTML =
      '<div class="empty-results-message"> No products matched your search. </div>';

    // Lansează căutarea produselor (pentru a reîncărca funcționalitatea de căutare)
    return productSearch();
  }

  // Alocăm HTML-ul pentru produse în grid-ul din pagină
  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  // Adăugăm evenimentul de click pe butoanele "Add to Cart" pentru fiecare produs
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const selectorValue = Number(quantitySelector.value);

      // Adăugăm produsul în coș cu cantitatea aleasă
      cart.addToCart(productId, selectorValue);
      // Actualizăm cantitatea produselor din coș
      renderCartQuantity();
    });
  });

  // Funcția pentru a dezactiva butonul selectat anterior (pentru opțiuni de variatii de produs)
  function turnOffPreviousButton() {
    const previousButton = document.querySelector(".is-selected");
    previousButton && previousButton.classList.remove("is-selected");
  }

  // Lansează funcția de căutare a produselor
  productSearch();
}

// Apelăm funcția pentru a reda produsele în grid-ul paginii
renderProductsGrid();
