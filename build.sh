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
echo "Built dist/ with $(find dist -type f | wc -l | tr -d ' ') files"
