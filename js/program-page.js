// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.createElement('div');
  loader.id = 'loader';
  loader.innerHTML = `
    <div class="loader-text" style="font-size: 2rem; margin-bottom: 20px;">Yogartha</div>
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  `;
  document.body.prepend(loader);
  setTimeout(() => loader.classList.add('hidden'), 1400);
  setTimeout(() => loader.remove(), 2000);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
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
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));
