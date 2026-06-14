import io

with io.open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update saveGallery
old_save = """function saveGallery(){
 if(isFirebase)firebase.database().ref("gallery").set(gallery).then(()=>toast("Gallery live!")).catch(()=>toast("Error",true));
 else toast("Demo mode — connect Firebase to publish");
}"""

new_save = """function switchAdminGallery() {
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
}"""

content = content.replace(old_save, new_save)

# 2. Update initial load
old_load = 'db.ref("gallery").once("value").then(s=>{if(s.val()){gallery=Array.isArray(s.val())?s.val():Object.values(s.val());renderGallery();}});'
new_load = 'switchAdminGallery();'

content = content.replace(old_load, new_load)

with io.open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated admin.html')
