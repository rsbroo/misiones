// Cargar catálogo de servicios
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('assets/data/productos.json');
        const servicios = await response.json();
        renderServices(servicios);
    } catch (error) {
        console.error('Error cargando el catálogo:', error);
        document.getElementById('services-container').innerHTML = `
            <div class="error">
                <p>Error al cargar los servicios. Por favor intente más tarde.</p>
            </div>
        `;
    }

    // Inicializar eventos
    initEvents();
});

function renderServices(servicios) {
    const container = document.getElementById('services-container');
    let html = '';

    servicios.forEach((servicio, index) => {
        html += `
            <div class="service-card animate delay-${index + 1}">
                <div class="service-icon">
                    <i class="${servicio.icono}"></i>
                </div>
                <div class="service-content">
                    <h3>${servicio.nombre}</h3>
                    <ul>
                        ${servicio.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function initEvents() {
    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Galería
    const galleryTrigger = document.getElementById('galleryTrigger');
    const galleryModal = document.getElementById('galleryModal');
    const closeModal = document.getElementById('closeModal');
    const modalContent = document.getElementById('modalContent');
    
    const galleryImages = [
        'assets/images/img1.webp',
        'assets/images/img2.webp',
        'assets/images/img3.webp',
        'assets/images/img4.webp',
        'assets/images/img5.webp',
        'assets/images/img6.webp',
        'assets/images/img7.webp'
    ];
    
    galleryTrigger.addEventListener('click', () => {
        modalContent.innerHTML = '';
        galleryImages.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = 'Trabajo RS Broo';
            imgElement.classList.add('modal-img');
            modalContent.appendChild(imgElement);
        });
        galleryModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', () => {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // WhatsApp
    const whatsappBoton = document.getElementById('whatsapp-buzon');
    const whatsappForm = document.getElementById('whatsapp-form');
    const cerrarForm = document.getElementById('cerrar-form');
    const enviarWhatsapp = document.getElementById('enviar-wa');
    
    whatsappBoton.addEventListener('click', () => {
        whatsappForm.style.display = 'block';
    });
    
    cerrarForm.addEventListener('click', () => {
        whatsappForm.style.display = 'none';
    });
    
    enviarWhatsapp.addEventListener('click', () => {
        const nombre = document.getElementById('nombre-wa').value;
        let numero = document.getElementById('numero-wa').value.replace(/\D/g, '');
        const mensaje = document.getElementById('mensaje-wa').value;
        
        if (!nombre || !numero || !mensaje) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // Formatear número
        if (!numero.startsWith('549')) {
            numero = '549' + numero;
        }
        
        // Guardar en localStorage
        const contacto = {
            fecha: new Date().toISOString(),
            nombre,
            numero,
            mensaje
        };
        
        let contactos = JSON.parse(localStorage.getItem('rs_contactos') || '[]');
        contactos.push(contacto);
        localStorage.setItem('rs_contactos', JSON.stringify(contactos));
        
        // Limpiar y cerrar
        document.getElementById('nombre-wa').value = '';
        document.getElementById('numero-wa').value = '';
        document.getElementById('mensaje-wa').value = '';
        whatsappForm.style.display = 'none';
        
        // Opcional: Abrir enlace de WhatsApp
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
    });

    // Año actual en footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
}