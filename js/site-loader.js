// =====================================================
// YOGARTHA — Dynamic Schedule + Testimonial Loader
// Reads from Firebase and updates the live website
// Falls back to static HTML if Firebase unavailable
// =====================================================

(function () {
  // ---- Default static data (fallback if Firebase not connected) ----
  const DEFAULT_SCHEDULE = {
    columns: ["6:00 AM", "8:00 AM", "5:30 PM", "7:00 PM"],
    rows: [
      { day: "Monday",    slots: ["Hatha Yoga","Pranayama","Hatha Yoga","Meditation"] },
      { day: "Tuesday",   slots: ["Surya Kriya","Angamardhana","Upa Yoga","Pranayama"] },
      { day: "Wednesday", slots: ["Hatha Yoga","Pranayama","Hatha Yoga","Meditation"] },
      { day: "Thursday",  slots: ["Surya Kriya","Angamardhana","Upa Yoga","Hatha Yoga"] },
      { day: "Friday",    slots: ["Hatha Yoga","Pranayama","Surya Kriya","Meditation"] },
      { day: "Saturday",  slots: ["Surya Kriya","Hatha Yoga","Angamardhana","Meditation"] },
      { day: "Sunday",    slots: ["Deep Meditation","Hatha Yoga","—","—"] }
    ],
    note: "*Reeta teaches all weekday morning batches. Guest instructors on evenings & weekends."
  };

  const CLASS_COLORS = {
    "Hatha Yoga": "hatha", "Surya Kriya": "surya", "Pranayama": "pranayama",
    "Angamardhana": "angam", "Upa Yoga": "yin", "Meditation": "med",
    "Deep Meditation": "med", "Bhuta Shuddhi": "hatha", "Yogasanas": "surya",
    "—": "rest", "": "rest"
  };

  function getClass(name) {
    if (!name || name === "—") return "rest";
    for (const key of Object.keys(CLASS_COLORS)) {
      if (name.toLowerCase().includes(key.toLowerCase())) return CLASS_COLORS[key];
    }
    return "hatha";
  }

  function renderSchedule(data) {
    const wrap = document.querySelector(".schedule-table-wrap");
    const noteEl = document.querySelector(".schedule-note");
    if (!wrap) return;

    const cols = data.columns || DEFAULT_SCHEDULE.columns;
    const rows = data.rows || DEFAULT_SCHEDULE.rows;
    const note = data.note || DEFAULT_SCHEDULE.note;

    let html = `<table class="schedule-table"><thead><tr><th>Day</th>`;
    cols.forEach(c => html += `<th>${c}</th>`);
    html += `</tr></thead><tbody>`;

    rows.forEach(row => {
      html += `<tr><td>${row.day}</td>`;
      row.slots.forEach(slot => {
        const cls = getClass(slot);
        html += `<td class="cls ${cls}">${slot || "—"}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    wrap.innerHTML = html;
    if (noteEl) noteEl.textContent = note;
  }

  function renderTestimonials(list) {
    const grid = document.querySelector(".testimonials-grid");
    if (!grid || !list || list.length === 0) return;

    grid.innerHTML = list.map(t => `
      <div class="testi-card reveal">
        <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p>"${t.review}"</p>
        <div class="testi-author">
          <span class="author-avatar">${(t.name || "?")[0].toUpperCase()}</span>
          <div><strong>${t.name}</strong><small>${t.role}</small></div>
        </div>
      </div>`).join("");
  }

  function renderAnnouncement(data) {
    if (!data || !data.text || !data.active) return;
    const existing = document.getElementById("yogartha-announcement");
    if (existing) existing.remove();

    const bar = document.createElement("div");
    bar.id = "yogartha-announcement";
    bar.style.cssText = `
      background: linear-gradient(90deg, var(--maroon), var(--saffron));
      color: #fff; text-align: center; padding: 10px 20px;
      font-size: 0.88rem; font-family: var(--font-sans);
      letter-spacing: 0.05em; position: relative; z-index: 1000;`;
    bar.innerHTML = `<strong>${data.text}</strong>
      <button onclick="this.parentElement.remove()" style="
        background:none;border:none;color:#fff;font-size:1.1rem;
        cursor:pointer;position:absolute;right:16px;top:50%;
        transform:translateY(-50%);opacity:0.7;">&times;</button>`;
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // ---- Try to load from Firebase ----
  function tryFirebase() {
    try {
      if (typeof firebase === "undefined" || !firebase.app) return false;
      const db = firebase.database();

      db.ref("schedule").once("value").then(snap => {
        const data = snap.val();
        if (data) renderSchedule(data);
      }).catch(() => {});

      db.ref("testimonials").once("value").then(snap => {
        const data = snap.val();
        if (data) renderTestimonials(Object.values(data));
      }).catch(() => {});

      db.ref("announcement").once("value").then(snap => {
        const data = snap.val();
        if (data) renderAnnouncement(data);
      }).catch(() => {});

      return true;
    } catch (e) { return false; }
  }

  // Run on page load
  document.addEventListener("DOMContentLoaded", () => {
    if (!tryFirebase()) {
      // Firebase not set up yet — use static fallback (current HTML stays as-is)
      console.log("Yogartha: Firebase not connected. Using static schedule.");
    }
  });
})();
