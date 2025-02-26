// Funcția formatCurrency primește un preț exprimat în cenți și îl convertește într-o valoare valabilă în dolari (sau altă monedă).
function formatCurrency(priceCents) {
  // Verificăm dacă prețul este negativ
  const isNegative = priceCents < 0;

  // Luăm valoarea absolută a prețului pentru a evita erori de procesare a valorilor negative
  const absoluteValue = Math.abs(priceCents);

  // Rotunjim valoarea absolută la cel mai apropiat întreg
  const roundedValue = Math.round(absoluteValue);

  // Împărțim valoarea rotunjită la 100 pentru a obține valoarea în dolari (sau altă monedă) și o formatăm cu două zecimale
  const formattedValue = (roundedValue / 100).toFixed(2);

  // Dacă prețul era negativ, adăugăm semnul minus în față, altfel returnăm valoarea pozitivă
  return isNegative ? `-${formattedValue}` : formattedValue;
}

// Exportăm funcția pentru a putea fi utilizată în alte părți ale proiectului
export default formatCurrency;
