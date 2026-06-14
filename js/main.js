// ===== PAGE LOADER =====
window.addEventListener('load', () => {
 const loader = document.getElementById('loader');
 if (loader) {
 setTimeout(() => loader.classList.add('hidden'), 800); // Shorter delay since it was already visible
 setTimeout(() => loader.remove(), 1400);
 }
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScrollState = false;
window.addEventListener('scroll', () => {
 const isScrolled = window.scrollY > 50;
 if (isScrolled !== lastScrollState) {
 if (isScrolled) {
 navbar.classList.add('scrolled');
 } else {
 navbar.classList.remove('scrolled');
 }
 lastScrollState = isScrolled;
 }
 const scrollTopBtn = document.getElementById('scrollTop');
 if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function openNav() {
 navLinks.classList.add('open');
 hamburger.classList.add('active');
 document.body.style.overflow = 'hidden'; // prevent background scroll
}
function closeNav() {
 navLinks.classList.remove('open');
 hamburger.classList.remove('active');
 document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
 navLinks.classList.contains('open') ? closeNav() : openNav();
});
// Close when tapping a link
navLinks?.querySelectorAll('a').forEach(link => {
 link.addEventListener('click', closeNav);
});
// Close when tapping the dark overlay area (outside the menu items)
navLinks?.addEventListener('click', (e) => {
 if (e.target === navLinks) closeNav();
});

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTop';
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(scrollTopBtn);

// ===== INTERSECTION OBSERVER (REVEAL) =====
const reveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('visible');
 }
 });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK ON SCROLL (OPTIMIZED) =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

// Use IntersectionObserver instead of a heavy scroll event
const navObserverOptions = {
 root: null,
 rootMargin: '-120px 0px -40% 0px',
 threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 const currentId = entry.target.getAttribute('id');
 navAnchors.forEach(a => {
 a.classList.remove('active-link');
 if (a.getAttribute('href') === '#' + currentId) {
 a.classList.add('active-link');
 }
 });
 }
 });
}, navObserverOptions);

sections.forEach(sec => navObserver.observe(sec));

// ===== FORM SUBMISSION =====
function handleFormSubmit(e) {
 e.preventDefault();
 const form = document.getElementById('contactForm');
 const wrap = document.querySelector('.contact-form-wrap');
 const name = document.getElementById('name').value || 'Friend';
 wrap.innerHTML = `
 <div class="form-success">
 <span class="success-icon">🙏</span>
 <h3>Namaste, ${name}!</h3>
 <p>Thank you for reaching out to Yogartha. We have received your enquiry and will get back to you within 24 hours.</p>
 <p style="margin-top:12px; font-size:0.85rem; color:var(--saffron)">May your practice deepen and your inner peace flourish.</p>
 </div>
 `;
}

// ===== SMOOTH ACTIVE LINK STYLE =====
const style = document.createElement('style');
style.textContent = `.nav-links a.active-link { color: var(--saffron-light) !important; }`;
document.head.appendChild(style);
