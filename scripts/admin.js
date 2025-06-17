// Cargar datos actuales
fetch('../assets/data/productos.json')
    .then(response => response.text())
    .then(data => {
        document.getElementById('json-editor').value = data;
    });

function guardar() {
    const password = prompt("Ingrese la contraseña de administrador:");
    if (password === "RSBroo2024") { // Cambia esta contraseña
        const nuevoJSON = document.getElementById('json-editor').value;
        
        // Aquí iría la lógica para guardar en el servidor
        // Como es local, solo damos instrucciones
        alert('Copie este contenido y reemplace el archivo productos.json en assets/data/');
        console.log(nuevoJSON);
    } else {
        alert('Contraseña incorrecta');
    }
}