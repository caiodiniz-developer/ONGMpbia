<<<<<<< HEAD
let currentLanguage = 'pt';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    document.getElementById('current-lang').textContent = currentLanguage === 'pt' ? 'EN' : 'PT';
    updateLanguage();
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-pt], [data-en]');
    elements.forEach(el => {
        const text = currentLanguage === 'pt' ? el.getAttribute('data-pt') : el.getAttribute('data-en');
        if (text) {
            el.textContent = text;
        }
    });

    const inputs = document.querySelectorAll('[data-placeholder-pt], [data-placeholder-en]');
    inputs.forEach(input => {
        const placeholder = currentLanguage === 'pt'
            ? input.getAttribute('data-placeholder-pt')
            : input.getAttribute('data-placeholder-en');
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });

    updateMapPins();
}

function updateMapPins() {
    const pins = document.querySelectorAll('.map-pin');
    pins.forEach(pin => {
        const namePt = pin.getAttribute('data-name-pt');
        const nameEn = pin.getAttribute('data-name-en');
        const people = pin.getAttribute('data-people');
        const name = currentLanguage === 'pt' ? namePt : nameEn;
        const label = currentLanguage === 'pt' ? 'pessoas impactadas' : 'people impacted';

        pin.style.setProperty('--tooltip-content', `"${name}\\A+${parseInt(people).toLocaleString()} ${label}"`);
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const duration = 2000;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check';
        button.classList.add('copied');

        showToast(currentLanguage === 'pt' ? 'Copiado!' : 'Copied!');

        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast(currentLanguage === 'pt' ? 'Erro ao copiar' : 'Copy failed', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? 'hsl(120, 60%, 40%)' : 'hsl(0, 75%, 55%)';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function handleIdeaFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const idea = document.getElementById('idea').value;

    const message = `Olá IMPBIA! Quero entrar em contato.\n\nNome: ${name}\nCidade: ${city}\nMensagem: ${idea}`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5521988793046&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    e.target.reset();
}

function initMapPins() {
    const pins = document.querySelectorAll('.map-pin');

    pins.forEach(pin => {
        const ping = document.createElement('div');
        ping.className = 'pin-ping';
        pin.appendChild(ping);
    });

    updateMapPins();
}

let currentCarouselIndex = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('.books-carousel');
    const cards = document.querySelectorAll('.book-card');
    const totalCards = cards.length;

    let visibleCards = 3;
    if (window.innerWidth <= 768) {
        visibleCards = 1;
    } else if (window.innerWidth <= 1024) {
        visibleCards = 2;
    }

    const maxIndex = Math.max(0, totalCards - visibleCards);

    currentCarouselIndex += direction;

    if (currentCarouselIndex < 0) {
        currentCarouselIndex = maxIndex;
    } else if (currentCarouselIndex > maxIndex) {
        currentCarouselIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth + 48;
    carousel.style.transform = `translateX(-${currentCarouselIndex * cardWidth}px)`;
}

function openBookStore() {
    window.open('https://www.amazon.com.br/s?k=mpbia', '_blank');
}

function autoPlayCarousel() {
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    window.addEventListener('scroll', handleNavbarScroll);

    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupScrollAnimations();
    animateCounters();

    const ideaForm = document.getElementById('idea-form');
    if (ideaForm) {
        ideaForm.addEventListener('submit', handleIdeaFormSubmit);
    }

    initMapPins();

    autoPlayCarousel();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        setupScrollAnimations();
        currentCarouselIndex = 0;
        const carousel = document.querySelector('.books-carousel');
        if (carousel) {
            carousel.style.transform = 'translateX(0)';
        }
    }, 250);
=======
let currentLanguage = 'pt';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'pt' ? 'en' : 'pt';
    document.getElementById('current-lang').textContent = currentLanguage === 'pt' ? 'EN' : 'PT';
    updateLanguage();
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-pt], [data-en]');
    elements.forEach(el => {
        const text = currentLanguage === 'pt' ? el.getAttribute('data-pt') : el.getAttribute('data-en');
        if (text) {
            el.textContent = text;
        }
    });

    const inputs = document.querySelectorAll('[data-placeholder-pt], [data-placeholder-en]');
    inputs.forEach(input => {
        const placeholder = currentLanguage === 'pt'
            ? input.getAttribute('data-placeholder-pt')
            : input.getAttribute('data-placeholder-en');
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });

    updateMapPins();
}

function updateMapPins() {
    const pins = document.querySelectorAll('.map-pin');
    pins.forEach(pin => {
        const namePt = pin.getAttribute('data-name-pt');
        const nameEn = pin.getAttribute('data-name-en');
        const people = pin.getAttribute('data-people');
        const name = currentLanguage === 'pt' ? namePt : nameEn;
        const label = currentLanguage === 'pt' ? 'pessoas impactadas' : 'people impacted';

        pin.style.setProperty('--tooltip-content', `"${name}\\A+${parseInt(people).toLocaleString()} ${label}"`);
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const duration = 2000;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check';
        button.classList.add('copied');

        showToast(currentLanguage === 'pt' ? 'Copiado!' : 'Copied!');

        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast(currentLanguage === 'pt' ? 'Erro ao copiar' : 'Copy failed', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? 'hsl(120, 60%, 40%)' : 'hsl(0, 75%, 55%)';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function handleIdeaFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const idea = document.getElementById('idea').value;

    const message = `Olá IMPBIA! Quero entrar em contato.\n\nNome: ${name}\nCidade: ${city}\nMensagem: ${idea}`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5521988793046&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    e.target.reset();
}

function initMapPins() {
    const pins = document.querySelectorAll('.map-pin');

    pins.forEach(pin => {
        const ping = document.createElement('div');
        ping.className = 'pin-ping';
        pin.appendChild(ping);
    });

    updateMapPins();
}

let currentCarouselIndex = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('.books-carousel');
    const cards = document.querySelectorAll('.book-card');
    const totalCards = cards.length;

    let visibleCards = 3;
    if (window.innerWidth <= 768) {
        visibleCards = 1;
    } else if (window.innerWidth <= 1024) {
        visibleCards = 2;
    }

    const maxIndex = Math.max(0, totalCards - visibleCards);

    currentCarouselIndex += direction;

    if (currentCarouselIndex < 0) {
        currentCarouselIndex = maxIndex;
    } else if (currentCarouselIndex > maxIndex) {
        currentCarouselIndex = 0;
    }

    const cardWidth = cards[0].offsetWidth + 48;
    carousel.style.transform = `translateX(-${currentCarouselIndex * cardWidth}px)`;
}

function openBookStore() {
    window.open('https://www.amazon.com.br/s?k=mpbia', '_blank');
}

function autoPlayCarousel() {
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    window.addEventListener('scroll', handleNavbarScroll);

    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupScrollAnimations();
    animateCounters();

    const ideaForm = document.getElementById('idea-form');
    if (ideaForm) {
        ideaForm.addEventListener('submit', handleIdeaFormSubmit);
    }

    initMapPins();

    autoPlayCarousel();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        setupScrollAnimations();
        currentCarouselIndex = 0;
        const carousel = document.querySelector('.books-carousel');
        if (carousel) {
            carousel.style.transform = 'translateX(0)';
        }
    }, 250);
>>>>>>> d9de32ea8916b59735fc9eab6d8ef42dbebfd5ee
});