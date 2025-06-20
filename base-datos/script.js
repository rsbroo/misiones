document.addEventListener('DOMContentLoaded', () => {
    const catalogo = JSON.parse(localStorage.getItem('catalogo')) || [];
    const contenedor = document.getElementById('catalogo-container');
    const filtroBusqueda = document.getElementById('busqueda');
    const filtroCategoria = document.getElementById('categorias-filtro');

    // Cargar categorías únicas en el filtro
    const categorias = [...new Set(catalogo.map(item => item.categoria))];
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filtroCategoria.appendChild(option);
    });

    function renderizarCatalogo(productos) {
        contenedor.innerHTML = '';
        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            card.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}">
                <div class="producto-info">
                    <h3>${producto.titulo}</h3>
                    <p class="categoria">${producto.categoria}</p>
                    <p>${producto.descripcion}</p>
                    <p class="precio">$${producto.precio.toFixed(2)}</p>
                </div>
            `;
            contenedor.appendChild(card);
        });
    }

    function filtrarProductos() {
        const texto = filtroBusqueda.value.toLowerCase();
        const categoria = filtroCategoria.value;
        
        const filtrados = catalogo.filter(producto => 
            (producto.titulo.toLowerCase().includes(texto) || 
             producto.descripcion.toLowerCase().includes(texto)) &&
            (categoria === '' || producto.categoria === categoria)
        );
        
        renderizarCatalogo(filtrados);
    }

    filtroBusqueda.addEventListener('input', filtrarProductos);
    filtroCategoria.addEventListener('change', filtrarProductos);
    
    // Carga inicial
    renderizarCatalogo(catalogo);
});