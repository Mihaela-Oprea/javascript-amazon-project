// Funcția este exportată pentru a putea fi folosită în alte părți ale proiectului
export function formattedDate(
  day,
  locale = "en-US",
  options = { month: "long", day: "numeric" }
) {
  // Creăm un obiect Date folosind data transmisă ca parametru
  const date = new Date(day);

  // Returnăm data formatată conform setării de locație și opțiunilor de format
  return date.toLocaleDateString(locale, options);
}
