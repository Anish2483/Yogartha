import urllib.request, re

urls = {
    "surya-kriya": "https://isha.sadhguru.org/en/wisdom/sadhguru-spot/bringing-back-suryakriya",
    "yogasanas": "https://isha.sadhguru.org/yoga/yoga-articles-hatha-yoga-asanas/asanas-guide/",
    "angamardhana": "https://isha.sadhguru.org/en/wisdom/article/the-anatomy-of-angamardana",
    "upa-yoga": "https://isha.sadhguru.org/en/wisdom/article/classical-yoga-upayoga-understanding-your-body",
    "shanmuki-mudra": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/shanmuki-mudra",
    "jala-neti": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/jala-neti",
    "eye-care-workshop": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/eye-care-workshop",
    "yoga-for-wellbeing": "https://isha.sadhguru.org/in/en/yoga-meditation/isha-yoga-online-offerings/yoga-for-wellbeing",
    "yoga-for-kids": "https://isha.sadhguru.org/yoga/yoga-for-beginners/yoga-for-kids/",
    "yoga-for-pregnant-women": "https://isha.sadhguru.org/in/en/yoga-meditation/additional-programs/yoga-for-pregnant-women",
    "bhastrika": "https://isha.sadhguru.org/in/en/yoga-meditation/hatha-yoga-wellness-programs/bhastrika-kriya",
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

for page, url in urls.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r:
            html = r.read().decode("utf-8", errors="ignore")
        # og:image
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html)
        img = m.group(1) if m else "NOT_FOUND"
        # og:title
        t = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', html)
        title = t.group(1) if t else "?"
        print(f"{page}|{img}|{title}")
    except Exception as e:
        print(f"{page}|ERROR:{e}|?")
