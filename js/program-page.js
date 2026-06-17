// ===== PAGE LOADER =====
window.addEventListener('load', () => {
 const loader = document.getElementById('loader');
 if (loader) {
 setTimeout(() => loader.classList.add('hidden'), 800);
 setTimeout(() => loader.remove(), 1400);
 }
});

// ===== NAVBAR SCROLL =====
// Since program pages should have a permanently dark navbar, we keep it styled
// with the .navbar class directly. No scroll‑based class toggling is needed.
const navbar = document.getElementById('navbar'); // kept for other logic only
let lastScrollState = false;
window.addEventListener('scroll', () => {
 const isScrolled = window.scrollY > 50;
 // Intentionally NOT toggling .scrolled class – navbar is always dark.
 lastScrollState = isScrolled;

 const scrollTopBtn = document.getElementById('scrollTop');
 if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Create a backdrop element to close menu when tapping outside
const navBackdrop = document.createElement('div');
navBackdrop.id = 'nav-backdrop';
navBackdrop.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.2);';
document.body.appendChild(navBackdrop);

function openNav() {
 navLinks.classList.add('open');
 hamburger.classList.add('active');
 navBackdrop.style.display = 'block';
}
function closeNav() {
 navLinks.classList.remove('open');
 hamburger.classList.remove('active');
 navBackdrop.style.display = 'none';
}

hamburger?.addEventListener('click', () => {
 navLinks.classList.contains('open') ? closeNav() : openNav();
});
navLinks?.querySelectorAll('a').forEach(link => {
 link.addEventListener('click', closeNav);
});
navBackdrop.addEventListener('click', closeNav);

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTop';
scrollTopBtn.innerHTML = '&#8593;';
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

// ===== FIREBASE IMAGE LOADER =====
window.addEventListener('DOMContentLoaded', () => {
 if (typeof firebase !== 'undefined' && firebase.app) {
 const db = firebase.database();

 // Get program ID from URL (e.g. "surya-kriya" from "/programs/surya-kriya.html")
 let pathname = window.location.pathname;
 let filename = pathname.split('/').pop() || '';
 let programId = filename.replace('.html', '');

 if (programId && programId !== 'index' && programId !== 'admin') {
  db.ref('siteImages').once('value').then(s => {
   const imgs = s.val();
   if (!imgs) return;
   const pid = programId.replace(/-/g, '_');

   // --- Hero images: device-specific crops ---
   const desktopUrl = imgs['prog_' + pid + '_desktop'];
   const tabletUrl  = imgs['prog_' + pid + '_tablet'];
   const mobileUrl  = imgs['prog_' + pid + '_mobile'];

   const heroDesktop = document.getElementById('prog-hero-desktop');
   const heroTablet  = document.getElementById('prog-hero-tablet');
   const heroMobile  = document.getElementById('prog-hero-mobile');

   if (desktopUrl && heroDesktop) heroDesktop.src = desktopUrl;
   if (tabletUrl  && heroTablet)  heroTablet.srcset  = tabletUrl;
   if (mobileUrl  && heroMobile)  heroMobile.srcset  = mobileUrl;

   // Fallback: if no device-specific crops uploaded yet, use desktop for all
   if (desktopUrl && !tabletUrl && heroTablet) heroTablet.srcset = desktopUrl;
   if (desktopUrl && !mobileUrl && heroMobile) heroMobile.srcset = desktopUrl;

   // --- Overview / side image ---
   const overviewUrl = imgs['prog_' + pid + '_overview'];
   if (overviewUrl) {
    const o = document.querySelector('.overview-image img');
    if (o) o.src = overviewUrl;
   }
  }).catch(e => console.log('Firebase image load error:', e));
 }
 }
});
