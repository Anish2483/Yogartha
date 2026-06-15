// =====================================================
// YOGARTHA — Dynamic Site Loader v2
// Reads schedule, gallery, testimonials, announcement
// from Firebase and updates the live website.
// Falls back gracefully if Firebase not connected.
// =====================================================

(function () {

 // ---- Render Schedule ----
 function renderSchedule(data) {
 const wrap = document.querySelector(".schedule-table-wrap");
 const noteEl = document.querySelector(".schedule-note");
 if (!wrap || !data) return;

 const CLASS_COLORS = {
 "hatha yoga":"hatha","surya kriya":"surya","pranayama":"pranayama",
 "angamardhana":"angam","upa yoga":"yin","meditation":"med",
 "deep meditation":"med","—":"rest","":" rest"
 };
 function getClass(name) {
 if (!name || name === "—") return "rest";
 const lc = name.toLowerCase();
 for (const k of Object.keys(CLASS_COLORS)) { if (lc.includes(k)) return CLASS_COLORS[k]; }
 return "hatha";
 }

 let html = `<table class="schedule-table"><thead><tr><th>Day</th>`;
 (data.columns || []).forEach(c => html += `<th>${c}</th>`);
 html += `</tr></thead><tbody>`;
 (data.rows || []).forEach(row => {
 html += `<tr><td>${row.day}</td>`;
 (row.slots || []).forEach(slot => {
 html += `<td class="cls ${getClass(slot)}">${slot || "—"}</td>`;
 });
 html += `</tr>`;
 });
 html += `</tbody></table>`;
 wrap.innerHTML = html;
 if (noteEl && data.note) noteEl.textContent = data.note;
 }

 // ---- Render Gallery ----
 function renderGallery(items) {
 const section = document.getElementById("gallery");
 const grid = document.getElementById("gallery-masonry");
 const navLi = document.getElementById("nav-gallery-li");

 if (!section || !grid) return;

 if (!items || items.length === 0) {
 // No photos — hide section and nav link
 section.style.display = "none";
 if (navLi) navLi.style.display = "none";
 return;
 }

 const galleryHtml = items.map(item => `
 <div class="gallery-masonry-item">
 <img src="${item.url}" alt="${item.caption || 'Yogartha'}" loading="lazy" />
 ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ""}
 </div>`).join("");

 // Output twice inside the track for seamless infinite scrolling
 grid.innerHTML = `<div class="gallery-track" id="gallery-track">${galleryHtml}${galleryHtml}</div>`;

 section.style.display = "block"; // Show gallery section
 if (navLi) navLi.style.display = ""; // Show Gallery nav link

 // ---- Drag / Swipe / Auto-scroll on gallery ----
 initGalleryInteraction();
 }

 function initGalleryInteraction() {
 const container = document.getElementById("gallery-masonry");
 const track = document.getElementById("gallery-track");
 if (!container || !track) return;

 // JS controls scroll — disable CSS animation
 track.style.animation = "none";
 container.style.overflowX = "auto";
 container.style.scrollBehavior = "auto";
 container.style.cursor = "grab";
 container.style.scrollbarWidth = "none";
 container.style.msOverflowStyle = "none";

 let isDown = false, startX = 0, scrollLeft = 0;
 let isDragging = false;
 let resumeTimer = null;
 let rafId = null;

 // ---- Smooth auto-scroll via requestAnimationFrame ----
 let lastTime = null;
 const SPEED = 25; // px per second
 let exactScrollLeft = 0;

 function autoScroll(timestamp) {
 if (!isDragging) {
 if (lastTime !== null) {
 const delta = ((timestamp - lastTime) / 1000) * SPEED;
 exactScrollLeft += delta;
 // Seamless infinite loop
 if (exactScrollLeft >= track.scrollWidth / 2) {
 exactScrollLeft -= track.scrollWidth / 2;
 }
 container.scrollLeft = exactScrollLeft;
 }
 lastTime = timestamp;
 } else {
 lastTime = null; // reset so no jump when drag ends
 exactScrollLeft = container.scrollLeft; // sync exact position with manual drag
 }
 rafId = requestAnimationFrame(autoScroll);
 }
 rafId = requestAnimationFrame(autoScroll);

 function pauseDrag(resumeMs) {
 isDragging = true;
 clearTimeout(resumeTimer);
 resumeTimer = setTimeout(() => { isDragging = false; lastTime = null; }, resumeMs || 1800);
 }

 // ---- Mouse drag ----
 container.addEventListener("mousedown", e => {
 isDown = true;
 isDragging = true;
 clearTimeout(resumeTimer);
 container.style.cursor = "grabbing";
 startX = e.pageX - container.offsetLeft;
 scrollLeft = container.scrollLeft;
 });
 window.addEventListener("mouseup", () => {
 if (!isDown) return;
 isDown = false;
 container.style.cursor = "grab";
 pauseDrag(1800);
 });
 window.addEventListener("mousemove", e => {
 if (!isDown) return;
 e.preventDefault();
 const x = e.pageX - container.offsetLeft;
 const walk = (x - startX) * 1.6;
 container.scrollLeft = scrollLeft - walk;
 if (container.scrollLeft >= track.scrollWidth / 2) container.scrollLeft -= track.scrollWidth / 2;
 if (container.scrollLeft < 0) container.scrollLeft += track.scrollWidth / 2;
 });

 // ---- Touch swipe ----
 container.addEventListener("touchstart", e => {
 isDragging = true;
 clearTimeout(resumeTimer);
 startX = e.touches[0].pageX;
 scrollLeft = container.scrollLeft;
 }, { passive: true });
 container.addEventListener("touchmove", e => {
 const x = e.touches[0].pageX;
 const walk = (startX - x) * 1.4;
 container.scrollLeft = scrollLeft + walk;
 if (container.scrollLeft >= track.scrollWidth / 2) container.scrollLeft -= track.scrollWidth / 2;
 if (container.scrollLeft < 0) container.scrollLeft += track.scrollWidth / 2;
 }, { passive: true });
 container.addEventListener("touchend", () => pauseDrag(2000));
 }

 // ---- Render Testimonials ----
 function renderTestimonials(list) {
 const grid = document.querySelector(".testimonials-grid");
 // If Firebase has no data, keep the static HTML cards intact
 if (!grid || !list || list.length === 0) return;

 grid.innerHTML = list.map(t => {
 const avatarHtml = t.photo
 ? `<img class="author-avatar-img" src="${t.photo}" alt="${t.name}" />`
 : `<span class="author-avatar">${(t.name || "?")[0].toUpperCase()}</span>`;
 const stars = parseInt(t.stars) || 5;
 const starHtml = Array(stars).fill('&#9733;').join('') + Array(5 - stars).fill('&#9734;').join('');
 const sourceBadge = (t.source === 'google') ? `<div class="review-source-badge"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>Google Review</div>` : '';
 return `
 <div class="testi-card reveal visible">
 ${sourceBadge}
 <div class="stars">${starHtml}</div>
 <p>"${t.review}"</p>
 <div class="testi-author">
 ${avatarHtml}
 <div><strong>${t.name}</strong><small>${t.role || ''}</small></div>
 </div>
 </div>`;
 }).join("");
 }

 // ---- Render Announcement ----
 function renderAnnouncement(data) {
 if (!data || !data.text || !data.active) return;
 const existing = document.getElementById("yogartha-announcement");
 if (existing) existing.remove();
 const bar = document.createElement("div");
 bar.id = "yogartha-announcement";
 // Modern floating bottom banner to avoid menu interference
 bar.style.cssText = `background:linear-gradient(90deg,var(--maroon),var(--saffron));color:#fff;text-align:center;
 padding:14px 48px 14px 24px;font-size:.95rem;font-family:var(--font-sans, sans-serif);letter-spacing:.05em;
 position:fixed;bottom:24px;left:50%;transform:translateX(-50%);width:90%;max-width:500px;
 border-radius:50px;box-shadow:0 8px 32px rgba(0,0,0,0.25);z-index:9999;font-weight:500;`;
 bar.innerHTML = `<span>${data.text}</span>
 <button onclick="document.getElementById('yogartha-announcement').remove()" aria-label="Close Announcement" style="background:none;border:none;color:#fff;font-size:1.5rem;
 cursor:pointer;position:absolute;right:16px;top:50%;transform:translateY(-50%);opacity:.9;line-height:1;padding:4px;">&times;</button>`;
 document.body.appendChild(bar);
 }

 // ---- Try Firebase ----
 function tryFirebase() {
 try {
 if (typeof firebase === "undefined" || !firebase.app) return false;
 const db = firebase.database();
 db.ref("schedule").once("value").then(s => { if (s.val()) renderSchedule(s.val()); }).catch(() => {});
 
 const pageId = document.body.getAttribute("data-page-id") || "home";
 const galleryRef = pageId === "home" ? "gallery" : ("gallery_" + pageId.replace(/-/g, "_"));
 db.ref(galleryRef).once("value").then(s => {
 if (s.val()) {
 const items = Array.isArray(s.val()) ? s.val() : Object.values(s.val());
 renderGallery(items);
 }
 }).catch(() => {});
 
 db.ref("testimonials").once("value").then(s => {
 if (s.val()) renderTestimonials(Object.values(s.val()));
 }).catch(() => { /* keep static reviews on permission error */ });
 db.ref("announcement").once("value").then(s => { if (s.val()) renderAnnouncement(s.val()); }).catch(() => {});
 db.ref("siteImages").once("value").then(s => {
 const imgs = s.val();
 if (imgs) {
 // Hero: preload image silently first, then swap — eliminates flash of old image
 if (imgs.hero) {
   const h = document.querySelector(".hero-img");
   if (h && imgs.hero !== h.src) {
     const preload = new Image();
     preload.onload = () => { h.src = imgs.hero; };
     preload.src = imgs.hero;
   }
 }
 if (imgs.about) { const a = document.querySelector(".about-img"); if (a) a.src = imgs.about; }
 if (imgs.sadhguru){const sg = document.querySelector(".sadhguru-photo"); if (sg) sg.src = imgs.sadhguru; }
 if (imgs.guru) { const g = document.querySelector(".guru-img"); if (g) g.src = imgs.guru; }
 if (imgs.shala) { const sh = document.querySelector(".experience-img"); if (sh) sh.src = imgs.shala; }
 if (imgs.symbol) { document.querySelectorAll(".site-symbol").forEach(el => el.src = imgs.symbol); }
 }
 }).catch(() => {});
 db.ref("teacher").once("value").then(s => {
 const t = s.val();
 if (t) {
 if (t.name) { const el = document.querySelector(".guru-name"); if (el) el.textContent = t.name; }
 if (t.title) { const el = document.querySelector(".guru-title"); if (el) el.textContent = t.title; }
 if (t.intro) { const el = document.querySelector(".guru-intro"); if (el) el.textContent = t.intro; }
 if (t.bio) { const el = document.querySelector(".guru-bio"); if (el) el.textContent = t.bio; }
 }
 }).catch(() => {});
 return true;
 } catch (e) { return false; }
 }

 // ---- Apply data-fallback to any images still showing placeholder ----
 function applyFallbackImages() {
 document.querySelectorAll('img[data-fallback]').forEach(img => {
 const rawSrc = img.getAttribute('src') || '';
 // If src is empty or still the transparent GIF placeholder
 const isPlaceholder = !rawSrc ||
 rawSrc.startsWith('data:image/gif;base64,R0lGODlhAQABAA') ||
 rawSrc === '' || rawSrc === 'about:blank';
 if (isPlaceholder) {
 img.src = img.getAttribute('data-fallback');
 }
 });
 }

 document.addEventListener("DOMContentLoaded", () => {
 // Apply local fallback images immediately so they show while Firebase loads
 applyFallbackImages();
 if (!tryFirebase()) {
 console.log("Yogartha: Firebase not connected — using static content.");
 }
 // Also apply fallbacks after a small delay to catch any Firebase-overridden ones
 // that might not have been in siteImages
 setTimeout(applyFallbackImages, 2500);
 });

})();

// =====================================================
// CONTACT FORM — Firebase Enquiry Submission
// Saves to Firebase Realtime DB under /enquiries
// =====================================================
function submitEnquiry(e) {
 e.preventDefault();

 const btn = document.getElementById("submitBtn");
 const note = document.getElementById("form-note");
 const form = document.getElementById("contactForm");

 const data = {
 name: document.getElementById("name").value.trim(),
 email: document.getElementById("email").value.trim(),
 phone: document.getElementById("phone").value.trim(),
 program: document.getElementById("program").value,
 message: document.getElementById("message").value.trim(),
 timestamp: new Date().toISOString(),
 read: false
 };

 // --- Loading state ---
 btn.disabled = true;
 btn.textContent = "Sending…";
 note.style.color = "";
 note.textContent = "Please wait…";

 // --- Check Firebase is live ---
 if (typeof firebase === "undefined" || !firebase.app) {
 // Firebase not connected — show friendly message, don't lose the lead
 btn.disabled = false;
 btn.textContent = "Send Enquiry →";
 note.style.color = "#e07020";
 note.textContent = "⚠️ Could not connect right now. Please WhatsApp or call us directly!";
 return;
 }

 firebase.database().ref("enquiries").push(data)
 .then(() => {
 // Success state
 form.reset();
 btn.textContent = "Sent! 🙏";
 btn.style.background = "linear-gradient(135deg,#2E7D32,#43A047)";
 note.style.color = "#43A047";
 note.textContent = "✓ Your enquiry has been received. Reeta will reach out within 24 hours. Namaste!";
 // Reset button after 5 seconds
 setTimeout(() => {
 btn.disabled = false;
 btn.textContent = "Send Enquiry →";
 btn.style.background = "";
 note.style.color = "";
 note.textContent = "Reeta personally responds within 24 hours. Namaste!";
 }, 5000);
 })
 .catch((err) => {
 console.error("Enquiry error:", err);
 btn.disabled = false;
 btn.textContent = "Send Enquiry →";
 note.style.color = "#c0392b";
 note.textContent = "Something went wrong. Please try again or contact us directly.";
 });
}
