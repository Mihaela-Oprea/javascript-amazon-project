import formatCurrency from "../scripts/utils/money.js";

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  if (!matchingProduct) {
    console.warn("This product does not exist");
    return;
  }

  return matchingProduct;
}

export class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return "";
  }
}

//inheritance
export class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails); //calls the constructor of the parent class
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    // Verifică dacă există link-ul pentru size chart
    if (this.sizeChartLink) {
      return `
      <a href="${this.sizeChartLink}" class=" size-chart-link" target="_blank">
        Size chart
      </a>
    `;
    } else {
      return ""; // Dacă nu există size chart, nu returnează nimic
    }
  }
}

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.instructionsLink}" target="_blank">
        Instructions
      </a>
      <a href="${this.warrantyLink}" target="_blank">
        Warranty
      </a>
    `;
  }
}

export let products = [];

export function loadProductsFetch() {
  //fetch uses promise and returns a promise
  const promise = fetch("https://supersimplebackend.dev/products")
    .then((response) => {
      return response.json();
    })
    .then((producstData) => {
      products = producstData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        } else if (productDetails.type === "appliance") {
          return new Appliance(productDetails);
        }
        return new Product(productDetails);
      });
      console.log("load products");
    })
    .catch((error) => {
      //catching errors
      console.log(error);
      console.log("unexpected error. Please try again later.");
    });
  return promise;
}
