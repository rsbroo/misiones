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

    // Inicializar estadísticas (contador de visitas y likes)
    initStats();

    // Cargar comentarios
    loadComments();

    // Evento para enviar comentarios
    document.getElementById('submit-comment').addEventListener('click', addComment);
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

    // Generar 20 imágenes (cambia el número según sea necesario)
    const galleryImages = Array.from({length: 20}, (_, i) => 
        `assets/images/img${i+1}.webp`);

    galleryTrigger.addEventListener('click', () => {
        modalContent.innerHTML = `
            <div class="slider-container">
                <div class="slider" id="imageSlider"></div>
                <button class="prev">&#10094;</button>
                <button class="next">&#10095;</button>
            </div>
        `;

        const slider = document.getElementById('imageSlider');
        galleryImages.forEach(img => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `<img src="${img}" alt="Trabajo RS Broo">`;
            slider.appendChild(slide);
        });

        // Inicializar el slider
        initSlider();
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

    // WhatsApp - Mostrar/ocultar formulario
    document.getElementById('whatsapp-buzon').addEventListener('click', () => {
        const form = document.getElementById('whatsapp-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
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

// Función para inicializar el slider de la galería
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
        showSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
        showSlide(currentIndex);
    });

    showSlide(0);
}

// Función para enviar el formulario de WhatsApp
async function enviarAWhatsApp() {
    const nombre = document.getElementById('nombre').value;
    let numero = document.getElementById('numero').value;
    const mensaje = document.getElementById('mensaje').value;

    if (!nombre || !numero || !mensaje) {
        alert('Por favor completa todos los campos.');
        return;
    }

    numero = numero.replace(/\D/g, '');

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxo6iWOxxjW36agmncFEVB58kM2us5ZAn3RPkQvAoxtbGwSggNH3HfcsOEnW7tiU19A/exec";

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, numero, mensaje })
        });

        if (response.ok) {
            alert('¡Gracias! Te contactaremos pronto por WhatsApp.');
            document.getElementById('nombre').value = '';
            document.getElementById('numero').value = '';
            document.getElementById('mensaje').value = '';
            document.getElementById('whatsapp-form').style.display = 'none';
        }
    } catch (error) {
        alert('Error al enviar. Intenta nuevamente.');
    }
}

// Contador de visitas y likes
function initStats() {
    // Contador de visitas
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
    document.getElementById('visit-count').textContent = visitCount;

    // Botón de like
    let likeCount = localStorage.getItem('likeCount') || 0;
    let liked = localStorage.getItem('liked') === 'true';

    const likeIcon = document.getElementById('like-icon');
    const likeCountEl = document.getElementById('like-count');

    likeCountEl.textContent = likeCount;

    if (liked) {
        likeIcon.classList.add('fas');
        likeIcon.classList.remove('far');
    }

    likeIcon.addEventListener('click', () => {
        if (liked) {
            likeCount--;
            likeIcon.classList.remove('fas');
            likeIcon.classList.add('far');
        } else {
            likeCount++;
            likeIcon.classList.add('fas');
            likeIcon.classList.remove('far');
        }
        liked = !liked;
        likeCountEl.textContent = likeCount;
        localStorage.setItem('likeCount', likeCount);
        localStorage.setItem('liked', liked);
    });
}

// Comentarios
function loadComments() {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');

    comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
            <h4>${comment.name}</h4>
            <p>${comment.text}</p>
            <small>${new Date(comment.date).toLocaleDateString()}</small>
        `;
        commentsList.appendChild(commentEl);
    });
}

function addComment() {
    const name = document.getElementById('comment-name').value;
    const text = document.getElementById('comment-text').value;

    if (!name || !text) {
        alert('Por favor completa todos los campos');
        return;
    }

    const comment = {
        name,
        text,
        date: new Date().toISOString()
    };

    let comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.unshift(comment);
    localStorage.setItem('comments', JSON.stringify(comments));

    // Limpiar y recargar
    document.getElementById('comment-name').value = '';
    document.getElementById('comment-text').value = '';
    loadComments();
}
