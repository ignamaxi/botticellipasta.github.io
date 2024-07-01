let basket = [];
let total = 0;

// Función para cargar la canasta desde localStorage al cargar la página
window.onload = function() {
    const storedBasket = JSON.parse(localStorage.getItem('basket'));
    if (storedBasket) {
        basket = storedBasket;
        updateBasket();
    }

    // Cargar el contenido de la canasta desde canasta.html
    fetch('canasta.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('basket-container').innerHTML = data;
            updateBasket(); // Actualizar la canasta después de cargar el contenido
        })
        .catch(error => console.error('Error al cargar la canasta:', error));
};

function addToBasket(item, price) {
    let found = false;
    // Buscar si el artículo ya está en la cesta
    basket.forEach(entry => {
        if (entry.item === item) {
            entry.quantity++;
            found = true;
        }
    });

    // Si no se encontró, agregarlo con cantidad 1
    if (!found) {
        basket.push({ item, price, quantity: 1 });
    }

    updateBasket();
    
}

function updateBasket() {
    const basketElement = document.getElementById('basket');
    const totalElement = document.getElementById('total');
    const orderButton = document.getElementById('order-button'); // Obtener el botón de pedido

    if (!basketElement || !totalElement || !orderButton) {
        return; // Si no se encuentran los elementos, no hacer nada
    }

    basketElement.innerHTML = '';
    total = 0;

    basket.forEach(entry => {
        const li = document.createElement('li');
        const quantityText = entry.quantity > 1 ? `x${entry.quantity} ` : '';
        li.textContent = `${quantityText}${entry.item} - $${entry.price * entry.quantity}`;

        // Botón para quitar un artículo
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Quitar';
        removeButton.onclick = () => removeFromBasket(entry.item);
        li.appendChild(removeButton);

        basketElement.appendChild(li);
        total += entry.price * entry.quantity;
    });

    totalElement.textContent = total;

    // Guardar la canasta en localStorage
    localStorage.setItem('basket', JSON.stringify(basket));

    // Habilitar o deshabilitar el botón de pedido según la cantidad de productos en la canasta
    if (basket.length === 0) {
        orderButton.disabled = true; // Desactivar el botón si la canasta está vacía
    } else {
        orderButton.disabled = false; // Habilitar el botón si hay productos en la canasta
    }
}

function removeFromBasket(item) {
    // Buscar el índice del artículo a quitar
    const index = basket.findIndex(entry => entry.item === item);

    if (index !== -1) {
        const entry = basket[index];

        // Reducir la cantidad o eliminar el artículo si es solo uno
        if (entry.quantity > 1) {
            entry.quantity--;
        } else {
            basket.splice(index, 1); // Eliminar el artículo del arreglo
        }

        updateBasket(); // Actualizar la vista del carrito
    }
}

// Función para realizar el pedido
function placeOrder() {
    // Aquí puedes implementar la lógica para realizar el pedido
    // Por ejemplo, mostrar un mensaje de confirmación
    alert('¡Pedido realizado! Gracias por tu compra.');

    // También podrías resetear la canasta después de realizar el pedido
    resetBasket();
}

// Función para resetear la canasta después de realizar el pedido
function resetBasket() {
    basket = []; // Vaciar la canasta
    updateBasket(); // Actualizar la vista de la canasta
}

// Función para quitar todos los elementos de la canasta
function clearBasket() {
    basket = []; // Vaciar la canasta
    updateBasket(); // Actualizar la vista de la canasta
}
