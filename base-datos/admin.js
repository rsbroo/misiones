document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const producto = {
        categoria: document.getElementById('categoria').value,
        imagen: document.getElementById('imagen').value,
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value)
    };

    // Guardar en localStorage
    const catalogo = JSON.parse(localStorage.getItem('catalogo')) || [];
    catalogo.push(producto);
    localStorage.setItem('catalogo', JSON.stringify(catalogo));
    
    // Resetear formulario
    e.target.reset();
    alert('¡Producto guardado!');
