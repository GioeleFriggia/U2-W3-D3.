(function () {
  const bookListContainer = document.getElementById("book-list");
  const cartListContainer = document.getElementById("cart-list");
  let cartItems = [];

  function getBooks() {
    fetch("https://striveschool-api.herokuapp.com/books")
      .then((response) => response.json())
      .then((books) => displayBooks(books))
      .catch((error) =>
        console.error("Errore durante la chiamata HTTP:", error)
      );
  }

  function displayBooks(books) {
    bookListContainer.innerHTML = "";

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
            <div class="card">
              <img src="${book.img}" class="card-img-top" alt="${book.title}">
              <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">Prezzo: ${book.price}</p>
                <button class="btn btn-danger remove-btn" onclick="removeCard(this)">Scarta</button>
                <button class="btn btn-primary purchase-btn" onclick="addToCart('${book.title}', '${book.price}')">Compra ora</button>
              </div>
            </div>
          `;
      bookListContainer.appendChild(card);
    });
  }

  function addToCart(title, price) {
    const cartItem = { title: title, price: price };
    cartItems.push(cartItem);
    saveCartToStorage();
    updateCartUI();
  }

  function removeCard(button) {
    const card = button.closest(".card");
    card.remove();
    updateCartUI();
  }

  function saveCartToStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  function retrieveCartFromStorage() {
    const storedCart = localStorage.getItem("cartItems");
    cartItems = storedCart ? JSON.parse(storedCart) : [];
  }

  function updateCartUI() {
    cartListContainer.innerHTML = "";
    cartItems.forEach((item) => {
      const cartItem = document.createElement("li");
      cartItem.innerText = `${item.title} - ${item.price}`;
      cartListContainer.appendChild(cartItem);
    });

    const totalPriceElement = document.getElementById("total-price");
    const totalPrice = cartItems
      .reduce((acc, item) => acc + parseFloat(item.price.replace("€", "")), 0)
      .toFixed(2);
    totalPriceElement.innerText = `Totale: €${totalPrice}`;
  }

  function purchase() {
    cartItems = [];
    saveCartToStorage();
    updateCartUI();
  }

  retrieveCartFromStorage();
  getBooks();

  // Assegna le funzioni al contesto globale
  window.addToCart = addToCart;
  window.removeCard = removeCard;
})();
function purchase() {
  // Aggiorna l'UI con la lista dei libri nel carrello
  const cartListContainer = document.getElementById("cart-list");
  cartListContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const cartItem = document.createElement("li");
    cartItem.innerText = `${item.title} - ${item.price}`;
    cartListContainer.appendChild(cartItem);
  });

  // Calcola e mostra il totale nella UI
  const totalPriceElement = document.getElementById("total-price");
  const totalPrice = cartItems
    .reduce((acc, item) => acc + parseFloat(item.price.replace("€", "")), 0)
    .toFixed(2);
  totalPriceElement.innerText = `Totale: €${totalPrice}`;

  // Optional: Puoi nascondere la sezione dei libri nel catalogo
  const bookListContainer = document.getElementById("book-list");
  bookListContainer.style.display = "none";

  // Puoi anche effettuare altre azioni, ad esempio un messaggio di conferma
  alert("Grazie per il tuo acquisto!");

  // Opzionale: Puoi reimpostare il carrello a vuoto dopo l'acquisto
  cartItems = [];
  saveCartToStorage();
  updateCartUI();
}
