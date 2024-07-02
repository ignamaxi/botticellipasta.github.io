let basket = [];
let total = 0;

// Cargar la canasta desde localStorage y cargar el contenido de la canasta desde canasta.html al cargar la página
window.onload = function() {
    const storedBasket = JSON.parse(localStorage.getItem('basket'));
    if (storedBasket) {
        basket = storedBasket;
        updateBasket();
    }

    fetch('canasta.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('basket-container').innerHTML = data;
            updateBasket();
        })
        .catch(error => console.error('Error al cargar la canasta:', error));
};

// Agregar un artículo a la canasta
function addToBasket(item, price) {
    let found = false;
    basket.forEach(entry => {
        if (entry.item === item) {
            entry.quantity++;
            found = true;
        }
    });

    if (!found) {
        basket.push({ item, price, quantity: 1 });
    }

    updateBasket();
}

// Actualizar la vista de la canasta y el total
function updateBasket() {
    const basketElement = document.getElementById('basket');
    const totalElement = document.getElementById('total');
    const orderButton = document.getElementById('order-button');

    if (!basketElement || !totalElement || !orderButton) return;

    basketElement.innerHTML = '';
    total = 0;

    basket.forEach(entry => {
        const li = document.createElement('li');
        const quantityText = entry.quantity > 1 ? `x${entry.quantity} ` : '';
        li.textContent = `${quantityText}${entry.item} - $${entry.price * entry.quantity}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Quitar';
        removeButton.onclick = () => removeFromBasket(entry.item);
        li.appendChild(removeButton);

        basketElement.appendChild(li);
        total += entry.price * entry.quantity;
    });

    totalElement.textContent = total;
    localStorage.setItem('basket', JSON.stringify(basket));
    orderButton.disabled = basket.length === 0;
}

// Quitar un artículo de la canasta
function removeFromBasket(item) {
    const index = basket.findIndex(entry => entry.item === item);

    if (index !== -1) {
        const entry = basket[index];
        entry.quantity > 1 ? entry.quantity-- : basket.splice(index, 1);
        updateBasket();
    }
}

// Realizar el pedido
function placeOrder() {
    alert('¡Pedido realizado! Gracias por tu compra.');
    resetBasket();
}

// Resetear la canasta después de realizar el pedido
function resetBasket() {
    basket = [];
    updateBasket();
}

// Quitar todos los elementos de la canasta
function clearBasket() {
    basket = [];
    updateBasket();
}
