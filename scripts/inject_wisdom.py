import os, re

# Data for each practice page
# Fields: file, url, image_url, is_sadhguru_article, article_title, excerpt, card_label
pages = [
    {
        "file": "surya-kriya",
        "url": "https://isha.sadhguru.org/en/wisdom/sadhguru-spot/bringing-back-suryakriya",
        "image": "https://static.sadhguru.org/d/46272/1635490905-1635490903456.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": True,
        "date": "Oct 29, 2021",
        "title": "Bringing Back Suryakriya",
        "excerpt": "Sadhguru explains that Suryanamaskar was derived from the far more powerful classical practice called Suryakriya. He reveals how Suryakriya activates the solar plexus, balances the solar and lunar energies within the body, and why Isha Yoga Center began teaching it as a major practice.",
        "section_eyebrow": "In Sadhguru&rsquo;s Own Words",
        "section_title": "Sadhguru on Surya Kriya",
        "section_sub": "A first-hand account of the immense power of this classical practice &mdash; and why Sadhguru brought it back to the world.",
    },
    {
        "file": "yogasanas",
        "url": "https://isha.sadhguru.org/yoga/yoga-articles-hatha-yoga-asanas/asanas-guide/",
        "image": "https://static.sadhguru.org/d/46272/1663926756-1663926753743.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": True,
        "date": "Sadhguru",
        "title": "What is Hatha Yoga? Asanas Guide &mdash; Align With the Divine",
        "excerpt": "Sadhguru explains the science of yogasanas &mdash; 84 fundamental postures identified as the basis of classical Hatha Yoga. These are not mere physical exercises but subtle energy processes that align the body with the geometry of the cosmos and systematically activate the human energy system.",
        "section_eyebrow": "In Sadhguru&rsquo;s Own Words",
        "section_title": "Sadhguru on Yogasanas",
        "section_sub": "Sadhguru illuminates the deeper science behind asana practice &mdash; why posture is not about exercise, but about alignment with existence.",
    },
    {
        "file": "angamardhana",
        "url": "https://isha.sadhguru.org/en/wisdom/article/the-anatomy-of-angamardana",
        "image": "https://static.sadhguru.org/d/46272/1633419048-angamardana-yoga.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": True,
        "date": "Sadhguru",
        "title": "The Anatomy of Angamardana",
        "excerpt": "In this article, Sadhguru explains the mechanics of Angamardana &mdash; a system of dynamic, equipment-free exercises that strengthen the fundamental fabric of the body: the ligaments and sinews. He advises on intensity, suppleness, and what it takes to prepare the body for this powerful practice.",
        "section_eyebrow": "In Sadhguru&rsquo;s Own Words",
        "section_title": "Sadhguru on Angamardana",
        "section_sub": "Sadhguru breaks down the anatomy, intention, and mechanics of this ancient fitness system in his own words.",
    },
    {
        "file": "upa-yoga",
        "url": "https://isha.sadhguru.org/en/wisdom/article/classical-yoga-upayoga-understanding-your-body",
        "image": "https://static.sadhguru.org/d/46272/1633419261-upa-yoga.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": True,
        "date": "Sadhguru",
        "title": "Classical Yoga: Upa Yoga &mdash; Understanding Your Body",
        "excerpt": "Sadhguru introduces Upa Yoga &mdash; a set of 10 simple but powerful practices that activate the joints, muscles, and energy pathways (nadis) &mdash; and explains why the right intention transforms these practices from mere utility into a gateway for fundamental inner transformation.",
        "section_eyebrow": "In Sadhguru&rsquo;s Own Words",
        "section_title": "Sadhguru on Upa Yoga",
        "section_sub": "Understand this practice in depth from the source &mdash; Sadhguru explains what Upa Yoga truly is and the potential it holds.",
    },
    {
        "file": "shanmuki-mudra",
        "url": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/shanmuki-mudra",
        "image": "https://static.sadhguru.org/d/46272/1650603800-shanmukhi-mudra.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": False,
        "date": "Isha Foundation",
        "title": "Shanmukhi Mudra &mdash; Isha Hatha Yoga Wellness Program",
        "excerpt": "Learn more about Shanmukhi Mudra &mdash; a subtle yogic hand gesture and breath practice that closes the sensory gates of the face to turn awareness powerfully inward. Discover its benefits for vision, hearing, the nervous system, and meditative depth.",
        "section_eyebrow": "Know More",
        "section_title": "Know More About Shanmukhi Mudra",
        "section_sub": "Explore the full details of this practice &mdash; its benefits, how it works, and how you can learn it at Isha Foundation.",
    },
    {
        "file": "jala-neti",
        "url": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/jala-neti",
        "image": "https://static.sadhguru.org/d/46272/1650603796-jala-neti.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": False,
        "date": "Isha Foundation",
        "title": "Jala Neti &mdash; Nasal Cleansing with Water",
        "excerpt": "Discover Jala Neti &mdash; an ancient nasal cleansing process using a specially designed copper pot and salt water &mdash; and how it benefits respiratory health, relieves allergies and sinusitis, and brings clarity and balance to the nervous system.",
        "section_eyebrow": "Know More",
        "section_title": "Know More About Jala Neti",
        "section_sub": "Explore the full details of this powerful nasal cleansing practice &mdash; its benefits, process, and how to learn it at Isha.",
    },
    {
        "file": "eye-care-workshop",
        "url": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/eye-care-workshop",
        "image": "https://static.sadhguru.org/d/46272/1650603792-eye-care-workshop.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": False,
        "date": "Isha Foundation",
        "title": "Eye Care Workshop &mdash; Isha Hatha Yoga",
        "excerpt": "Explore Isha&rsquo;s Eye Care Workshop &mdash; a program of natural yogic practices to strengthen eye muscles, relieve digital screen strain, and improve conditions like myopia and hypermetropia &mdash; naturally, without medication.",
        "section_eyebrow": "Know More",
        "section_title": "Know More About the Eye Care Workshop",
        "section_sub": "Find out everything about this specialized program &mdash; what it involves, who it benefits, and how to participate.",
    },
    {
        "file": "yoga-for-wellbeing",
        "url": "https://isha.sadhguru.org/in/en/yoga-meditation/isha-yoga-online-offerings/yoga-for-wellbeing",
        "image": "https://static.sadhguru.org/d/46272/1650603788-yoga-for-wellbeing.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": False,
        "date": "Isha Foundation",
        "title": "Yoga for Wellbeing &mdash; Isha Online Program",
        "excerpt": "Learn about Yoga for Wellbeing &mdash; an online program combining Upa Yoga and Isha Kriya into an accessible 40-minute session suitable for ages 7 and above &mdash; to bring health, energy, and meditative quality to daily life.",
        "section_eyebrow": "Know More",
        "section_title": "Know More About Yoga for Wellbeing",
        "section_sub": "Explore the full details of this accessible online program and discover how you can begin your yogic journey from anywhere.",
    },
    {
        "file": "yoga-for-kids",
        "url": "https://isha.sadhguru.org/yoga/yoga-for-beginners/yoga-for-kids/",
        "image": "https://static.sadhguru.org/d/46272/1633419200-yoga-for-kids.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": True,
        "date": "Sadhguru",
        "title": "Yoga for Kids &mdash; Sadhguru on the Right Age, Practices &amp; Benefits",
        "excerpt": "Sadhguru explains the ideal age for children to begin yoga, the right practices for each stage of development &mdash; from Upa-Yoga for ages 4+ to Yoga Namaskar for ages 7+ &mdash; and how introducing yoga in childhood plants seeds of health, clarity, and inner wellbeing that last a lifetime.",
        "section_eyebrow": "In Sadhguru&rsquo;s Own Words",
        "section_title": "Sadhguru on Yoga for Children",
        "section_sub": "Sadhguru shares his wisdom on how and when to introduce the gift of yoga to children, and what it can do for their lives.",
    },
    {
        "file": "yoga-for-pregnant-women",
        "url": "https://isha.sadhguru.org/in/en/yoga-meditation/additional-programs/yoga-for-pregnant-women",
        "image": "https://static.sadhguru.org/d/46272/1650603784-website-thumbnail-program-thayamai.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": False,
        "date": "Isha Foundation",
        "title": "Yoga for Pregnant Women &mdash; Isha Janani Program",
        "excerpt": "Discover Isha Janani &mdash; a specialized program for pregnant women that combines yogic practices, pranayama, meditation, and educational content about pregnancy, delivery, and neonatal care &mdash; to help mothers experience pregnancy as a joyful, conscious, and transformative journey.",
        "section_eyebrow": "Know More",
        "section_title": "Know More About Yoga for Pregnant Women",
        "section_sub": "Explore the full details of Isha Janani &mdash; who it is for, what it includes, and how to participate.",
    },
    {
        "file": "bhastrika",
        "url": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/bhastrika-kriya",
        "image": "https://static.sadhguru.org/d/46272/1650603782-bhastrika-kriya.jpg?auto=format&fit=max&w=900",
        "is_sadhguru": True,
        "date": "Sadhguru",
        "title": "Bhastrika Kriya &mdash; A Powerful Inner Energy Process",
        "excerpt": "Sadhguru describes Bhastrika Kriya as &ldquo;not just a practice but a certain possibility that happens within you.&rdquo; He explains how this powerful breathing process purifies the blood, increases lung capacity, and aligns the human body with the rhythms of the planet for profound wellbeing.",
        "section_eyebrow": "In Sadhguru&rsquo;s Own Words",
        "section_title": "Sadhguru on Bhastrika Kriya",
        "section_sub": "Read Sadhguru&rsquo;s own explanation of what Bhastrika Kriya is, how it works, and the possibilities it opens up within you.",
    },
]

def make_wisdom_section(p):
    badge_text = "Sadhguru Spot &nbsp;&middot;&nbsp; isha.sadhguru.org" if p["is_sadhguru"] else "Program Guide &nbsp;&middot;&nbsp; isha.sadhguru.org"
    read_label = "Read Full Article" if p["is_sadhguru"] else "Visit Full Page"
    return f'''
  <!-- ===== SADHGURU WISDOM ARTICLE FEATURE ===== -->
  <section class="wisdom-article-section reveal">
    <div class="container">
      <div class="wisdom-section-header">
        <p class="section-eyebrow">{p["section_eyebrow"]}</p>
        <h2 class="section-title">{p["section_title"]}</h2>
        <p class="wisdom-section-sub">{p["section_sub"]}</p>
      </div>
      <a href="{p["url"]}"
         target="_blank" rel="noopener noreferrer" class="wisdom-article-card">
        <div class="wisdom-card-image">
          <img
            src="{p["image"]}"
            alt="{p["section_title"]}"
            loading="lazy"
            onerror="this.src=\'../images/bhuta_shuddhi.jpeg\'"
          />
          <div class="wisdom-card-image-overlay"></div>
          <span class="wisdom-card-badge">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12M4 8h8M4 12h6"/><rect x="2" y="2" width="16" height="16" rx="2"/></svg>
            {badge_text}
          </span>
        </div>
        <div class="wisdom-card-body">
          <div class="wisdom-card-meta">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/></svg>
            <span>{p["date"]} &nbsp;&middot;&nbsp; isha.sadhguru.org</span>
          </div>
          <h3 class="wisdom-card-title">{p["title"]}</h3>
          <p class="wisdom-card-excerpt">{p["excerpt"]}</p>
          <div class="wisdom-card-cta">
            <span class="wisdom-read-btn">
              {read_label}
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10h10M11 6l4 4-4 4"/></svg>
            </span>
            <span class="wisdom-source-logo">isha.sadhguru.org</span>
          </div>
        </div>
      </a>
    </div>
  </section>'''

# Pattern to find and replace the includes-section
includes_pattern = re.compile(
    r'<section class="includes-section">.*?</section>',
    re.DOTALL
)

changed = []
for p in pages:
    path = os.path.join("programs", f"{p['file']}.html")
    if not os.path.exists(path):
        print(f"SKIP (not found): {path}")
        continue
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if 'wisdom-article-section' in content:
        print(f"SKIP (already has wisdom): {p['file']}")
        continue
    
    new_section = make_wisdom_section(p)
    new_content, n = includes_pattern.subn(new_section.strip(), content, count=1)
    
    if n == 0:
        print(f"WARN (no includes-section found): {p['file']}")
        continue
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    changed.append(p['file'])
    print(f"OK: {p['file']}")

print(f"\nDone. Changed {len(changed)} files: {changed}")
