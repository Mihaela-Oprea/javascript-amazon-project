import { Product, Clothing, Appliance } from "../../data/products.js";

// Descrierea suitei de teste pentru clasa Product
describe("test suite: Product", () => {
  let product;

  // Se execută înainte de fiecare test, inițializând obiectul product
  beforeEach(() => {
    product = new Product({
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87,
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"],
    });
  });

  // Testează dacă produsul are proprietățile corecte
  it("are proprietățile corecte", () => {
    expect(product.id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
    expect(product.image).toEqual(
      "images/products/athletic-cotton-socks-6-pairs.jpg"
    );
    expect(product.name).toEqual(
      "Black and Gray Athletic Cotton Socks - 6 Pairs"
    );
    expect(product.rating).toEqual({
      stars: 4.5,
      count: 87,
    });
    expect(product.priceCents).toEqual(1090);
  });

  // Testează obținerea URL-ului pentru stele
  it("obține URL-ul pentru stele", () => {
    expect(product.getStarsUrl()).toEqual("images/ratings/rating-45.png");
  });

  // Testează obținerea prețului produsului
  it("obține prețul", () => {
    expect(product.getPrice()).toEqual("$10.90");
  });

  // Testează dacă nu sunt afișate informații suplimentare
  it("nu afișează informații suplimentare", () => {
    expect(product.extraInfoHTML()).toEqual("");
  });
});

// Descrierea suitei de teste pentru clasa Clothing
describe("test suite: Clothing", () => {
  let clothing;

  // Se execută înainte de fiecare test, inițializând obiectul clothing
  beforeEach(() => {
    clothing = new Clothing({
      id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
      name: "Adults Plain Cotton T-Shirt - 2 Pack",
      rating: {
        stars: 4.5,
        count: 56,
      },
      priceCents: 799,
      keywords: ["tshirts", "apparel", "mens"],
      type: "clothing",
      sizeChartLink: "images/clothing-size-chart.png",
    });
  });

  // Testează dacă obiectul clothing are proprietățile corecte
  it("are proprietățile corecte", () => {
    // Verifică dacă moștenirea a funcționat corect
    expect(clothing.id).toEqual("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
    expect(clothing.image).toEqual(
      "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg"
    );
    expect(clothing.sizeChartLink).toEqual("images/clothing-size-chart.png");
  });

  // Testează obținerea URL-ului pentru stele
  it("obține URL-ul pentru stele", () => {
    expect(clothing.getStarsUrl()).toEqual("images/ratings/rating-45.png");
  });

  // Testează obținerea prețului
  it("obține prețul", () => {
    expect(clothing.getPrice()).toEqual("$7.99");
  });

  // Testează dacă link-ul pentru tabelul de mărimi apare în extraInfoHTML
  it("afișează link-ul pentru tabelul de mărimi în extraInfoHTML", () => {
    // Este dificil de comparat exact un șir de caractere pe mai multe linii, așa că vom
    // verifica doar dacă rezultatul conține anumite șiruri.
    expect(clothing.extraInfoHTML()).toContain(
      `<a href="images/clothing-size-chart.png" target="_blank">`
    );

    // Verifică dacă textul link-ului este corect
    expect(clothing.extraInfoHTML()).toContain("Size chart");
  });
});

// Descrierea suitei de teste pentru clasa Appliance
describe("test suite: Appliance", () => {
  let appliance;

  // Se execută înainte de fiecare test, inițializând obiectul appliance
  beforeEach(() => {
    appliance = new Appliance({
      id: "54e0eccd-8f36-462b-b68a-8182611d9add",
      image: "images/products/black-2-slot-toaster.jpg",
      name: "2 Slot Toaster - Black",
      rating: {
        stars: 5,
        count: 2197,
      },
      priceCents: 1899,
      keywords: ["toaster", "kitchen", "appliances"],
      type: "appliance",
      instructionsLink: "images/appliance-instructions.png",
      warrantyLink: "images/appliance-warranty.png",
    });
  });

  // Testează dacă obiectul appliance are proprietățile corecte
  it("are proprietățile corecte", () => {
    expect(appliance.id).toEqual("54e0eccd-8f36-462b-b68a-8182611d9add");
    expect(appliance.image).toEqual("images/products/black-2-slot-toaster.jpg");
    expect(appliance.instructionsLink).toEqual(
      "images/appliance-instructions.png"
    );
    expect(appliance.warrantyLink).toEqual("images/appliance-warranty.png");
  });

  // Testează obținerea URL-ului pentru stele
  it("obține URL-ul pentru stele", () => {
    expect(appliance.getStarsUrl()).toEqual("images/ratings/rating-50.png");
  });

  // Testează obținerea prețului
  it("obține prețul", () => {
    expect(appliance.getPrice()).toEqual("$18.99");
  });

  // Testează dacă link-urile pentru instrucțiuni și garanție apar în extraInfoHTML
  it("afișează instrucțiuni și garanție în extraInfoHTML", () => {
    expect(appliance.extraInfoHTML()).toContain(
      `<a href="images/appliance-instructions.png" target="_blank">`
    );
    expect(appliance.extraInfoHTML()).toContain("Instructions");

    expect(appliance.extraInfoHTML()).toContain(
      `<a href="images/appliance-warranty.png" target="_blank">`
    );
    expect(appliance.extraInfoHTML()).toContain("Warranty");
  });
});
