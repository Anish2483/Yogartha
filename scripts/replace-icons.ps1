# =====================================================
# Yogartha - Replace all emoji icons with SVG icons
# Run from: C:\Users\jayan\.gemini\antigravity\scratch\yogartha
# =====================================================

# ===== SVG ICON LIBRARY =====
$svgs = @{

  # --- BENEFIT ICONS (large, 44x44) ---
  'sun' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="7" stroke="currentColor" stroke-width="1.5"/><line x1="22" y1="3" x2="22" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="22" y1="35" x2="22" y2="41" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="3" y1="22" x2="9" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="35" y1="22" x2="41" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8.1" y1="8.1" x2="12.3" y2="12.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="31.7" y1="31.7" x2="35.9" y2="35.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="35.9" y1="8.1" x2="31.7" y2="12.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12.3" y1="31.7" x2="8.1" y2="35.9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
  
  'fire' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4 C22 4 30 14 30 22 C30 28 26 32 22 32 C18 32 14 28 14 22 C14 16 18 10 22 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 20 C22 20 26 24 26 28 C26 32 24 35 22 36 C20 35 18 32 18 28 C18 24 22 20 22 20Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  'brain' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 10 C16 10 10 14 10 20 C10 24 12 26 14 28 C14 32 16 36 20 37 L22 37 L24 37 C28 36 30 32 30 28 C32 26 34 24 34 20 C34 14 28 10 22 10Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M22 10 L22 37" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/><path d="M14 20 C16 18 18 20 20 18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M30 20 C28 18 26 20 24 18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'

  'balance' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="6" x2="22" y2="38" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="14" x2="36" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 14 L4 24 C4 24 6 28 8 28 C10 28 12 24 12 24 L8 14Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M36 14 L32 24 C32 24 34 28 36 28 C38 28 40 24 40 24 L36 14Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><circle cx="22" cy="38" r="3" stroke="currentColor" stroke-width="1.2"/></svg>'

  'muscle' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 30 C8 30 10 20 16 16 C20 13 24 13 28 14 C32 15 36 18 36 22 C36 26 32 30 28 31 C24 32 18 30 14 32 C12 33 10 36 10 38" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M28 14 C30 10 36 8 38 12 C40 16 36 20 32 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'

  'cosmos' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="16" stroke="currentColor" stroke-width="1.5"/><ellipse cx="22" cy="22" rx="16" ry="6" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><ellipse cx="22" cy="22" rx="6" ry="16" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><circle cx="22" cy="22" r="2.5" fill="currentColor"/></svg>'

  'eye' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 22 Q14 10 22 10 Q30 10 40 22 Q30 34 22 34 Q14 34 4 22Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="22" cy="22" r="5" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="20" r="1.2" fill="currentColor"/></svg>'

  'water' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 6 Q22 6 11 22 C11 30 16 38 22 38 C28 38 33 30 33 22 Q33 6 22 6Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 28 Q18 32 22 33" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'

  'clarity' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="12" stroke="currentColor" stroke-width="1.5"/><line x1="22" y1="4" x2="22" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="22" y1="36" x2="22" y2="40" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="22" x2="8" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="36" y1="22" x2="40" y2="22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="22" cy="22" r="4" stroke="currentColor" stroke-width="1.2"/></svg>'

  'leaf' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 38 C22 38 8 28 8 16 C8 9 14 4 22 4 C30 4 36 9 36 16 C36 28 22 38 22 38Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M22 38 L22 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 24 L29 17" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M22 20 L15 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'

  'lotus' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 38 C22 38 22 26 22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 22 C22 22 10 24 10 14 C10 14 16 10 22 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 22 C22 22 34 24 34 14 C34 14 28 10 22 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 16 C22 16 16 6 22 4 C28 6 22 16 22 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 38 Q16 34 22 38 Q28 34 34 38" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'

  'breath' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 16 Q12 10 18 16 Q24 22 30 16 Q36 10 42 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M6 22 Q12 16 18 22 Q24 28 30 22 Q36 16 42 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M6 28 Q12 22 18 28 Q24 34 30 28 Q36 22 42 28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>'

  'heart' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 36 C22 36 6 26 6 16 C6 11 10 8 14 8 C17 8 20 10 22 13 C24 10 27 8 30 8 C34 8 38 11 38 16 C38 26 22 36 22 36Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'

  'person' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="10" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M22 16 L22 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 22 L14 18 M22 22 L30 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 30 L16 40 M22 30 L28 40" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'

  'spine' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4 C22 4 18 12 22 20 C26 28 22 38 22 38" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="16" y="8" width="12" height="6" rx="2" stroke="currentColor" stroke-width="1.2"/><rect x="16" y="17" width="12" height="6" rx="2" stroke="currentColor" stroke-width="1.2"/><rect x="16" y="26" width="12" height="6" rx="2" stroke="currentColor" stroke-width="1.2"/></svg>'

  'meditation' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="9" r="3.5" stroke="currentColor" stroke-width="1.5"/><path d="M22 13 L22 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 18 L15 22 M22 18 L29 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 36 Q14 28 22 28 Q30 28 34 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M10 36 Q16 32 22 36 Q28 32 34 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>'

  'elements' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="22,4 40,17 33,38 11,38 4,17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polygon points="22,12 32,19 28,31 16,31 12,19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="22" cy="22" r="2" fill="currentColor"/></svg>'

  'hands' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 22 C14 22 10 18 10 14 C10 11 12 9 14.5 10 L14.5 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 22 C30 22 34 18 34 14 C34 11 32 9 29.5 10 L29.5 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.5 22 Q14.5 34 22 36 Q29.5 34 29.5 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M17 14 L17 22 M20 12 L20 22 M24 12 L24 22 M27 14 L27 22" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'

  'mountain' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 38 L16 10 L24 24 L28 18 L42 38 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 10 L20 18" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/><path d="M28 18 L24 24" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/></svg>'

  'star' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="22,4 26.4,16.2 40,16.2 28.8,24.2 33.2,36.4 22,28.4 10.8,36.4 15.2,24.2 4,16.2 17.6,16.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'

  'book' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8 L8 36 Q8 40 12 40 L36 40 L36 8 Q36 4 32 4 L12 4 Q8 4 8 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 36 Q8 32 12 32 L36 32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 12 L28 12 M16 18 L28 18 M16 24 L22 24" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'

  'briefcase' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="16" width="32" height="22" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M16 16 L16 12 C16 10 18 8 22 8 C26 8 28 10 28 12 L28 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="26" x2="38" y2="26" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/></svg>'

  'clock' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="17" stroke="currentColor" stroke-width="1.5"/><path d="M22 12 L22 22 L30 26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  'house' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 22 L22 6 L38 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 18 L10 38 L34 38 L34 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="18" y="28" width="8" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/></svg>'

  'check' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="17" stroke="currentColor" stroke-width="1.5"/><path d="M13 22 L19 28 L31 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  'sparkle' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 4 L24 18 L38 22 L24 26 L22 40 L20 26 L6 22 L20 18 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'

  'family' = '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="10" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="30" cy="10" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="22" cy="30" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M14 14 L14 26 M30 14 L30 26" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 20 L10 24 M14 20 L18 24 M30 20 L26 24 M30 20 L34 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
}

# ===== SMALL TAG ICON SVGs (18x18 viewBox, same shapes) =====
$tagSvgs = @{
  'sun'        = '<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="7" stroke="currentColor" stroke-width="2"/><line x1="22" y1="3" x2="22" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="35" x2="22" y2="41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="22" x2="9" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="35" y1="22" x2="41" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8.1" y1="8.1" x2="12.3" y2="12.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="31.7" y1="31.7" x2="35.9" y2="35.9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="35.9" y1="8.1" x2="31.7" y2="12.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12.3" y1="31.7" x2="8.1" y2="35.9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  'person'     = '<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="10" r="5" stroke="currentColor" stroke-width="2"/><path d="M22 16 L22 30" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 22 L14 18 M22 22 L30 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 30 L16 40 M22 30 L28 40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  'star'       = '<svg viewBox="0 0 44 44" fill="none"><polygon points="22,4 26.4,16.2 40,16.2 28.8,24.2 33.2,36.4 22,28.4 10.8,36.4 15.2,24.2 4,16.2 17.6,16.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  'book'       = '<svg viewBox="0 0 44 44" fill="none"><path d="M8 8 L8 36 Q8 40 12 40 L36 40 L36 8 Q36 4 32 4 L12 4 Q8 4 8 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 36 Q8 32 12 32 L36 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  'briefcase'  = '<svg viewBox="0 0 44 44" fill="none"><rect x="6" y="16" width="32" height="22" rx="3" stroke="currentColor" stroke-width="2"/><path d="M16 16 L16 12 C16 10 18 8 22 8 C26 8 28 10 28 12 L28 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  'house'      = '<svg viewBox="0 0 44 44" fill="none"><path d="M6 22 L22 6 L38 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 18 L10 38 L34 38 L34 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  'check'      = '<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="17" stroke="currentColor" stroke-width="2"/><path d="M13 22 L19 28 L31 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  'heart'      = '<svg viewBox="0 0 44 44" fill="none"><path d="M22 36 C22 36 6 26 6 16 C6 11 10 8 14 8 C17 8 20 10 22 13 C24 10 27 8 30 8 C34 8 38 11 38 16 C38 26 22 36 22 36Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  'eye'        = '<svg viewBox="0 0 44 44" fill="none"><path d="M4 22 Q14 10 22 10 Q30 10 40 22 Q30 34 22 34 Q14 34 4 22Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="22" cy="22" r="5" stroke="currentColor" stroke-width="2"/></svg>'
  'water'      = '<svg viewBox="0 0 44 44" fill="none"><path d="M22 6 Q22 6 11 22 C11 30 16 38 22 38 C28 38 33 30 33 22 Q33 6 22 6Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  'lotus'      = '<svg viewBox="0 0 44 44" fill="none"><path d="M22 38 C22 38 22 26 22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M22 22 C22 22 10 24 10 14 C10 14 16 10 22 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 22 C22 22 34 24 34 14 C34 14 28 10 22 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 16 C22 16 16 6 22 4 C28 6 22 16 22 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  'leaf'       = '<svg viewBox="0 0 44 44" fill="none"><path d="M22 38 C22 38 8 28 8 16 C8 9 14 4 22 4 C30 4 36 9 36 16 C36 28 22 38 22 38Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 38 L22 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  'brain'      = '<svg viewBox="0 0 44 44" fill="none"><path d="M22 10 C16 10 10 14 10 20 C10 24 12 26 14 28 C14 32 16 36 20 37 L22 37 L24 37 C28 36 30 32 30 28 C32 26 34 24 34 20 C34 14 28 10 22 10Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M22 10 L22 37" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/></svg>'
  'sparkle'    = '<svg viewBox="0 0 44 44" fill="none"><path d="M22 4 L24 18 L38 22 L24 26 L22 40 L20 26 L6 22 L20 18 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>'
  'family'     = '<svg viewBox="0 0 44 44" fill="none"><circle cx="14" cy="10" r="4" stroke="currentColor" stroke-width="2"/><circle cx="30" cy="10" r="4" stroke="currentColor" stroke-width="2"/><path d="M14 14 L14 26 M30 14 L30 26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 20 L10 24 M14 20 L18 24 M30 20 L26 24 M30 20 L34 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
}

# ===== MAPPING: per-page benefit icons (in order: 6 icons per page) =====
$pageIcons = @{
  'surya-kriya.html'           = @('sun','fire','brain','balance','muscle','cosmos')
  'yogasanas.html'             = @('meditation','sun','fire','brain','balance','cosmos')
  'angamardhana.html'          = @('person','muscle','fire','leaf','brain','star')
  'bhuta-shuddhi.html'         = @('elements','water','fire','leaf','balance','clarity')
  'upa-yoga.html'              = @('leaf','sun','fire','brain','balance','muscle')
  'shanmuki-mudra.html'        = @('hands','eye','brain','sun','balance','muscle')
  'jala-neti.html'             = @('water','sun','fire','brain','balance','muscle')
  'eye-care-workshop.html'     = @('eye','sun','fire','brain','balance','muscle')
  'yoga-for-wellbeing.html'    = @('heart','sun','fire','brain','balance','muscle')
  'yoga-for-kids.html'         = @('star','brain','sun','muscle','sparkle','book')
  'yoga-for-pregnant-women.html' = @('lotus','sun','fire','brain','balance','muscle')
  'bhastrika.html'             = @('breath','sun','fire','brain','balance','muscle')
  'hatha-yoga.html'            = @('leaf','sun','meditation','person','elements','sun')
}

# ===== MAPPING: per-page forwhom tag icons (in order) =====
$pageTagIcons = @{
  'surya-kriya.html'           = @('person','muscle','star','book','briefcase','fire')
  'yogasanas.html'             = @('person','muscle','book','brain','house','sun')
  'angamardhana.html'          = @('muscle','person','book','brain','house','star')
  'bhuta-shuddhi.html'         = @('check','person','book','brain','house','star')
  'upa-yoga.html'              = @('person','briefcase','book','sun','star','muscle')
  'shanmuki-mudra.html'        = @('eye','briefcase','brain','book','person','sun')
  'jala-neti.html'             = @('water','muscle','sun','book','person','brain')
  'eye-care-workshop.html'     = @('eye','briefcase','muscle','book','person','sun')
  'yoga-for-wellbeing.html'    = @('person','heart','briefcase','star','family','sun')
  'yoga-for-kids.html'         = @('lotus','book','brain','muscle','star','sun')
  'yoga-for-pregnant-women.html' = @('lotus','muscle','sun','heart','brain','leaf')
  'bhastrika.html'             = @('breath','person','book','brain','house','star')
  'hatha-yoga.html'            = @('person','heart','star','brain','house','briefcase','person','book')
}

$programsDir = "C:\Users\jayan\.gemini\antigravity\scratch\yogartha\programs"

foreach ($filename in $pageIcons.Keys) {
  $filepath = Join-Path $programsDir $filename
  if (-not (Test-Path $filepath)) { Write-Host "SKIP: $filename not found"; continue }

  $content = Get-Content $filepath -Raw -Encoding UTF8
  $icons = $pageIcons[$filename]
  $tagIcons = $pageTagIcons[$filename]

  # --- Replace benefit-icon divs ---
  # Find all <div class="benefit-icon">...</div> and replace sequentially
  $benefitPattern = '(<div class="benefit-icon">)[^<]*(</div>)'
  $idx = 0
  $content = [regex]::Replace($content, $benefitPattern, {
    param($m)
    $svg = if ($idx -lt $icons.Count) { $svgs[$icons[$idx]] } else { $svgs['star'] }
    $idx++
    "$($m.Groups[1].Value)`n            $svg`n          $($m.Groups[2].Value)"
  })

  # --- Replace forwhom-tag span emojis ---
  # Pattern: <span>&#XXXXX;</span>
  $tagPattern = '<span>&#[0-9]+;</span>'
  $tidx = 0
  $content = [regex]::Replace($content, $tagPattern, {
    param($m)
    $svgKey = if ($tidx -lt $tagIcons.Count) { $tagIcons[$tidx] } else { 'check' }
    $tidx++
    $svg = $tagSvgs[$svgKey]
    "<span class=`"tag-icon`">$svg</span>"
  })

  # Write back
  [System.IO.File]::WriteAllText($filepath, $content, [System.Text.Encoding]::UTF8)
  Write-Host "DONE: $filename"
}

Write-Host "`nAll pages updated."
