/* ===========================
   JS: INTERAÇÕES MODERNAS SOUL ELEVEN
=========================== */

// Config
const CONFIG = {
    whatsappNumber: '5511991935863',
    whatsappMessage: 'Quero garantir meu desconto de 10%',
    animation: { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
};

// Init
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initScrollAnimations();
    initInstagramGallery();
    initNewsletter();
    initHeaderEffects();
    initMobileMenu();

    // Pop-up SEMPRE
    showPopupAlways();
});

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const header = document.querySelector('.site-header').offsetHeight;
            const top = target.getBoundingClientRect().top + window.pageYOffset - header;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileMenu();
        });
    });
}

// On-Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in-view'));
        }, CONFIG.animation);
        sections.forEach(s => io.observe(s));
    } else {
        const check = () => sections.forEach(s => {
            const r = s.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.85) s.classList.add('in-view');
        });
        window.addEventListener('scroll', check); check();
    }
}

// Instagram Gallery (setas + horizontal suave)
function initInstagramGallery() {
    const scrollContainer = document.querySelector('.insta-scroll');
    const btnLeft = document.querySelector('.insta-nav.left');
    const btnRight = document.querySelector('.insta-nav.right');
    if (!scrollContainer) return;

    const STEP = 300;
    btnLeft?.addEventListener('click', () => scrollContainer.scrollBy({ left: -STEP, behavior: 'smooth' }));
    btnRight?.addEventListener('click', () => scrollContainer.scrollBy({ left: STEP, behavior: 'smooth' }));

    // Scroll suave via wheel (touchpad)
    scrollContainer.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > 0 || e.shiftKey) return;
        e.preventDefault();
        scrollContainer.scrollBy({ left: e.deltaY * 2, behavior: 'smooth' });
    }, { passive: false });

    // Drag (desktop)
    let isDragging = false, startX, scrollLeft;
    scrollContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
        scrollContainer.style.cursor = 'grabbing';
        scrollContainer.style.userSelect = 'none';
    });
    scrollContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
    });
    scrollContainer.addEventListener('mouseup', () => {
        isDragging = false;
        scrollContainer.style.cursor = 'grab';
        scrollContainer.style.userSelect = 'auto';
    });
    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch (mobile)
    scrollContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    }, { passive: true });
    scrollContainer.addEventListener('touchmove', (e) => {
        if (startX == null) return;
        const x = e.touches[0].pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    }, { passive: true });
}

// Newsletter (cadastro fora do pop-up)
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const input = document.getElementById('email-input');
    const msg = document.getElementById('newsletter-msg');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const value = (input.value || '').trim();
        if (!value) {
            showMsg('Por favor, insira seu e-mail ou WhatsApp.', 'error');
            return;
        }

        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Cadastro newsletter: ' + value)}`;
        window.open(url, '_blank');

        showMsg('🎉 Cadastro iniciado! Complete pelo WhatsApp.', 'success');
        input.value = '';
    });

    function showMsg(text, type) {
        if (!msg) return;
        msg.textContent = text;
        msg.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
        msg.style.opacity = '1';
        setTimeout(() => msg.style.opacity = '0', 5000);
    }
}

// Header effects (hide/show)
function initHeaderEffects() {
    const header = document.querySelector('.site-header');
    let last = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        header.style.transform = (y > last && y > 100) ? 'translateY(-100%)' : 'translateY(0)';
        last = y;
    }, { passive: true });
}

// Mobile menu
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header-grid');

    const btn = document.createElement('button');
    btn.className = 'mobile-menu-btn';
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    btn.setAttribute('aria-label', 'Abrir menu');
    header.appendChild(btn);

    // estilos injetados
    const style = document.createElement('style');
    style.textContent = `
    .mobile-menu-btn{display:none;background:var(--gradient-terracotta);border:none;color:#fff;width:44px;height:44px;border-radius:12px;cursor:pointer;transition:.3s}
    @media (max-width:768px){
      .mobile-menu-btn{display:grid;place-items:center}
      .nav{position:absolute;top:100%;left:0;right:0;background:var(--cream);border-top:1px solid rgba(212,184,164,.2);box-shadow:var(--shadow-medium);opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .3s}
      .nav.active{opacity:1;visibility:visible;transform:translateY(0)}
      .nav ul.menu-right{flex-direction:column;padding:20px;gap:10px;justify-content:center}
      .nav a{display:block;padding:12px 20px;border-radius:8px}
    }`;
    document.head.appendChild(style);

    btn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const open = nav.classList.contains('active');
        btn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
}

function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const btn = document.querySelector('.mobile-menu-btn');
    if (nav && nav.classList.contains('active')) {
        nav.classList.remove('active');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-bars"></i>';
            btn.setAttribute('aria-label', 'Abrir menu');
        }
    }
}

/* ===========================
   POP-UP — SEMPRE AO ENTRAR
=========================== */
function showPopupAlways() {
    const popup = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('popupClose');
    const form = document.getElementById('popupForm');

    if (!popup) return;

    // Sempre exibe
    popup.style.display = 'flex';

    // Fechar
    closeBtn?.addEventListener('click', () => popup.style.display = 'none');
    popup.addEventListener('click', (e) => {
        if (!e.target.closest('.popup-card')) popup.style.display = 'none';
    });

    // Enviar
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = (document.getElementById('popupNome')?.value || '').trim();
        const email = (document.getElementById('popupEmail')?.value || '').trim();
        const telefone = (document.getElementById('popupTelefone')?.value || '').trim();

        const msg = `${CONFIG.whatsappMessage}\n\n👤 Nome: ${nome}\n📧 Email: ${email}\n📱 WhatsApp: ${telefone}`;
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');

        alert('Cadastro enviado! Complete pelo WhatsApp ✅');
        popup.style.display = 'none';
    });
}

console.log('⚡ Soul Eleven — scripts carregados.');

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".mobile-menu-btn");
    const logo = document.querySelector(".logo-img");

    if (!btn || !logo) return;

    const updateMenuPosition = () => {
        const leftOffset = logo.getBoundingClientRect().left;
        btn.style.marginLeft = leftOffset + "px";
    };

    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
});
