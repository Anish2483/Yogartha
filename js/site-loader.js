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
    if (!items || items.length === 0) return;
    const section = document.getElementById("gallery");
    const grid = document.getElementById("gallery-masonry");
    if (!section || !grid) return;

    grid.innerHTML = items.map(item => `
      <div class="gallery-masonry-item">
        <img src="${item.url}" alt="${item.caption || 'Yogartha'}" loading="lazy" />
        ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ""}
      </div>`).join("");

    section.style.display = "block"; // Show the section
  }

  // ---- Render Testimonials ----
  function renderTestimonials(list) {
    const grid = document.querySelector(".testimonials-grid");
    if (!grid || !list || list.length === 0) return;

    grid.innerHTML = list.map(t => {
      const avatarHtml = t.photo
        ? `<img class="author-avatar-img" src="${t.photo}" alt="${t.name}" />`
        : `<span class="author-avatar">${(t.name || "?")[0].toUpperCase()}</span>`;
      return `
        <div class="testi-card reveal">
          <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <p>"${t.review}"</p>
          <div class="testi-author">
            ${avatarHtml}
            <div><strong>${t.name}</strong><small>${t.role}</small></div>
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
      padding:10px 20px;font-size:.88rem;font-family:var(--font-sans);letter-spacing:.05em;position:relative;z-index:1000;`;
    bar.innerHTML = `<strong>${data.text}</strong>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#fff;font-size:1.1rem;
        cursor:pointer;position:absolute;right:16px;top:50%;transform:translateY(-50%);opacity:.7;">&times;</button>`;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // ---- Try Firebase ----
  function tryFirebase() {
    try {
      if (typeof firebase === "undefined" || !firebase.app) return false;
      const db = firebase.database();
      db.ref("schedule").once("value").then(s => { if (s.val()) renderSchedule(s.val()); }).catch(() => {});
      db.ref("gallery").once("value").then(s => {
        if (s.val()) {
          const items = Array.isArray(s.val()) ? s.val() : Object.values(s.val());
          renderGallery(items);
        }
      }).catch(() => {});
      db.ref("testimonials").once("value").then(s => {
        if (s.val()) renderTestimonials(Object.values(s.val()));
      }).catch(() => {});
      db.ref("announcement").once("value").then(s => { if (s.val()) renderAnnouncement(s.val()); }).catch(() => {});
      return true;
    } catch (e) { return false; }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!tryFirebase()) {
      console.log("Yogartha: Firebase not connected — using static content.");
    }
  });

})();
