// Obținem comenzile din localStorage sau un array gol dacă nu există
export const orders = JSON.parse(localStorage.getItem("orders")) || [];

// Funcție pentru a adăuga o comandă
export function addOrder(order) {
  orders.unshift(order); // Adăugăm comanda la începutul array-ului
  saveToStorage(); // Salvăm comenzile în localStorage
}

// Funcție pentru a salva comenzile în localStorage
function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders)); // Salvăm comenzile în format JSON
}

// Funcție pentru a obține o comandă pe baza ID-ului
export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId); // Căutăm comanda după ID
}
