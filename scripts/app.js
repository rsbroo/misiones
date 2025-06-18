// URL de Google Apps Script (reemplazar con tu URL)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWvQ5fO2.../exec";

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
    
    // Cargar contadores
    loadCounters();
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
    const slidesContainer = document.getElementById('slides');
    const dotsContainer = document.getElementById('dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // 20 imágenes de galería
    const galleryImages = [];
    for (let i = 1; i <= 20; i++) {
        galleryImages.push(`assets/images/img${i}.webp`);
    }

    let currentSlide = 0;

    function createSlides() {
        slidesContainer.innerHTML = '';
        galleryImages.forEach((img, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slide';
            if (index === 0) slideDiv.classList.add('active');
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = `Trabajo RS Broo ${index + 1}`;
            slideDiv.appendChild(imgElement);
            slidesContainer.appendChild(slideDiv);
        });
    }

    function createDots() {
        dotsContainer.innerHTML = '';
        galleryImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function updateSlider() {
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        // Actualizar dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    galleryTrigger.addEventListener('click', () => {
        createSlides();
        createDots();
        currentSlide = 0;
        updateSlider();
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

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % galleryImages.length;
        updateSlider();
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

    // Evento para el like
    const likeContainer = document.getElementById('like-container');
    likeContainer.addEventListener('click', () => {
        // Verificar si ya dio like
        if (localStorage.getItem('rsbroo_like') === 'true') {
            alert('Ya has dado like a esta página.');
            return;
        }

        // Registrar like
        fetch(`${SCRIPT_URL}?type=like`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('likes-count').textContent = data.likes;
                localStorage.setItem('rsbroo_like', 'true');
                likeContainer.classList.add('liked');
            })
            .catch(error => console.error('Error registrando like:', error));
    });
}

function loadCounters() {
    // Registrar visita
    fetch(`${SCRIPT_URL}?type=visita`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('visits-count').textContent = data.visitas;
            document.getElementById('likes-count').textContent = data.likes;
        })
        .catch(error => console.error('Error cargando contadores:', error));
}
