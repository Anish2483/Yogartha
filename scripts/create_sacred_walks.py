import os

template_path = os.path.join('programs', 'surya-kriya.html')
out_path = os.path.join('programs', 'sacred-walks.html')

with open(template_path, 'r', encoding='utf-8') as f:
    template = f.read()

# Replace specific meta tags and title
template = template.replace('Surya Kriya &ndash; Classical Sun Practice | Yogartha', 'Sacred Walks | Pilgrimages | Yogartha')
template = template.replace('data-page-id="surya-kriya"', 'data-page-id="sacred_walks"')
template = template.replace('images/suryakriya.jpeg', 'images/adiyogi_hero.jpg')
template = template.replace('Surya Kriya', 'Sacred Walks')
template = template.replace('A potent yogic practice of tremendous antiquity, designed as a holistic process for health, wellness, and complete inner wellbeing.', 'Journey to places of great spiritual significance, including Kailash Manasarovar, Varanasi, and the Himalayas.')
template = template.replace('<span class="hero-tag">Complete Spiritual Sadhana</span>', '<span class="hero-tag">Guided Journeys</span>')
template = template.replace('<span class="hero-tag">21-Step Practice</span>', '<span class="hero-tag">Profound Spaces</span>')
template = template.replace('Classical Practice', 'Pilgrimage')

# Extract the content section. We will replace everything inside the <main> block or similar content block.
# Usually it's <section class="program-content section-pad"> ... </section>
import re
match = re.search(r'<section class="program-content section-pad">.*?</section>', template, re.DOTALL)

if match:
    new_content = """<section class="program-content section-pad">
 <div class="container grid-2 program-grid">
 <div class="program-text reveal-left">
 <h2>Why Do People Go on Pilgrimages?</h2>
 <p><strong>Sadhguru looks at the significance and purpose behind making a journey to a sacred space.</strong></p>
 
 <p><strong>Sadhguru:</strong> What is the difference between travel, a journey and a pilgrimage? People move from one place to another for a variety of reasons. There are explorers who are always looking for virgin land that they want to put their footprint on. They want to prove something. There are travelers who are curious to see everything, so they travel. There are tourists who just go to relax. There are other kinds of tourists who just go to escape from their work or family. But a pilgrim is not going for any of these purposes. A pilgrimage is not a conquest, it is a surrender. It is a way of getting yourself out of the way. If you do not budge, it is a way of wearing yourself out. A process of destroying all that is limited and compulsive and arriving to a boundless state of consciousness.</p>
 
 <p>The very idea behind a pilgrimage is fundamentally to subdue the sense of who you are. It is to become nothing in the process of just walking and climbing and subjecting yourself to various arduous processes of nature. In the ancient past, to get to such places, a person had to go through a certain amount of physical, mental, and every kind of hardship, so that he becomes less than who he thinks he is right now. Today things have been made much more comfortable. We are flying up, driving down and just walking a little bit.</p>
 
 <p>Physically, we are much weaker human beings than what they used to be a thousand years ago because somewhere we do not know how to make use of the comforts and conveniences for our wellbeing. We have used them to make ourselves weaker, at more difficulty with ourselves and with the surroundings in which we exist. So the fundamental idea of pilgrimage becomes all the more relevant to modern societies than it was to the ancient ones.</p>
 
 <p>Hardship is not necessary but most people are unwilling to dissolve, so you have to wear them down. It is unfortunate that most human beings cannot grow in comfort. It would be wonderful to grow in comfort but unfortunately, most human beings become frivolous when there is comfort. Some profoundness comes to them only when there is hardship. But it need not be so. Something else need not beat us down. We must have the sense to understand that if we want to experience something larger than ourselves and touch dimensions which are not yet in our perception, the most important thing is that the sense of who you are should go down.</p>
 
 <blockquote>"A trek or a mountaineering feat is always about achievement, to make yourself bigger than who you are. But a pilgrimage is about dissolution, to subdue yourself and become nothing, No-thing."</blockquote>
 
 <p>If you have a working head, you would make your life into a pilgrimage. If your life is not a constant process of reaching for something higher than where you are right now, what kind of life is that? If this life is not constantly longing for something higher than what it is, that is not much of a life. If you are aspiring and working towards something higher, then your life is a pilgrimage.</p>

 <p>Isha Sacred Walks are journeys to places of divine connection, where the veil between the physical and spiritual is thin. Such sacred spaces revitalize and energize us, and give us an experience of our inner nature.</p>
 </div>
 
 <div class="program-sidebar reveal-right">
 <div class="sidebar-card">
 <h3>Register Interest</h3>
 <p>To learn about upcoming Sacred Walks, retreats, and pilgrimages, please register your interest. We will notify you when dates are announced.</p>
 <a href="../index.html#contact" class="btn btn-primary btn-full" style="margin-top:20px;">Contact Us</a>
 </div>
 <div class="overview-image" style="margin-top:30px; border-radius:12px; overflow:hidden;">
 <img src="../images/ashram_courtyard.png" alt="Sacred Walks Journey" style="width:100%; display:block;" />
 </div>
 </div>
 </div>
 </section>"""
    template = template[:match.start()] + new_content + template[match.end():]
    
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(template)

print("Created sacred-walks.html")
