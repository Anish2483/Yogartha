import os, re

svg_base = '<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'

icons = {
    'energy': svg_base + '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>', # Changed to Zap:
    'zap': svg_base + '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    'mind': svg_base + '<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>', # Brain
    'eye': svg_base + '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    'breath': svg_base + '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>', # Wind
    'body': svg_base + '<path d="M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="m11 22-1-7-5 2"/><path d="m13 22 1-7 5 2"/><path d="M7 11V7l5-2 5 2v4"/><path d="M12 9v6"/></svg>', # Activity/Person
    'heart': svg_base + '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    'spine': svg_base + '<path d="M12 2v20"/><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h8"/></svg>', # Column
    'elements': svg_base + '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>', # Droplet
    'lotus': svg_base + '<path d="M12 22c4-4 8-6 8-12A8 8 0 0 0 4 10c0 6 4 8 8 12Z"/><path d="M12 22c-2-4-4-6-4-12a4 4 0 0 1 8 0c0 6-2 8-4 12Z"/><path d="M12 10a2 2 0 0 0-4 0c0 4 2 6 4 8 2-2 4-4 4-8a2 2 0 0 0-4 0Z"/></svg>',
    'sleep': svg_base + '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>', # Moon
    'balance': svg_base + '<path d="M12 2v20"/><path d="M4 12h16"/><circle cx="12" cy="12" r="2"/></svg>', # Balance/Target
    'sun': svg_base + '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    'shield': svg_base + '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' # Immunity/Protection
}

def get_icon_for_benefit(title):
    t = title.lower()
    if any(x in t for x in ['eye', 'vision', 'face']): return icons['eye']
    if any(x in t for x in ['energy', 'surya', 'fire', 'heat', 'vigor']): return icons['sun']
    if any(x in t for x in ['mind', 'mental', 'focus', 'alertness', 'sharpness', 'clarity', 'medita']): return icons['mind']
    if any(x in t for x in ['breath', 'lung', 'respirat', 'sinus', 'pranayama', 'nasal']): return icons['breath']
    if any(x in t for x in ['heart', 'joy', 'emotion', 'wellbeing', 'stress', 'calm', 'pregnan', 'labour']): return icons['heart']
    if any(x in t for x in ['spine', 'spinal', 'skeletal', 'bone', 'joint']): return icons['spine']
    if any(x in t for x in ['body', 'physic', 'fitness', 'strength', 'endurance', 'angamardhana', 'deterioration', 'fatigue', 'muscle']): return icons['body']
    if any(x in t for x in ['element', 'bhuta shuddhi', 'water', 'earth']): return icons['elements']
    if any(x in t for x in ['sleep', 'stillness']): return icons['sleep']
    if any(x in t for x in ['balance', 'stability', 'nervous', 'hormon']): return icons['balance']
    if any(x in t for x in ['immune', 'health', 'disease']): return icons['shield']
    return icons['lotus']

for fname in os.listdir('programs'):
    if not fname.endswith('.html'): continue
    path = os.path.join('programs', fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will replace <div class="benefit-icon"> <svg ...> </svg> </div>
    # Using a regex that finds the benefit card, its icon, and its title.
    
    def replacer(match):
        pre_icon = match.group(1)
        old_svg = match.group(2)
        post_icon = match.group(3)
        title = match.group(4)
        
        new_svg = get_icon_for_benefit(title)
        
        return f"{pre_icon}{new_svg}{post_icon}{title}</h4>"
    
    # regex:
    # 1: <div class="benefit-card.*?<div class="benefit-icon">\s*
    # 2: <svg.*?</svg>\s*
    # 3: </div>\s*<h4>
    # 4: title text
    
    pattern = re.compile(r'(<div class="benefit-card[^>]*>.*?<div class="benefit-icon">\s*)(<svg.*?</svg>\s*)(</div>\s*<h4>)(.*?)(</h4>)', re.DOTALL | re.IGNORECASE)
    
    new_content = pattern.sub(replacer, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
print('Done!')
