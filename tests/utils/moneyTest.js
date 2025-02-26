import formatCurrency from "../../scripts/utils/money.js";

// Descrierea suitei de teste pentru funcția formatCurrency
describe("test suite: formatCurrency", () => {
  // Testează conversia cenților în dolari
  it("convertește cenți în dolari", () => {
    expect(formatCurrency(2095)).toEqual("20.95");
  });

  // Testează funcția cu valoarea 0
  it("funcționează cu 0", () => {
    expect(formatCurrency(0)).toEqual("0.00");
  });

  // Testează dacă rotunjirea se face corect la cel mai apropiat cent
  it("rotunjește la cel mai apropiat cent", () => {
    expect(formatCurrency(2000.5)).toEqual("20.01");
    expect(formatCurrency(2000.4)).toEqual("20.00");
  });

  // Testează funcția cu numere negative
  it("funcționează cu numere negative", () => {
    expect(formatCurrency(-2000.5)).toEqual("-20.01");
    expect(formatCurrency(-12345)).toEqual("-123.45");
  });
});
