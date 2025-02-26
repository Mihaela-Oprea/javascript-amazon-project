import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

// Definirea opțiunilor de livrare disponibile
export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

// Funcție care returnează opțiunea de livrare pe baza ID-ului
export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  // Căutăm opțiunea de livrare corespunzătoare ID-ului
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  // Dacă nu găsim opțiunea, returnăm prima opțiune disponibilă
  return deliveryOption || deliveryOptions[0];
}

// Funcție care verifică dacă data dată este un weekend
function isWeekend(date) {
  const dayOfWeek = date.format("dddd"); // Obținem ziua săptămânii
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday"; // Verificăm dacă este sâmbătă sau duminică
}

// Funcție care calculează data de livrare pe baza opțiunii selectate
export function calculateDeliveryDate(deliveryOption) {
  let remainingDays = deliveryOption.deliveryDays; // Zilele rămase până la livrare
  let deliveryDate = dayjs(); // Data curentă

  // Calculăm data livrării
  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, "day"); // Adăugăm o zi la data curentă

    if (!isWeekend(deliveryDate)) {
      // Dacă nu este weekend, scădem o zi din numărul de zile rămase
      remainingDays--;
    }
  }
  const dateString = deliveryDate.format("dddd, MMMM D"); // Formatăm data de livrare
  return dateString; // Returnăm data livrării
}

// Funcție care verifică dacă o opțiune de livrare există
export function deliveryOptionExist(deliveryOptionId) {
  let result = false;

  // Căutăm opțiunea de livrare în lista opțiunilor
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      result = true; // Dacă găsim opțiunea, setăm result la true
    }
  });
  return result; // Returnăm true dacă opțiunea există, altfel false
}
