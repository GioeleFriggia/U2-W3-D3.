(function () {
  const bookListContainer = document.getElementById("book-list");
  const cartListContainer = document.getElementById("cart-list");
  const cartContainer = document.getElementById("cart-container");
  const totalPriceElement = document.getElementById("total-price");
  const clearCartButton = document.getElementById("clear-cart");
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
    showCart();
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

    const totalPrice = cartItems
      .reduce((acc, item) => acc + parseFloat(item.price.replace("€", "")), 0)
      .toFixed(2);
    totalPriceElement.innerText = `Totale: €${totalPrice}`;
  }

  function showCart() {
    cartContainer.style.display = "block";
  }

  function purchase() {
    cartItems = [];
    saveCartToStorage();
    updateCartUI();
    hideCart();
  }

  function hideCart() {
    cartContainer.style.display = "none";
  }

  function clearCart() {
    cartItems = [];
    saveCartToStorage();
    updateCartUI();
  }

  retrieveCartFromStorage();
  getBooks();

  // Assegna le funzioni al contesto globale
  window.addToCart = addToCart;
  window.removeCard = removeCard;
  window.purchase = purchase;
  window.clearCart = clearCart;

  // Aggiunge l'evento click al bottone per cancellare il carrello
  clearCartButton.addEventListener("click", clearCart);
})();
