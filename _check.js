
// ============ YOGARTHA ADMIN v7 — Mobile + Desktop ============

let schedule = {
 columns:["6:00 AM","8:00 AM","5:30 PM","7:00 PM"],
 rows:[
 {day:"Monday", slots:["Hatha Yoga","Pranayama","Hatha Yoga","Meditation"]},
 {day:"Tuesday", slots:["Surya Kriya","Angamardhana","Upa Yoga","Pranayama"]},
 {day:"Wednesday", slots:["Hatha Yoga","Pranayama","Hatha Yoga","Meditation"]},
 {day:"Thursday", slots:["Surya Kriya","Angamardhana","Upa Yoga","Hatha Yoga"]},
 {day:"Friday", slots:["Hatha Yoga","Pranayama","Surya Kriya","Meditation"]},
 {day:"Saturday", slots:["Surya Kriya","Hatha Yoga","Angamardhana","Meditation"]},
 {day:"Sunday", slots:["Deep Meditation","Hatha Yoga","—","—"]}
 ],
 note:"*Reeta teaches all weekday morning batches. Guest instructors on evenings & weekends."
};
let testimonials = [
 {id:1,name:"Ananya Sharma",role:"Software Engineer",photo:"",review:"Reeta's Hatha Yoga classes are unlike anything I've experienced. My back pain of 5 years is gone."},
 {id:2,name:"Rahul Mehta",role:"Entrepreneur, Haridwar",photo:"",review:"I came skeptical and left transformed. The Surya Kriya program changed my energy levels completely."},
 {id:3,name:"Priya Nair",role:"Educator, Mussoorie",photo:"",review:"The Himalayan retreat was the most profound experience of my life. I returned completely renewed."},
 {id:4,name:"Vikram Joshi",role:"Architect, Rishikesh",photo:"",review:"Finding Yogartha was a blessing. Reeta brings the authentic depth of the Isha tradition."}
];
let gallery = [];
let announcement = {active:false, text:""};
let isFirebase = false;
let imgbbKey = "";
let pendingTestiPhotoUrl = "";

// ---- MOBILE NAV ----
function toggleSidebar() {
 const sidebar = document.getElementById("sidebar");
 const overlay = document.getElementById("sidebar-overlay");
 const btn = document.getElementById("hamburger-btn");
 const isOpen = sidebar.classList.contains("open");
 sidebar.classList.toggle("open", !isOpen);
 overlay.classList.toggle("show", !isOpen);
 btn.classList.toggle("open", !isOpen);
}
function closeSidebar() {
 document.getElementById("sidebar").classList.remove("open");
 document.getElementById("sidebar-overlay").classList.remove("show");
 document.getElementById("hamburger-btn").classList.remove("open");
}
function setBottomNav(name) {
 document.querySelectorAll(".bottom-nav-item").forEach(b => b.classList.remove("active"));
 const el = document.getElementById("bn-" + name);
 if (el) el.classList.add("active");
}

// ---- PANELS ----
function showPanel(name, btn) {
 document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
 document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
 document.getElementById("panel-"+name).classList.add("active");
 if (btn) btn.classList.add("active");
 closeSidebar();
 window.scrollTo({top:0, behavior:"smooth"});
 if (name === 'enquiries') loadEnquiries();
}

// ---- IMGBB ----
function getImgbbKey() { return imgbbKey || localStorage.getItem("yogartha_imgbb_key") || ""; }
function saveImgbbKey() {
 const k = document.getElementById("imgbb-key-input").value.trim();
 if (!k) { toast("Please enter your API key", true); return; }
 imgbbKey = k; localStorage.setItem("yogartha_imgbb_key", k);
 if (isFirebase) firebase.database().ref("config/imgbbKey").set(k).catch(()=>{});
 toast("API key saved!"); updateImgbbStatus();
}
function testImgbbKey() {
 const k = getImgbbKey();
 const res = document.getElementById("imgbb-test-result");
 if (!k) { res.style.color="#f87171"; res.textContent="No API key saved yet."; return; }
 res.style.color="var(--muted)"; res.textContent="Testing…";
 const tiny="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==";
 const fd=new FormData(); fd.append("image",tiny);
 fetch(`https://api.imgbb.com/1/upload?key=${k}`,{method:"POST",body:fd})
 .then(r=>r.json()).then(d=>{
 if(d.success){res.style.color="#6ee89a";res.textContent="✓ Connected! Uploads enabled.";updateImgbbStatus();}
 else{res.style.color="#f87171";res.textContent="✗ Invalid key. Please check.";}
 }).catch(()=>{res.style.color="#f87171";res.textContent="✗ Network error.";});
}
function updateImgbbStatus() {
 const k=getImgbbKey();
 const bar=document.getElementById("gallery-imgbb-bar");
 const msg=document.getElementById("gallery-imgbb-msg");
 if(k){bar.className="imgbb-bar ready";msg.textContent="✓ ImgBB connected — direct photo upload enabled!";}
 else{bar.className="imgbb-bar notset";msg.textContent='ImgBB not set — go to "Image API Setup" to enable direct uploads.';}
 if(!document.getElementById("imgbb-key-input").value) document.getElementById("imgbb-key-input").value=k;
}
async function uploadToImgbb(file, onProgress) {
 const k=getImgbbKey();
 if(!k){toast("Set up ImgBB key first (Image API Setup tab)",true);return null;}
 if(file.size>10*1024*1024){toast("File too large — max 10MB",true);return null;}
 return new Promise((resolve,reject)=>{
 const fd=new FormData(); fd.append("image",file);
 const xhr=new XMLHttpRequest();
 xhr.upload.addEventListener("progress",e=>{if(e.lengthComputable)onProgress&&onProgress(Math.round(e.loaded/e.total*90));});
 xhr.onload=()=>{
 try{const d=JSON.parse(xhr.responseText);if(d.success){onProgress&&onProgress(100);resolve(d.data.url);}else reject(d.error?.message||"Upload failed");}
 catch(e){reject("Upload failed");}
 };
 xhr.onerror=()=>reject("Network error");
 xhr.open("POST",`https://api.imgbb.com/1/upload?key=${k}`);
 xhr.send(fd);
 });
}

// ---- LOGIN ----
function doLogin() {
 const email = document.getElementById("login-email").value.trim();
 const pass = document.getElementById("login-pass").value.trim();
 const err = document.getElementById("login-err");
 if(!email){err.textContent="Please enter your email.";return;}
 try {
  if(typeof firebase!=="undefined"&&firebase.apps.length>0){
   if (typeof firebase.auth !== "function") {
    err.textContent="Error: Firebase Auth blocked by your browser (check Adblock/Brave Shields).";
    return;
   }
   firebase.auth().signInWithEmailAndPassword(email,pass)
   .then(()=>enterDash(true))
   .catch(e=>{err.textContent=e.message;});
  } else {
   if(!pass){err.textContent="Please enter a password.";return;}
   enterDash(false);
  }
 } catch(e) {
  err.textContent="Unexpected error: " + e.message;
 }
}
function enterDash(fb) {
 isFirebase=fb;
 document.getElementById("login-screen").style.display="none";
 document.getElementById("dashboard").style.display="block";
 const bar=document.getElementById("firebase-status");
 if(fb){
 bar.className="status-bar connected";
 bar.innerHTML='<div class="status-dot"></div><span>Connected to Firebase — changes publish live instantly</span>';
 loadFirebase();
 }
 updateImgbbStatus(); renderBatchListAdmin(); renderTestiList(); renderGallery();
}
// ===== ENQUIRIES =====
function loadEnquiries() {
 const list = document.getElementById('enquiry-list');
 const count = document.getElementById('enquiry-count');
 if (!list) return;
 if (!isFirebase) {
 list.innerHTML = '<p style="color:var(--muted);font-size:.88rem;">Firebase not connected. Enquiries will appear here once connected.</p>';
 return;
 }
 list.innerHTML = '<p style="color:var(--muted);font-size:.88rem;">Loading…</p>';
 firebase.database().ref('enquiries').orderByChild('timestamp').once('value').then(snap => {
 const raw = snap.val();
 if (!raw) {
 list.innerHTML = '<p style="color:var(--muted);font-size:.88rem;">No enquiries yet. Share your website link to get started!</p>';
 count.textContent = '';
 return;
 }
 const entries = Object.entries(raw).reverse(); // newest first
 count.textContent = `(${entries.length} total)`;
 let unread = 0;
 list.innerHTML = entries.map(([key, e]) => {
 const isUnread = !e.read;
 if (isUnread) unread++;
 const dt = e.timestamp ? new Date(e.timestamp).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'}) : '';
 return `<div style="border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:12px;background:${isUnread?'rgba(242,103,34,0.05)':'var(--surface2)'};position:relative;">
 ${isUnread ? '<span style="position:absolute;top:12px;right:12px;background:#F26722;color:#fff;font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:50px;">NEW</span>' : ''}
 <div style="font-weight:600;font-size:.95rem;color:var(--text);margin-bottom:4px;">${e.name || '—'}</div>
 <div style="font-size:.82rem;color:var(--muted);margin-bottom:8px;">${dt}</div>
 <div style="font-size:.84rem;color:var(--text-mid);display:flex;flex-wrap:wrap;gap:12px;margin-bottom:8px;">
 ${e.email ? `<span>✉ ${e.email}</span>` : ''}
 ${e.phone ? `<span>📞 ${e.phone}</span>` : ''}
 ${e.program ? `<span>🧘 ${e.program}</span>` : ''}
 </div>
 ${e.message ? `<div style="font-size:.88rem;color:var(--text);border-left:3px solid var(--saffron);padding-left:10px;margin-bottom:10px;font-style:italic;">"${e.message}"</div>` : ''}
 <div style="display:flex;gap:8px;flex-wrap:wrap;">
 ${isUnread ? `<button class="btn btn-ghost btn-sm" onclick="markEnquiryRead('${key}')">Mark as Read</button>` : ''}
 <button class="btn btn-danger btn-sm" onclick="deleteEnquiry('${key}')">Delete</button>
 </div>
 </div>`;
 }).join('');
 // Update badge
 const badge = document.getElementById('enquiry-badge');
 if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? 'inline' : 'none'; }
 }).catch(() => {
 list.innerHTML = '<p style="color:var(--danger);font-size:.88rem;">Could not load enquiries. Check your Firebase connection.</p>';
 });
}
function markEnquiryRead(key) {
 firebase.database().ref('enquiries/' + key + '/read').set(true).then(loadEnquiries);
}
function deleteEnquiry(key) {
 if (!confirm('Delete this enquiry?')) return;
 firebase.database().ref('enquiries/' + key).remove().then(loadEnquiries);
}

function doLogout() {
 if(isFirebase)firebase.auth().signOut();
 document.getElementById("dashboard").style.display="none";
 document.getElementById("login-screen").style.display="flex";
}
document.addEventListener("DOMContentLoaded",()=>{
 document.getElementById("login-pass").addEventListener("keydown",e=>{if(e.key==="Enter")doLogin();});
 document.getElementById("new-testi-photo").addEventListener("input",function(){
 const url=this.value.trim();
 if(url){pendingTestiPhotoUrl=url;showTestiPhotoPreview(url,"URL photo");}
 });

 // Auto-login if already authenticated
 if (typeof firebase !== "undefined" && firebase.apps.length > 0) {
  firebase.auth().onAuthStateChanged(user => {
   if (user) {
    enterDash(true);
   }
  });
 }
});

// ---- SCHEDULE ----
function t2i(s){const m=s.match(/(\d+):(\d+)\s*(AM|PM)/i);if(!m)return"06:00";let h=parseInt(m[1]);const ap=m[3].toUpperCase();if(ap==="PM"&&h!==12)h+=12;if(ap==="AM"&&h===12)h=0;return`${String(h).padStart(2,"0")}:${m[2]}`;}
function i2t(v){const[h,m]=v.split(":").map(Number);return`${h%12||12}:${String(m).padStart(2,"0")} ${h<12?"AM":"PM"}`;}
// ---- PROGRAM BATCHES ----
let batches = {}; // keyed by id

function toggleCustomProgram(val) {
  document.getElementById('batch-custom-wrap').style.display = val === 'custom' ? '' : 'none';
}

function fmtDateAdmin(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysBetweenAdmin(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000) + 1;
}

function addBatch() {
  const sel = document.getElementById('batch-program-select').value;
  const program = sel === 'custom'
    ? (document.getElementById('batch-custom-name').value.trim())
    : sel;
  const startDate = document.getElementById('batch-start').value;
  const endDate   = document.getElementById('batch-end').value;
  const time      = document.getElementById('batch-time').value.trim();
  const seats     = document.getElementById('batch-seats').value.trim();
  const color     = (document.querySelector('input[name="batch-color"]:checked') || {}).value || 'saffron';

  if (!program)   { toast('Please enter a program name', true); return; }
  if (!startDate) { toast('Please set a start date', true); return; }
  if (!endDate)   { toast('Please set an end date', true); return; }
  if (endDate < startDate) { toast('End date must be on or after start date', true); return; }

  const id = 'b' + Date.now();
  const batch = { id, program, startDate, endDate, time, seats, color };

  if (isFirebase) {
    firebase.database().ref('batches/' + id).set(batch)
      .then(() => {
        toast('Batch added live! ✓');
        resetBatchForm();
      })
      .catch(() => toast('Error saving batch', true));
  } else {
    batches[id] = batch;
    renderBatchListAdmin();
    toast('Batch added (Demo mode — connect Firebase to publish)');
    resetBatchForm();
  }
}

function resetBatchForm() {
  document.getElementById('batch-program-select').value = 'Surya Kriya';
  document.getElementById('batch-custom-wrap').style.display = 'none';
  document.getElementById('batch-custom-name').value = '';
  document.getElementById('batch-start').value = '';
  document.getElementById('batch-end').value = '';
  document.getElementById('batch-time').value = '';
  document.getElementById('batch-seats').value = '';
  const firstColor = document.querySelector('input[name="batch-color"]');
  if (firstColor) firstColor.checked = true;
}

function deleteBatch(id) {
  if (!confirm('Remove this batch from the schedule?')) return;
  if (isFirebase) {
    firebase.database().ref('batches/' + id).remove()
      .then(() => toast('Batch removed'))
      .catch(() => toast('Error removing batch', true));
  } else {
    delete batches[id];
    renderBatchListAdmin();
    toast('Batch removed (Demo mode)');
  }
}

function renderBatchListAdmin() {
  const container = document.getElementById('batch-list-admin');
  if (!container) return;
  const list = Object.values(batches).sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (!list.length) {
    container.innerHTML = '<p style="color:var(--muted);font-size:.88rem;">No batches yet. Add one above.</p>';
    return;
  }
  const today = new Date(); today.setHours(0,0,0,0);
  const pillColors = { saffron:'#e8721a', gold:'#dab94a', rose:'#e0607a', blue:'#7ab4f5', green:'#5dbb8a' };
  container.innerHTML = list.map(b => {
    const isPast = b.endDate && new Date(b.endDate + 'T00:00:00') < today;
    const days   = b.startDate && b.endDate ? daysBetweenAdmin(b.startDate, b.endDate) : '?';
    const col    = b.color || 'saffron';
    const dotColor = pillColors[col] || '#e8721a';
    return `<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);">
      <span style="width:10px;height:10px;border-radius:50%;background:${dotColor};flex-shrink:0;"></span>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:.9rem;color:var(--text);">${b.program}
          ${isPast ? '<span style="margin-left:6px;font-size:.65rem;background:rgba(0,0,0,0.08);color:var(--muted);padding:2px 8px;border-radius:20px;font-weight:500;">Completed</span>' : ''}
        </div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:2px;">
          ${fmtDateAdmin(b.startDate)} → ${fmtDateAdmin(b.endDate)} &nbsp;·&nbsp; ${days} days
          ${b.time ? '&nbsp;·&nbsp; ' + b.time : ''}
          ${b.seats ? '&nbsp;·&nbsp; ' + b.seats : ''}
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteBatch('${b.id}')">Remove</button>
    </div>`;
  }).join('');
}

// Real-time listener for batches (set up on Firebase connect)
function initBatchListener() {
  if (!isFirebase) return;
  firebase.database().ref('batches').on('value', snap => {
    batches = snap.val() || {};
    renderBatchListAdmin();
  });
}



// ====================================================================
// CROP MODAL ENGINE
// ====================================================================
let cropperInstance = null;
let cropCallback = null;
let cropIsRound = false;
let cropOriginalFile = null;   // stores original file for "Skip Crop" button

function openCropModal(file, label, onConfirm, aspectRatio, isRound) {
  cropCallback = onConfirm;
  cropIsRound = !!isRound;
  cropOriginalFile = file;   // save for skip button
  const modal = document.getElementById('crop-modal');
  const img   = document.getElementById('crop-img');
  document.getElementById('crop-label').textContent = label || 'Drag to select the area you want';
  document.getElementById('crop-filename').textContent = file.name;

  // Destroy previous cropper
  if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }

  const reader = new FileReader();
  reader.onload = e => {
    img.src = e.target.result;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Give DOM time to render before Cropper.js initialises
    setTimeout(() => {
      const previewEl = cropIsRound
        ? document.getElementById('crop-preview-round')
        : document.getElementById('crop-preview-rect');
      document.getElementById('crop-preview-round').style.display = cropIsRound ? 'block' : 'none';
      document.getElementById('crop-preview-rect').style.display  = cropIsRound ? 'none'  : 'block';

      cropperInstance = new Cropper(img, {
        aspectRatio: aspectRatio || NaN,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.85,
        responsive: true,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        preview: previewEl,
      });

      // Set default ratio button active
      document.querySelectorAll('.crop-ratio-btn').forEach(b => b.classList.remove('crop-ratio-active'));
      if (!aspectRatio) document.getElementById('ratio-free').classList.add('crop-ratio-active');
      else if (aspectRatio === 1) document.getElementById('ratio-1').classList.add('crop-ratio-active');
      else if (Math.abs(aspectRatio - 16/9) < 0.01) document.getElementById('ratio-169').classList.add('crop-ratio-active');
      else if (Math.abs(aspectRatio - 4/3) < 0.01) document.getElementById('ratio-43').classList.add('crop-ratio-active');
      else if (Math.abs(aspectRatio - 3/4) < 0.01) document.getElementById('ratio-34').classList.add('crop-ratio-active');
    }, 80);
  };
  reader.readAsDataURL(file);
}

function setCropRatio(ratio) {
  if (!cropperInstance) return;
  const r = ratio === 'free' ? NaN : ratio;
  cropperInstance.setAspectRatio(r);
  document.querySelectorAll('.crop-ratio-btn').forEach(b => b.classList.remove('crop-ratio-active'));
  const map = { 'free':'ratio-free', 1:'ratio-1' };
  let btnId;
  if (ratio === 'free') btnId = 'ratio-free';
  else if (ratio === 1) btnId = 'ratio-1';
  else if (Math.abs(ratio - 16/9) < 0.01) btnId = 'ratio-169';
  else if (Math.abs(ratio - 4/3)  < 0.01) btnId = 'ratio-43';
  else if (Math.abs(ratio - 3/4)  < 0.01) btnId = 'ratio-34';
  if (btnId) document.getElementById(btnId).classList.add('crop-ratio-active');
}

function cancelCrop() {
  if (typeof _heroCropFile !== 'undefined') _heroCropFile = null;
  if (typeof _progHeroCropFile !== 'undefined') _progHeroCropFile = null;
  closeCropModal();
}

function closeCropModal() {
  document.getElementById('crop-modal').style.display = 'none';
  document.body.style.overflow = '';
  if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
  cropCallback = null;
}

function applyCrop() {
  if (!cropperInstance || !cropCallback) return;
  cropperInstance.getCroppedCanvas({ maxWidth: 2048, maxHeight: 2048, fillColor:'#fff' })
    .toBlob(blob => {
      const cb = cropCallback; // Save reference before closing
      closeCropModal(); // This nullifies the global cropCallback
      if (blob && cb) cb(blob);
    }, 'image/jpeg', 0.92);
}

function skipCrop() {
  if (!cropOriginalFile || !cropCallback) { closeCropModal(); return; }
  const file = cropOriginalFile;
  const cb = cropCallback; // Save reference before closing
  closeCropModal(); // This nullifies the global cropCallback
  if (cb) cb(file);
}

// Helper: converts a Blob to a File object (needed for uploads)
function blobToFile(blob, originalName) {
  const ext = 'jpg';
  const name = (originalName || 'photo').replace(/\.[^.]+$/, '') + '_cropped.' + ext;
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

// ---- UPLOAD ENGINE: ImgBB (free, no Blaze plan needed) ----
async function uploadImageFile(file, _storagePath) {
  const k = getImgbbKey();
  if (!k) {
    // Show a helpful nudge instead of silent fail
    toast('⚠ Paste your ImgBB API key in "Image API Setup" to enable uploads', true);
    // Navigate user to the setup panel
    setTimeout(() => showPanel('imgbb', document.querySelector('[onclick*="imgbb"]')), 1500);
    throw new Error('API key missing');
  }
  return await uploadToImgbb(file, () => {});
}

// ---- GALLERY ----
function handleGalleryDrop(e){e.preventDefault();document.getElementById("gallery-drop-zone").classList.remove("dragging");handleGalleryFiles(e.dataTransfer.files);}
async function handleGalleryFiles(files){
  if(!files||!files.length)return;
  if(!getImgbbKey()){toast("Set up ImgBB API key first",true);return;}
  // Gallery: crop each file one by one
  const fileArray = Array.from(files);
  async function cropAndUploadNext(index) {
    if (index >= fileArray.length) return;
    const file = fileArray[index];
    openCropModal(file, `Crop photo ${index+1} of ${fileArray.length} — drag to adjust`, async (blob) => {
      const croppedFile = blobToFile(blob, file.name);
      const prog=document.getElementById("gallery-progress");
      const progBar=document.getElementById("gallery-progress-bar");
      const progText=document.getElementById("gallery-progress-text");
      prog.classList.add("show");
      progText.textContent = `Uploading ${index+1}/${fileArray.length}…`;
      try {
        const url = await uploadToImgbb(croppedFile, pct=>{ progBar.style.width=pct+"%"; });
        if(url) gallery.push({id:Date.now()+index, url, caption:""});
        renderGallery();
      } catch(e){ toast("Error: "+file.name, true); }
      prog.classList.remove("show"); progBar.style.width="0%";
      if (index + 1 < fileArray.length) {
        setTimeout(() => cropAndUploadNext(index + 1), 200);
      } else {
        toast(fileArray.length > 1 ? `${fileArray.length} photos added!` : "Photo added!");
      }
    }, NaN, false);  // free aspect ratio for gallery
  }
  cropAndUploadNext(0);
}
function addGalleryByUrl(){
 const url=document.getElementById("gallery-url").value.trim();
 const cap=document.getElementById("gallery-caption").value.trim();
 if(!url){toast("Please paste a photo URL",true);return;}
 gallery.push({id:Date.now(),url,caption:cap});
 document.getElementById("gallery-url").value="";document.getElementById("gallery-caption").value="";
 renderGallery();toast("Photo added!");
}
function delGallery(id){gallery=gallery.filter(g=>g.id!==id);renderGallery();}
function renderGallery(){
 const grid=document.getElementById("gallery-grid");
 document.getElementById("gallery-count").textContent=gallery.length;
 if(!gallery.length){grid.innerHTML='<p style="color:var(--muted);font-size:.88rem;grid-column:1/-1;">No photos yet.</p>';return;}
 grid.innerHTML=gallery.map(g=>`
 <div class="gallery-preview-item">
 <img src="${g.url}" alt="${g.caption}" onerror="this.style.opacity='.3'" loading="lazy"/>
 ${g.caption?`<div class="gallery-preview-caption">${g.caption}</div>`:""}
 <button class="gallery-preview-del" onclick="delGallery(${g.id})">&times;</button>
 </div>`).join("");
}

function openGalleryTab(type, btn) {
    showPanel('gallery', btn);
    const wrap = document.getElementById("admin-gallery-selector-wrap");
    const title = document.querySelector("#panel-gallery .page-title");
    const selector = document.getElementById("admin-gallery-selector");
    
    if (type === 'main') {
        wrap.style.display = 'none';
        title.textContent = 'Main Gallery';
        // Temporarily inject the main gallery option to switch to it, then remove it so it doesn't show in the UI if it becomes visible
        const opt = document.createElement("option");
        opt.value = "gallery";
        opt.id = "temp-main-opt";
        selector.appendChild(opt);
        selector.value = 'gallery';
        switchAdminGallery();
        document.getElementById("temp-main-opt").remove();
    } else {
        wrap.style.display = 'block';
        title.textContent = 'Program Galleries';
        // Default to first option if empty or if currently set to main
        if (selector.value === 'gallery' || !selector.value) {
            selector.value = 'programs/surya-kriya/gallery';
        }
        switchAdminGallery();
    }
}

function switchAdminGallery() {
  gallery = [];
  renderGallery();
  if(!isFirebase) return;
  const gRef = document.getElementById("admin-gallery-selector").value;
  firebase.database().ref(gRef).once("value").then(s => {
    if(s.val()) {
      gallery = Array.isArray(s.val()) ? s.val() : Object.values(s.val());
    }
    renderGallery();
  });
}

function saveGallery(){
 const gRef = document.getElementById("admin-gallery-selector").value;
 if(isFirebase)firebase.database().ref(gRef).set(gallery).then(()=>toast("Gallery live!")).catch(()=>toast("Error",true));
 else toast("Demo mode — connect Firebase to publish");
}

// ---- TESTIMONIALS ----
function handleTestiDrop(e){e.preventDefault();document.getElementById("testi-drop-zone").classList.remove("dragging");if(e.dataTransfer.files[0])handleTestiFile(e.dataTransfer.files[0]);}
async function handleTestiFile(file){
  if(!file)return;
  // Open crop modal — square/round for portrait photo
  openCropModal(file, 'Crop student photo — square works best for the avatar', async (blob) => {
    const croppedFile = blobToFile(blob, file.name);
    if(!getImgbbKey()){
      const url=URL.createObjectURL(croppedFile);
      pendingTestiPhotoUrl=url; showTestiPhotoPreview(url,file.name);
      toast("Demo: ImgBB not set. Preview only."); return;
    }
    const prog=document.getElementById("testi-progress");
    const progBar=document.getElementById("testi-progress-bar");
    const progText=document.getElementById("testi-progress-text");
    prog.classList.add("show"); progText.textContent="Uploading…";
    try{
      const url=await uploadToImgbb(croppedFile,pct=>{progBar.style.width=pct+"%";progText.textContent=`Uploading… ${pct}%`;});
      if(url){pendingTestiPhotoUrl=url;showTestiPhotoPreview(url,file.name);toast("Photo uploaded!");}
    }catch(e){toast("Upload failed",true);}
    prog.classList.remove("show"); progBar.style.width="0%";
  }, 1, true);  // 1:1 ratio, round preview
}
function showTestiPhotoPreview(url,name){
 const wrap=document.getElementById("testi-photo-preview-wrap");
 document.getElementById("testi-photo-preview").src=url;
 document.getElementById("testi-preview-name").textContent=name||"Photo ready";
 wrap.style.display="flex";
}
function clearTestiPhoto(){
 pendingTestiPhotoUrl="";
 document.getElementById("new-testi-photo").value="";
 document.getElementById("testi-photo-preview-wrap").style.display="none";
}
function addGoogleReview(){
 const name=document.getElementById("g-review-name").value.trim();
 const review=document.getElementById("g-review-text").value.trim();
 const stars=document.getElementById("g-review-stars").value;
 const link=document.getElementById("g-review-link").value.trim();
 if(!name||!review){toast("Name and review text required",true);return;}
 const t={id:Date.now(),name,role:"Google Review",review,stars:parseInt(stars),source:"google",googleLink:link,photo:""};
 testimonials.push(t);
 if(isFirebase)firebase.database().ref("testimonials/"+t.id).set(t).then(()=>toast("Google Review live!")).catch(()=>toast("Error",true));
 else toast("Added (Demo Mode)");
 document.getElementById("g-review-name").value="";
 document.getElementById("g-review-text").value="";
 document.getElementById("g-review-link").value="";
 document.getElementById("g-review-stars").value="5";
 renderTestiList();
}
function addTestimonial(){
 const name=document.getElementById("new-testi-name").value.trim();
 const role=document.getElementById("new-testi-role").value.trim();
 const review=document.getElementById("new-testi-review").value.trim();
 const photo=pendingTestiPhotoUrl||document.getElementById("new-testi-photo").value.trim();
 if(!name||!review){toast("Name and review required",true);return;}
 const t={id:Date.now(),name,role,photo,review,source:"manual"};
 testimonials.push(t);
 if(isFirebase)firebase.database().ref("testimonials/"+t.id).set(t).then(()=>toast("Testimonial live!")).catch(()=>toast("Error",true));
 else toast("Added (Demo Mode)");
 document.getElementById("new-testi-name").value="";
 document.getElementById("new-testi-role").value="";
 document.getElementById("new-testi-review").value="";
 clearTestiPhoto();renderTestiList();
}
function delTesti(id){
 testimonials=testimonials.filter(t=>t.id!==id);
 if(isFirebase)firebase.database().ref("testimonials/"+id).remove();
 toast("Removed");renderTestiList();
}
function renderTestiList(){
 const list=document.getElementById("testi-list");
 if(!testimonials.length){list.innerHTML='<p style="color:var(--muted);font-size:.88rem;">No reviews yet.</p>';return;}
 const googleBadge=`<span style="display:inline-flex;align-items:center;gap:3px;font-size:.7rem;background:rgba(66,133,244,0.13);color:#4285F4;padding:2px 7px;border-radius:20px;font-weight:600;margin-left:6px;vertical-align:middle;">&#71;oogle</span>`;
 list.innerHTML=testimonials.map(t=>`
 <div class="testi-item">
 <div class="testi-item-header">
 <div class="testi-meta">
 ${t.photo?`<img class="testi-avatar-img" src="${t.photo}" alt="${t.name}"/>`:`<div class="testi-avatar-letter">${(t.name||"?")[0].toUpperCase()}</div>`}
 <div>
 <div class="testi-name">${t.name}${t.source==='google'?googleBadge:''}</div>
 <div class="testi-role">${t.role||''}${t.stars?' &nbsp;'+'&#9733;'.repeat(parseInt(t.stars)):''}</div>
 </div>
 </div>
 <button class="btn btn-danger btn-sm" onclick="delTesti(${t.id})">Remove</button>
 </div>
 <p style="font-size:.84rem;color:var(--muted);line-height:1.6;">"${t.review}"</p>
 </div>`).join("");
}

// ---- SITE IMAGES ----
async function uploadSiteImg(type, file, previewId) {
  if (!file) return;

  const cropConfigs = {
    hero:     { ratio: 16/9, label: 'Crop hero background — 16:9 wide recommended', isRound: false },
    about:    { ratio: NaN,  label: 'Crop about section image',                      isRound: false },
    guru:     { ratio: 1,    label: 'Crop teacher portrait — square works best',    isRound: true  },
    sadhguru: { ratio: NaN,  label: 'Crop Sadhguru portrait',                       isRound: false },
    shala:    { ratio: NaN,  label: 'Crop class / studio photo',                    isRound: false },
    symbol:   { ratio: 1,    label: 'Crop decorative symbol — square recommended', isRound: false },
  };
  const cfg = cropConfigs[type] || { ratio: NaN, label: 'Crop image', isRound: false };

  // Show local preview immediately (fast feedback before upload finishes)
  const localUrl = URL.createObjectURL(file);
  document.getElementById(previewId).src = localUrl;

  openCropModal(file, cfg.label, async (fileOrBlob) => {
    const uploadFile = (fileOrBlob instanceof File) ? fileOrBlob : blobToFile(fileOrBlob, file.name);

    // Show spinner
    const spinner = document.getElementById('spin-img-' + type);
    if (spinner) spinner.style.display = 'flex';
    toast('Uploading…');

    try {
      const url = await uploadImageFile(uploadFile, 'siteImages/' + type + '_' + Date.now());
      if (url) {
        document.getElementById(previewId).src = url;
        await saveSiteImgToDb(type, url);
        toast('Image updated live! ✓');
      }
    } catch(e) {
      toast('Upload failed — ' + e, true);
    } finally {
      if (spinner) spinner.style.display = 'none';
    }
  }, cfg.ratio, cfg.isRound);
}

// ---- HERO DEVICE-SPECIFIC CROP FLOW ----
let _heroCropFile = null; // stores the chosen file between device crop calls
const _heroCropConfigs = {
  desktop: { ratio: 16/9, label: 'Desktop Crop - 16:9', previewId: 'prev-hero-desktop', dbKey: 'hero_desktop' },
  tablet:  { ratio: 4/3,  label: 'Tablet Crop - 4:3', previewId: 'prev-hero-tablet', dbKey: 'hero_tablet' },
  mobile:  { ratio: 9/16, label: 'Mobile Crop - 9:16', previewId: 'prev-hero-mobile', dbKey: 'hero_mobile' },
};

function triggerHeroCrop(device) {
  // If we already have a file loaded, crop it directly for this device
  if (_heroCropFile) {
    _cropHeroDevice(device, _heroCropFile);
  } else {
    // Otherwise ask the user to pick a file first, storing the device for after selection
    document.getElementById('file-img-hero').dataset.targetDevice = device;
    document.getElementById('file-img-hero').click();
  }
}

function startHeroCropFlow(file) {
  if (!file) return;
  _heroCropFile = file;
  const targetDevice = document.getElementById('file-img-hero').dataset.targetDevice || 'desktop';
  _cropHeroDevice(targetDevice, file);
}

async function _cropHeroDevice(device, file) {
  const cfg = _heroCropConfigs[device];
  openCropModal(file, cfg.label, async (fileOrBlob) => {
    const uploadFile = (fileOrBlob instanceof File) ? fileOrBlob : blobToFile(fileOrBlob, file.name);
    toast('Uploading ' + device + ' crop…');
    try {
      const url = await uploadImageFile(uploadFile, 'siteImages/hero_' + device + '_' + Date.now());
      if (url) {
        document.getElementById(cfg.previewId).src = url;
        await saveSiteImgToDb(cfg.dbKey, url);
        toast('Hero ' + device + ' image updated live! ✓');
      }
    } catch(e) { toast('Upload failed — ' + e, true); }
  }, cfg.ratio, false);
}

async function setHeroUrl(device) {
  const cfg = _heroCropConfigs[device];
  const url = document.getElementById('url-hero-' + device).value.trim();
  if (!url) { toast('Paste an image URL first', true); return; }
  document.getElementById(cfg.previewId).src = url;
  document.getElementById('url-hero-' + device).value = '';
  await saveSiteImgToDb(cfg.dbKey, url);
  toast(isFirebase ? 'Hero ' + device + ' updated live!' : 'Updated (Demo Mode)');
}
async function updateSiteImgUrl(type,previewId,inputId){
 const pid=previewId||"prev-img-"+type;
 const iid=inputId||"url-img-"+type;
 const url=document.getElementById(iid).value.trim();
 if(!url){toast("Paste an image URL first",true);return;}
 document.getElementById(pid).src=url;document.getElementById(iid).value="";
 await saveSiteImgToDb(type,url);
 toast(isFirebase?"Image updated live!":"Image updated (Demo Mode)");
}
async function saveSiteImgToDb(type,url){
 if(isFirebase)await firebase.database().ref("siteImages/"+type).set(url).catch(()=>toast("DB error",true));
}

let _progHeroCropFile = null;
const _progHeroCropConfigs = {
  desktop: { ratio: 3/1, label: 'Desktop Crop - 3:1', previewId: 'prev-prog-hero-desktop', device: 'desktop' },
  tablet:  { ratio: 2/1, label: 'Tablet Crop - 2:1', previewId: 'prev-prog-hero-tablet',  device: 'tablet'  },
  mobile:  { ratio: 4/3, label: 'Mobile Crop - 4:3', previewId: 'prev-prog-hero-mobile',  device: 'mobile'  },
};

function triggerProgHeroCrop(device) {
  const pId = document.getElementById('program-select').value;
  if (!pId) { toast('Select a program first', true); return; }
  if (_progHeroCropFile) {
    _cropProgHeroDevice(device, _progHeroCropFile);
  } else {
    document.getElementById('file-prog-hero-crop').dataset.targetDevice = device;
    document.getElementById('file-prog-hero-crop').click();
  }
}

function startProgHeroCropFlow(file) {
  if (!file) return;
  _progHeroCropFile = file;
  const targetDevice = document.getElementById('file-prog-hero-crop').dataset.targetDevice || 'desktop';
  _cropProgHeroDevice(targetDevice, file);
}

function triggerProgHeroCrop(device) {
  const pId = document.getElementById('program-select').value;
  if (!pId) { toast('Select a program first', true); return; }
  if (_progHeroCropFile) {
    _cropProgHeroDevice(device, _progHeroCropFile);
  } else {
    document.getElementById('file-prog-hero-crop').dataset.targetDevice = device;
    document.getElementById('file-prog-hero-crop').click();
  }
}

function startProgHeroCropFlow(file) {
  if (!file) return;
  _progHeroCropFile = file;
  const targetDevice = document.getElementById('file-prog-hero-crop').dataset.targetDevice || 'desktop';
  _cropProgHeroDevice(targetDevice, file);
}

async function _cropProgHeroDevice(device, file) {
  const pId = document.getElementById('program-select').value;
  if (!pId) { toast('Select a program first', true); return; }
  const cfg = _progHeroCropConfigs[device];
  const pid = pId.replace(/-/g, '_');
  const dbKey = 'prog_' + pid + '_' + device;
  openCropModal(file, cfg.label, async (fileOrBlob) => {
    const uploadFile = (fileOrBlob instanceof File) ? fileOrBlob : blobToFile(fileOrBlob, file.name);
    toast('Uploading ' + device + ' crop…');
    try {
      const url = await uploadImageFile(uploadFile, 'siteImages/prog_' + pid + '_' + device + '_' + Date.now());
      if (url) {
        document.getElementById(cfg.previewId).src = url;
        await saveSiteImgToDb(dbKey, url);
        toast('Program hero ' + device + ' updated live! 🎉');
      }
    } catch(e) { toast('Upload failed — ' + e, true); }
  }, cfg.ratio, false);
}

async function setProgHeroUrl(device) {
  const pId = document.getElementById('program-select').value;
  if (!pId) { toast('Select a program first', true); return; }
  const cfg = _progHeroCropConfigs[device];
  const pid = pId.replace(/-/g, '_');
  const dbKey = 'prog_' + pid + '_' + device;
  const url = document.getElementById('url-prog-hero-' + device).value.trim();
  if (!url) { toast('Paste an image URL first', true); return; }
  document.getElementById(cfg.previewId).src = url;
  document.getElementById('url-prog-hero-' + device).value = '';
  await saveSiteImgToDb(dbKey, url);
  toast(isFirebase ? 'Program hero ' + device + ' updated live!' : 'Updated (Demo Mode)');
}

function loadProgramImages() {
  const pId = document.getElementById('program-select').value;
  // Reset all previews
  ['desktop','tablet','mobile'].forEach(d => {
    const el = document.getElementById('prev-prog-hero-' + d);
    if (el) el.src = 'images/placeholder.png';
  });
  const prevOv = document.getElementById('prev-prog-overview');
  if (prevOv) prevOv.src = 'images/placeholder.png';
  _progHeroCropFile = null;

  // Reset reg form field
  const regInput  = document.getElementById('prog-reg-form-url');
  const regStatus = document.getElementById('prog-reg-form-status');
  if (regInput)  regInput.value = '';
  if (regStatus) { regStatus.style.color = 'var(--muted)'; regStatus.textContent = ''; }

  if (pId && isFirebase) {
    const pid = pId.replace(/-/g, '_');
    firebase.database().ref('siteImages').once('value').then(s => {
      const imgs = s.val() || {};
      ['desktop','tablet','mobile'].forEach(d => {
        const key = 'prog_' + pid + '_' + d;
        const el  = document.getElementById('prev-prog-hero-' + d);
        if (el && imgs[key]) el.src = imgs[key];
      });
    }).catch(() => {});
    // Load overview image + regFormUrl from programs/{pId}
    firebase.database().ref('programs/' + pId).once('value').then(s => {
      const data = s.val() || {};
      if (data.images && data.images.overview && prevOv) prevOv.src = data.images.overview;
      if (data.regFormUrl && regInput) {
        regInput.value = data.regFormUrl;
        if (regStatus) { regStatus.style.color = '#43A047'; regStatus.textContent = '✓ Form link active'; }
      }
    }).catch(() => {});
  }
}

function saveProgRegFormUrl() {
  const pId = document.getElementById('program-select').value;
  if (!pId) return toast('Select a program first', true);
  const url    = document.getElementById('prog-reg-form-url').value.trim();
  if (!url) return toast('Paste a Google Form URL first', true);
  const status = document.getElementById('prog-reg-form-status');
  if (isFirebase) {
    firebase.database().ref('programs/' + pId + '/regFormUrl').set(url)
      .then(() => {
        if (status) { status.style.color = '#43A047'; status.textContent = '✓ Form link saved & live!'; }
        toast('Registration form link saved!');
      })
      .catch(() => toast('Failed to save', true));
  }
}

function clearProgRegFormUrl() {
  const pId = document.getElementById('program-select').value;
  if (!pId) return toast('Select a program first', true);
  const status = document.getElementById('prog-reg-form-status');
  if (isFirebase) {
    firebase.database().ref('programs/' + pId + '/regFormUrl').remove()
      .then(() => {
        document.getElementById('prog-reg-form-url').value = '';
        if (status) { status.style.color = 'var(--muted)'; status.textContent = 'Form link removed — button hidden on program page.'; }
        toast('Registration form link removed.');
      })
      .catch(() => toast('Failed to remove', true));
  }
}


async function uploadProgramImg(type, file, previewId) {
  if (!file) return;
  const pId = document.getElementById('program-select').value;
  if (!pId) return toast('Select a program first', true);

  // Show local preview immediately
  document.getElementById(previewId).src = URL.createObjectURL(file);

  const cropLabel = type === 'overview' ? 'Crop overview / side image (4:3 works best)' : 'Crop program image';
  const cropRatio = type === 'overview' ? 4/3 : NaN;

  openCropModal(file, cropLabel, async (fileOrBlob) => {
    const uploadFile = (fileOrBlob instanceof File) ? fileOrBlob : blobToFile(fileOrBlob, file.name);
    toast('Uploading program image…');
    try {
      const url = await uploadImageFile(uploadFile, 'programs/' + pId + '/' + type + '_' + Date.now());
      if (url) {
        document.getElementById(previewId).src = url;
        if (isFirebase) {
          const pid = pId.replace(/-/g, '_');
          // Save to siteImages so program pages + cards can read it
          await saveSiteImgToDb('prog_' + pid + '_' + type, url);
          // Legacy path for backwards compat
          firebase.database().ref('programs/' + pId + '/images/' + type).set(url);
        }
        toast('Program image updated! ✓');
      }
    } catch(e) { if (e.message !== 'API key missing') toast('Upload failed', true); }
  }, cropRatio, false);
}

function updateProgramImgUrl(type) {
 const pId = document.getElementById('program-select').value;
 if (!pId) return toast('Select a program first', true);
 const url = document.getElementById('url-prog-' + type).value.trim();
 if (!url) return toast('Please enter a valid URL', true);
 document.getElementById('prev-prog-' + type).src = url;
 if (isFirebase) {
  const pid = pId.replace(/-/g, '_');
  saveSiteImgToDb('prog_' + pid + '_' + type, url);
  firebase.database().ref('programs/' + pId + '/images/' + type).set(url);
  toast('Program image updated!');
  document.getElementById('url-prog-' + type).value = '';
 }
}

// ---- TEACHER ----
function saveTeacherInfo(){
 const d={
 name:document.getElementById("teacher-name").value.trim(),
 title:document.getElementById("teacher-title").value.trim(),
 intro:document.getElementById("teacher-intro").value.trim(),
 bio:document.getElementById("teacher-bio").value.trim()
 };
 if(isFirebase)firebase.database().ref("teacher").set(d).then(()=>toast("Bio saved & live!")).catch(()=>toast("Error",true));
 else toast("Demo mode — connect Firebase to publish");
}

// ---- ANNOUNCEMENT ----
function toggleAnn(){
 announcement.active=!announcement.active;
 document.getElementById("ann-toggle").className="toggle"+(announcement.active?" on":"");
 document.getElementById("ann-label").textContent=announcement.active?"Banner is ON":"Banner is OFF";
}
function saveAnnouncement(){
 announcement.text=document.getElementById("ann-text").value.trim();
 if(isFirebase)firebase.database().ref("announcement").set(announcement).then(()=>toast(announcement.active?"Banner LIVE!":"Banner hidden")).catch(()=>toast("Error",true));
 else toast("Demo mode — connect Firebase");
}
function setEx(btn){document.getElementById("ann-text").value=btn.textContent.trim();}

// ---- CONTACT ----
function saveContact(){
 const d={
 phone:document.getElementById("contact-phone").value,
 email:document.getElementById("contact-email").value,
 address:document.getElementById("contact-address").value,
 open:i2t(document.getElementById("contact-open").value),
 close:i2t(document.getElementById("contact-close").value),
 landmark:document.getElementById("contact-landmark").value
 };
 if(isFirebase)firebase.database().ref("contact").set(d).then(()=>toast("Contact info live!")).catch(()=>toast("Error",true));
 else toast("Demo mode — connect Firebase");
}

// ---- FIREBASE LOAD ----
function loadFirebase(){
 const db=firebase.database();
 db.ref('batches').on('value', snap => { batches = snap.val() || {}; renderBatchListAdmin(); });
 db.ref("testimonials").once("value").then(s=>{if(s.val()){testimonials=Object.values(s.val());renderTestiList();}});
 switchAdminGallery();
 db.ref("announcement").once("value").then(s=>{
 if(s.val()){announcement=s.val();document.getElementById("ann-text").value=announcement.text||"";if(announcement.active)toggleAnn();}
 });
 db.ref("siteImages").once("value").then(s=>{
 if(s.val()){const i=s.val();
 // Hero device-specific previews
 if(i.hero_desktop) { const el = document.getElementById("prev-hero-desktop"); if(el) el.src=i.hero_desktop; }
 if(i.hero_tablet)  { const el = document.getElementById("prev-hero-tablet");  if(el) el.src=i.hero_tablet;  }
 if(i.hero_mobile)  { const el = document.getElementById("prev-hero-mobile");  if(el) el.src=i.hero_mobile;  }
 // Fallback: if no device crops yet, use old hero key for all previews
 else if(i.hero) {
   ['desktop','tablet','mobile'].forEach(d => { const el = document.getElementById('prev-hero-'+d); if(el) el.src=i.hero; });
 }
 // Other images
 if(i.about) { const el = document.getElementById("prev-img-about"); if(el) el.src=i.about; }
 if(i.sadhguru) { const el = document.getElementById("prev-img-sadhguru"); if(el) el.src=i.sadhguru; }
 if(i.guru) { 
 const el1 = document.getElementById("prev-img-guru"); if(el1) el1.src=i.guru;
 const el2 = document.getElementById("prev-teacher-photo"); if(el2) el2.src=i.guru;
 }
 if(i.shala) { const el = document.getElementById("prev-img-shala"); if(el) el.src=i.shala; }
 if(i.symbol) { const el = document.getElementById("prev-img-symbol"); if(el) el.src=i.symbol; }
 }
 });
 db.ref("teacher").once("value").then(s=>{
 if(s.val()){const t=s.val();
 if(t.name)document.getElementById("teacher-name").value=t.name;
 if(t.title)document.getElementById("teacher-title").value=t.title;
 if(t.intro)document.getElementById("teacher-intro").value=t.intro;
 if(t.bio)document.getElementById("teacher-bio").value=t.bio;
 }
 });
 db.ref("config/imgbbKey").once("value").then(s=>{
 if(s.val()){imgbbKey=s.val();localStorage.setItem("yogartha_imgbb_key",s.val());updateImgbbStatus();}
 });
}

// ---- TOAST ----
function toast(msg,isErr){
 const t=document.getElementById("toast");
 t.textContent=(isErr?"⚠ ":"✓ ")+msg;
 t.style.background=isErr?"#c0392b":"#27ae60";
 t.classList.add("show");
 setTimeout(()=>t.classList.remove("show"),3000);
}
