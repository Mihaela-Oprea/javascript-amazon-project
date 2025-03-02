// Funcția care gestionează căutările de produse
function productSearch() {
  // Adaugă un event listener pe butonul de căutare
  document.querySelector(".js-search-button").addEventListener("click", () => {
    // Preia valoarea introdusă în câmpul de căutare
    const search = document.querySelector(".js-search-bar").value;

    // Verifică dacă există un text introdus în câmpul de căutare
    if (search != "") {
      // Dacă există, redirecționează utilizatorul către pagina de rezultate, cu parametrul de căutare
      window.location.href = `index.html?search=${search}`;
    } else {
      // Dacă câmpul de căutare este gol, redirecționează utilizatorul către pagina principală
      window.location.href = `index.html`;
    }
  });

  // Adaugă un event listener pe câmpul de căutare pentru a detecta apăsarea tastelor
  document
    .querySelector(".js-search-bar")
    .addEventListener("keydown", (event) => {
      // Preia valoarea introdusă în câmpul de căutare
      const search = document.querySelector(".js-search-bar").value;

      // Verifică dacă utilizatorul apasă tasta 'Enter'
      if (event.key === "Enter") {
        const input = event.target; // Folosește 'event.target' pentru a face referire la input
        // Dacă există un text introdus în câmpul de căutare, redirecționează utilizatorul la pagina de rezultate
        if (search != "") {
          window.location.href = `index.html?search=${search}`;
        } else {
          // Dacă câmpul de căutare este gol, redirecționează utilizatorul către pagina principală
          window.location.href = `index.html`;
        }
      }
    });
}

// Exportă funcția pentru a fi folosită în alte părți ale aplicației
export default productSearch;
