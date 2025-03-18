// Conectamos con el servidor
const socket = io();

// DOM
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Renderizar la lista de productos
function renderProducts(products) {
    productList.innerHTML = '';
    
    if (!products || products.length === 0) {
        productList.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p class="description">${product.description}</p>
            <p class="details"><strong>Código:</strong> ${product.code}</p>
            <p class="details"><strong>Precio:</strong> $${product.price}</p>
            <p class="details"><strong>Stock:</strong> ${product.quantity} unidades</p>
            <p class="details"><strong>Categoría:</strong> ${product.category}</p>
            <button class="delete-btn" data-id="${product.id}">Eliminar</button>
        `;
        productList.appendChild(productCard);
    });
    
    // eventListener para  botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            socket.emit('deleteProduct', productId);
        });
    });
}

// Escuchar el evento 'products' del servidor
socket.on('products', (products) => {
    renderProducts(products);
});

// envío del formulario
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: Number(document.getElementById('price').value),
        status: true,
        quantity: Number(document.getElementById('quantity').value),
        category: document.getElementById('category').value,
        thumbnails: []
    };
    
    // Enviar producto x websockets
    socket.emit('newProduct', newProduct);
    
    // Limpiar el formulario
    productForm.reset();
});