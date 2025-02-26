import { formatCurrency } from "../../scripts/utils/money.js";

// Afișează începutul suitei de teste pentru funcția formatCurrency
console.log("test suite: formatCurrency");

// Testează conversia cenților în dolari
console.log("convertește cenți în dolari");

formatCurrency(2095) === "20.95"
  ? console.log("testul a trecut")
  : console.log("testul a picat");

// Testează funcția cu valoarea 0
console.log("funcționează cu 0");

formatCurrency(0) === "0.00"
  ? console.log("testul a trecut")
  : console.log("testul a picat");

// Testează dacă rotunjirea se face corect la cel mai apropiat cent
console.log("rotunjește la cel mai apropiat cent");

formatCurrency(2000.5) === "20.01"
  ? console.log("testul a trecut")
  : console.log("testul a picat");

formatCurrency(2000.4) === "20.00"
  ? console.log("testul a trecut")
  : console.log("testul a picat");
