import io

with io.open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count('site-loader.js')
print('site-loader.js count:', count)

gcount = content.count('id="gallery"')
print('gallery section count:', gcount)

# Also check that data-page-id is there
pid_count = content.count('data-page-id')
print('data-page-id count:', pid_count)
