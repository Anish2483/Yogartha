// ===== PAGE LOADER =====
window.addEventListener('load', () => {
 const loader = document.getElementById('loader');
 if (loader) {
 setTimeout(() => loader.classList.add('hidden'), 800);
 setTimeout(() => loader.remove(), 1400);
 }
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScrollState = false;
window.addEventListener('scroll', () => {
 const isScrolled = window.scrollY > 50;
 if (isScrolled !== lastScrollState) {
 if (navbar) navbar.classList.toggle('scrolled', isScrolled);
 lastScrollState = isScrolled;
 }
 const scrollTopBtn = document.getElementById('scrollTop');
 if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });

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
scrollTopBtn.innerHTML = '&#8593;';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(scrollTopBtn);

// ===== INTERSECTION OBSERVER (REVEAL) =====
const reveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const observer = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) entry.target.classList.add('visible');
 });
}, { threshold: 0.1 });
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
 db.ref("programs/" + programId + "/images").once("value").then(s => {
 const imgs = s.val();
 if (imgs) {
 if (imgs.hero) {
 const h = document.querySelector(".program-hero-bg img");
 if (h) h.src = imgs.hero;
 }
 if (imgs.overview) {
 const o = document.querySelector(".overview-image img");
 if (o) o.src = imgs.overview;
 }
 }
 }).catch(e => console.log("Firebase image load error:", e));
 }
 }
});
