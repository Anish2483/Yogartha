// ===== PARALLAX HERO =====
const heroBg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
 if (heroBg && window.scrollY < window.innerHeight) {
 heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
 }
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
 const target = parseInt(el.textContent);
 const suffix = el.textContent.replace(/[0-9]/g, '');
 let count = 0;
 const step = Math.ceil(target / 60);
 const timer = setInterval(() => {
 count = Math.min(count + step, target);
 el.textContent = count + suffix;
 if (count >= target) clearInterval(timer);
 }, 25);
}

const statObserver = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
 statObserver.unobserve(entry.target);
 }
 });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statObserver.observe(statsSection);

// ===== SCHEDULE TABLE HOVER ROWS =====
document.querySelectorAll('.schedule-table tbody tr').forEach(row => {
 row.addEventListener('mouseenter', () => row.style.background = 'rgba(232,114,42,0.05)');
 row.addEventListener('mouseleave', () => row.style.background = '');
});

// ===== TYPEWRITER EFFECT FOR HERO TAGLINE =====
const tagline = document.querySelector('.hero-tagline');
if (tagline) {
 const text = tagline.innerHTML;
 tagline.innerHTML = '';
 let i = 0;
 setTimeout(() => {
 const interval = setInterval(() => {
 tagline.innerHTML = text.slice(0, i++);
 if (i > text.length) clearInterval(interval);
 }, 30);
 }, 1000);
}

// ===== OFFERING CARD TILT =====
document.querySelectorAll('.offering-card').forEach(card => {
 card.addEventListener('mousemove', (e) => {
 const rect = card.getBoundingClientRect();
 const x = (e.clientX - rect.left) / rect.width - 0.5;
 const y = (e.clientY - rect.top) / rect.height - 0.5;
 card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
 });
 card.addEventListener('mouseleave', () => {
 card.style.transform = '';
 });
});
