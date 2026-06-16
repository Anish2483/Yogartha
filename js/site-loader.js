// =====================================================
// YOGARTHA — Site Loader v3
// Uses YG connection manager (firebase-config.js).
// All Firebase reads are: batched, cached, retry-safe.
// Falls back gracefully to static HTML if offline.
// =====================================================

(function () {

 // ---- Render Schedule ----
 function renderSchedule(data) {
  const wrap = document.querySelector(".schedule-table-wrap");
  const noteEl = document.querySelector(".schedule-note");
  if (!wrap || !data) return;

  const CLASS_COLORS = {
   "hatha yoga": "hatha", "surya kriya": "surya", "pranayama": "pranayama",
   "angamardhana": "angam", "upa yoga": "yin", "meditation": "med",
   "deep meditation": "med", "—": "rest", "": "rest"
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
   section.style.display = "none";
   if (navLi) navLi.style.display = "none";
   return;
  }
  const galleryHtml = items.map(item => `
  <div class="gallery-masonry-item">
   <img src="${item.url}" alt="${item.caption || 'Yogartha'}" loading="lazy" decoding="async" />
   ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ""}
  </div>`).join("");

  grid.innerHTML = `<div class="gallery-track" id="gallery-track">${galleryHtml}${galleryHtml}</div>`;
  section.style.display = "block";
  if (navLi) navLi.style.display = "";
  initGalleryInteraction();
 }

 // ---- Gallery drag / swipe / auto-scroll ----
 function initGalleryInteraction() {
  const container = document.getElementById("gallery-masonry");
  const track = document.getElementById("gallery-track");
  if (!container || !track) return;

  track.style.animation = "none";
  container.style.overflowX = "auto";
  container.style.scrollBehavior = "auto";
  container.style.cursor = "grab";
  container.style.scrollbarWidth = "none";
  container.style.msOverflowStyle = "none";

  let isDown = false, startX = 0, scrollLeft = 0;
  let isDragging = false, resumeTimer = null, rafId = null;
  let lastTime = null, exactScrollLeft = 0;
  const SPEED = 25; // px per second

  function autoScroll(ts) {
   if (!isDragging) {
    if (lastTime !== null) {
     const delta = ((ts - lastTime) / 1000) * SPEED;
     exactScrollLeft += delta;
     if (exactScrollLeft >= track.scrollWidth / 2) exactScrollLeft -= track.scrollWidth / 2;
     container.scrollLeft = exactScrollLeft;
    }
    lastTime = ts;
   } else {
    lastTime = null;
    exactScrollLeft = container.scrollLeft;
   }
   rafId = requestAnimationFrame(autoScroll);
  }
  rafId = requestAnimationFrame(autoScroll);

  function pauseDrag(resumeMs) {
   isDragging = true;
   clearTimeout(resumeTimer);
   resumeTimer = setTimeout(() => { isDragging = false; lastTime = null; }, resumeMs || 1800);
  }

  container.addEventListener("mousedown", e => {
   isDown = true; isDragging = true;
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
  container.addEventListener("touchstart", e => {
   isDragging = true; clearTimeout(resumeTimer);
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
  if (!grid || !list || list.length === 0) return;
  grid.innerHTML = list.map(t => {
   const avatarHtml = t.photo
    ? `<img class="author-avatar-img" src="${t.photo}" alt="${t.name}" loading="lazy" />`
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
  bar.style.cssText = `background:linear-gradient(90deg,var(--maroon),var(--saffron));color:#fff;text-align:center;
  padding:14px 48px 14px 24px;font-size:.95rem;font-family:var(--font-sans,sans-serif);letter-spacing:.05em;
  position:fixed;bottom:24px;left:50%;transform:translateX(-50%);width:90%;max-width:500px;
  border-radius:50px;box-shadow:0 8px 32px rgba(0,0,0,0.25);z-index:9999;font-weight:500;`;
  bar.innerHTML = `<span>${data.text}</span>
  <button onclick="document.getElementById('yogartha-announcement').remove()" aria-label="Close Announcement"
   style="background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;position:absolute;
   right:16px;top:50%;transform:translateY(-50%);opacity:.9;line-height:1;padding:4px;">&times;</button>`;
  document.body.appendChild(bar);
 }

 // ---- Apply hero / about / guru images from Firebase ----
 function applyImages(imgs) {
  if (!imgs) return;
  function preloadAndSet(newUrl, setter) {
   const img = new Image();
   img.onload = setter;
   img.src = newUrl;
  }
  if (imgs.hero_desktop) {
   const el = document.getElementById("hero-src-desktop");
   if (el && imgs.hero_desktop !== el.src) preloadAndSet(imgs.hero_desktop, () => { el.src = imgs.hero_desktop; });
  }
  if (imgs.hero_tablet) {
   const el = document.getElementById("hero-src-tablet");
   if (el && imgs.hero_tablet !== el.getAttribute("srcset")) preloadAndSet(imgs.hero_tablet, () => { el.srcset = imgs.hero_tablet; });
  }
  if (imgs.hero_mobile) {
   const el = document.getElementById("hero-src-mobile");
   if (el && imgs.hero_mobile !== el.getAttribute("srcset")) preloadAndSet(imgs.hero_mobile, () => { el.srcset = imgs.hero_mobile; });
  }
  // Legacy single hero key fallback
  if (!imgs.hero_desktop && !imgs.hero_tablet && !imgs.hero_mobile && imgs.hero) {
   const desktop = document.getElementById("hero-src-desktop");
   const tablet  = document.getElementById("hero-src-tablet");
   const mobile  = document.getElementById("hero-src-mobile");
   if (desktop && imgs.hero !== desktop.src) preloadAndSet(imgs.hero, () => {
    if (desktop) desktop.src = imgs.hero;
    if (tablet)  tablet.srcset = imgs.hero;
    if (mobile)  mobile.srcset = imgs.hero;
   });
  }
  if (imgs.about)    { const a  = document.querySelector(".about-img");      if (a)  a.src  = imgs.about; }
  if (imgs.sadhguru) { const sg = document.querySelector(".sadhguru-photo"); if (sg) sg.src = imgs.sadhguru; }
  if (imgs.guru)     { const g  = document.querySelector(".guru-img");       if (g)  g.src  = imgs.guru; }
  if (imgs.shala)    { const sh = document.querySelector(".experience-img"); if (sh) sh.src = imgs.shala; }
  if (imgs.symbol)   { document.querySelectorAll(".site-symbol").forEach(el => el.src = imgs.symbol); }
 }

 // ---- Apply teacher data ----
 function applyTeacher(t) {
  if (!t) return;
  if (t.name)  { const el = document.querySelector(".guru-name");  if (el) el.textContent = t.name; }
  if (t.title) { const el = document.querySelector(".guru-title"); if (el) el.textContent = t.title; }
  if (t.intro) { const el = document.querySelector(".guru-intro"); if (el) el.textContent = t.intro; }
  if (t.bio)   { const el = document.querySelector(".guru-bio");   if (el) el.textContent = t.bio; }
 }

 // ---- Apply data-fallback to placeholder images ----
 function applyFallbackImages() {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
   const rawSrc = img.getAttribute('src') || '';
   const isPlaceholder = !rawSrc ||
    rawSrc.startsWith('data:image/gif;base64,R0lGODlhAQABAA') ||
    rawSrc === '' || rawSrc === 'about:blank';
   if (isPlaceholder) img.src = img.getAttribute('data-fallback');
  });
 }

 // ---- Main loader — batched Firebase reads via YG connection manager ----
 function loadFromFirebase() {
  if (typeof YG === "undefined") {
   console.warn("Yogartha: YG not available — static content only.");
   return;
  }

  const pageId = document.body.getAttribute("data-page-id") || "home";
  const galleryPath = pageId === "home" ? "gallery" : ("programs/" + pageId + "/gallery");

  // Fire all reads in parallel — YG.get() handles cache + retry
  Promise.allSettled([
   YG.get("schedule"),
   YG.get(galleryPath),
   YG.get("testimonials"),
   YG.get("announcement"),
   YG.get("siteImages"),
   YG.get("teacher"),
  ]).then(([schedule, gallery, testimonials, announcement, siteImages, teacher]) => {
   if (schedule.value)      renderSchedule(schedule.value);
   if (gallery.value) {
    const items = Array.isArray(gallery.value) ? gallery.value : Object.values(gallery.value);
    renderGallery(items);
   }
   if (testimonials.value)  renderTestimonials(Object.values(testimonials.value));
   if (announcement.value)  renderAnnouncement(announcement.value);
   if (siteImages.value)    applyImages(siteImages.value);
   if (teacher.value)       applyTeacher(teacher.value);
  });

  // Monitor connection state — show/hide offline banner
  YG.monitorConnection(
   () => { const b = document.getElementById("ygOfflineBanner"); if (b) b.remove(); },
   () => {
    if (!document.getElementById("ygOfflineBanner")) {
     const b = document.createElement("div");
     b.id = "ygOfflineBanner";
     b.style.cssText = "position:fixed;bottom:0;left:0;right:0;background:#b71c1c;color:#fff;" +
      "text-align:center;padding:10px 16px;font-size:0.85rem;z-index:99999;" +
      "font-family:var(--font-sans,sans-serif);letter-spacing:0.05em;";
     b.textContent = "⚠️ You appear to be offline. Some content may not load.";
     document.body.appendChild(b);
    }
   }
  );
 }

 document.addEventListener("DOMContentLoaded", () => {
  applyFallbackImages();
  loadFromFirebase();
  // Re-apply fallbacks after Firebase images have had time to load
  setTimeout(applyFallbackImages, 2500);
 });

})();

// =====================================================
// CONTACT FORM — Firebase Enquiry Submission
// Uses YG connection manager for status awareness.
// =====================================================
function submitEnquiry(e) {
 e.preventDefault();

 const btn  = document.getElementById("submitBtn");
 const note = document.getElementById("form-note");
 const form = document.getElementById("contactForm");

 const data = {
  name:      document.getElementById("name").value.trim(),
  email:     document.getElementById("email").value.trim(),
  phone:     document.getElementById("phone").value.trim(),
  program:   document.getElementById("program").value,
  message:   document.getElementById("message").value.trim(),
  timestamp: new Date().toISOString(),
  read: false
 };

 btn.disabled = true;
 btn.textContent = "Sending…";
 note.style.color = "";
 note.textContent = "Please wait…";

 // Offline guard
 if (typeof YG !== "undefined" && !YG.isOnline()) {
  btn.disabled = false;
  btn.textContent = "Send Enquiry →";
  note.style.color = "#e07020";
  note.textContent = "⚠️ You appear to be offline. Please try again or contact us directly.";
  return;
 }

 if (typeof firebase === "undefined" || !firebase.apps || !firebase.apps.length) {
  btn.disabled = false;
  btn.textContent = "Send Enquiry →";
  note.style.color = "#e07020";
  note.textContent = "⚠️ Could not connect right now. Please WhatsApp or call us directly!";
  return;
 }

 firebase.database().ref("enquiries").push(data)
  .then(() => {
   form.reset();
   btn.textContent = "Sent! 🙏";
   btn.style.background = "linear-gradient(135deg,#2E7D32,#43A047)";
   note.style.color = "#43A047";
   note.textContent = "✓ Your enquiry has been received. Reeta will reach out within 24 hours. Namaste!";
   // Invalidate enquiries cache so admin panel sees fresh data
   if (typeof YG !== "undefined") YG.invalidate("enquiries");
   setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "Send Enquiry →";
    btn.style.background = "";
    note.style.color = "";
    note.textContent = "Reeta personally responds within 24 hours. Namaste!";
   }, 5000);
  })
  .catch(err => {
   console.error("Enquiry error:", err);
   btn.disabled = false;
   btn.textContent = "Send Enquiry →";
   note.style.color = "#c0392b";
   note.textContent = "Something went wrong. Please try again or contact us directly.";
  });
}
