// ================================
// FUNCIONALIDAD PRINCIPAL
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupMobileNavigation();
    setupScrollAnimations();
    setupInteractiveElements();
    setupScrollToTop();
    setupLazyLoading();
    setupAccessibility();
}

// ================================
// NAVEGACIÓN MÓVIL
// ================================

function setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Agregar/quitar clase al body para prevenir scroll
            document.body.classList.toggle('nav-open');
        });
        
        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }
}

// ================================
// ANIMACIONES DE SCROLL
// ================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Animar elementos hijos con delay
                const children = entry.target.querySelectorAll('.info-card, .attraction-card, .activity-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
                    }, 100);
                });
            }
        });
    }, observerOptions);
    
    // Observar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ================================
// ELEMENTOS INTERACTIVOS
// ================================

function setupInteractiveElements() {
    setupCardInteractions();
    setupFlagAnimation();
    setupCounters();
    setupTooltips();
}

function setupCardInteractions() {
    const cards = document.querySelectorAll('.info-card, .attraction-card, .activity-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // Efecto de click
        card.addEventListener('click', function() {
            this.style.animation = 'pulse 0.3s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

function setupFlagAnimation() {
    const flag = document.querySelector('.flag');
    if (flag) {
        flag.addEventListener('mouseenter', function() {
            const stripes = this.querySelectorAll('.flag-stripe');
            stripes.forEach((stripe, index) => {
                stripe.style.animation = `slideInLeft 0.5s ease-out ${index * 0.1}s both`;
            });
        });
        
        flag.addEventListener('mouseleave', function() {
            const stripes = this.querySelectorAll('.flag-stripe');
            stripes.forEach(stripe => {
                stripe.style.animation = '';
            });
        });
    }
}

function setupCounters() {
    const counters = document.querySelectorAll('.card-stats span');
    
    const countUp = (element, target) => {
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 20);
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = text.match(/[\d,]+/);
                if (number) {
                    const target = parseInt(number[0].replace(/,/g, ''));
                    if (target > 100) {
                        countUp(entry.target, target);
                    }
                }
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// ================================
// SCROLL TO TOP
// ================================

function setupScrollToTop() {
    // Crear botón de scroll to top
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollToTopBtn);
    
    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-red);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            background: var(--dark-red);
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Funcionalidad del botón
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// LAZY LOADING
// ================================

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ================================
// ACCESIBILIDAD
// ================================

function setupAccessibility() {
    // Navegación por teclado mejorada
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            
            if (navToggle && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        }
    });
    
    // Skip links para navegación por teclado
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Agregar ID al contenido principal
    const mainContent = document.querySelector('.content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
    
    // Estilos para skip link
    const skipStyle = document.createElement('style');
    skipStyle.textContent = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-red);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            transition: top 0.3s;
        }
        
        .skip-link:focus {
            top: 6px;
        }
    `;
    document.head.appendChild(skipStyle);
}

// ================================
// UTILIDADES
// ================================

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ================================
// EVENTOS ADICIONALES
// ================================

// Manejar cambios de orientación
window.addEventListener('orientationchange', debounce(function() {
    location.reload();
}, 500));

// Manejar redimensionamiento de ventana
window.addEventListener('resize', throttle(function() {
    // Ajustar navegación móvil en cambio de tamaño
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    if (window.innerWidth > 768 && navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
}, 250));

// Optimización de rendimiento
window.addEventListener('load', function() {
    // Precargar fuentes críticas
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
    
    // Lazy loading para elementos no críticos
    setTimeout(() => {
        const nonCriticalElements = document.querySelectorAll('.non-critical');
        nonCriticalElements.forEach(el => {
            el.classList.add('loaded');
        });
    }, 1000);
});

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics y métricas (placeholder)
function trackUserInteraction(action, element) {
    // Aquí puedes agregar tu código de analytics
    console.log(`User interaction: ${action} on ${element}`);
}

// Exportar funciones para uso externo si es necesario
window.SpainApp = {
    initializeApp,
    setupMobileNavigation,
    setupScrollAnimations,
    trackUserInteraction
};