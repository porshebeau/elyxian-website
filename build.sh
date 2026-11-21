#!/bin/sh
# Cloudflare Pages build: copy only the public website into dist/.
# Pages settings: build command "sh build.sh", output directory "dist".
# Working files (seo/, .agents/, README.md, raw photos in assets/clinic_photos and assets/logos) stay out.
set -e
rm -rf dist
mkdir -p dist/assets
cp index.html book.html 404.html robots.txt sitemap.xml llms.txt _headers dist/
cp -R css js treatments dist/
cp -R assets/brand assets/photos dist/assets/
cp assets/og-image.jpg dist/assets/
# Cache-busting: add a content fingerprint to the CSS and JS links, so a new deploy
# is never paired with a stale cached copy (they are cached for a day).
css_v=$(cksum css/styles.css | cut -d' ' -f1)
js_v=$(cksum js/main.js | cut -d' ' -f1)
find dist -name '*.html' | while read -r f; do
  sed -e "s#css/styles\.css\"#css/styles.css?v=$css_v\"#g" -e "s#js/main\.js\"#js/main.js?v=$js_v\"#g" "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
echo "Built dist/ with $(find dist -type f | wc -l | tr -d ' ') files"
