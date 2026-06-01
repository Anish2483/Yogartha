// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = `
    <img src="images/yogartha_logo.png" alt="Yogartha" class="loader-logo-img" />
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  `;
  document.body.prepend(loader);
  setTimeout(() => loader.classList.add('hidden'), 1600);
  setTimeout(() => loader.remove(), 2200);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

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
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active-link');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active-link');
  });
});

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
