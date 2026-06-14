import re

with open('admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Sidebar Desktop
old_gallery_btn = '''<button class="nav-item" onclick="showPanel('gallery',this)">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Gallery</span>
 </button>'''

new_gallery_btns = '''<button class="nav-item" onclick="openGalleryTab('main',this)">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Main Gallery</span>
 </button>
 <button class="nav-item" onclick="openGalleryTab('programs',this)">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M3 15h6"/><path d="M3 18h6"/></svg><span>Program Galleries</span>
 </button>'''

html = html.replace(old_gallery_btn, new_gallery_btns)

# 2. Update Sidebar Mobile
old_mob_btn = '''<button class="bottom-nav-item" id="bn-gallery" onclick="showPanel('gallery',document.querySelectorAll('.nav-item')[1])">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Gallery</span>
 </button>'''

new_mob_btn = '''<button class="bottom-nav-item" id="bn-gallery" onclick="openGalleryTab('main',document.querySelectorAll('.nav-item')[1])">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>Main</span>
 </button>
 <button class="bottom-nav-item" id="bn-pgallery" onclick="openGalleryTab('programs',document.querySelectorAll('.nav-item')[2])">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/></svg><span>Programs</span>
 </button>'''

html = html.replace(old_mob_btn, new_mob_btn)

# 3. Add ID to the dropdown wrapper and remove "Home Page" option
old_select_wrapper = '''<div class="card" style="margin-bottom:20px;">
    <div class="form-group" style="margin-bottom:0;">
      <label for="admin-gallery-selector">Select Page Gallery</label>
      <select id="admin-gallery-selector" onchange="switchAdminGallery()" class="input" style="max-width:300px;">
        <option value="gallery">Home Page</option>
        <option value="gallery_surya_kriya">Surya Kriya</option>'''

new_select_wrapper = '''<div class="card" id="admin-gallery-selector-wrap" style="margin-bottom:20px; display:none;">
    <div class="form-group" style="margin-bottom:0;">
      <label for="admin-gallery-selector">Select Program</label>
      <select id="admin-gallery-selector" onchange="switchAdminGallery()" class="input" style="max-width:300px;">
        <option value="gallery_surya_kriya">Surya Kriya</option>'''

html = html.replace(old_select_wrapper, new_select_wrapper)

# 4. Inject JS openGalleryTab function
js_to_inject = '''
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
            selector.value = 'gallery_surya_kriya';
        }
        switchAdminGallery();
    }
}
'''

# Insert the JS at the bottom of the script block, before switchAdminGallery
html = html.replace('function switchAdminGallery() {', js_to_inject + '\nfunction switchAdminGallery() {')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Admin panel patched.")
