# Elyxian Dental & Smile Studio website

A static site of eight pages: plain HTML, CSS and a little JavaScript. There is no framework, build step or backend.

This is currently a **demonstration**. The clinic's details and clinical content are unconfirmed.

```
index.html       Home
book.html        Booking form, Visit Us, emergency instructions, privacy notice
treatments/      One landing page per treatment (treatments/<name>/index.html)
404.html         Page-not-found (served by Cloudflare Pages and Netlify)
css/styles.css   All styling. Colours, spacing and type sizes are variables at the top.
js/main.js       Clinic details at the top, behaviour below
assets/brand/    Logos and icons cut from the clinic's logo files, for use on the site
assets/logos/    The clinic's original logo files (source only; the site doesn't load them)
assets/photos/   Photos for the site, cropped from the clinic's originals
assets/clinic_photos/  The clinic's original photos (source only; the site doesn't load them)
assets/          The social sharing image
robots.txt, sitemap.xml, _headers (caching and security headers for the host)
seo/             SEO plan, keyword sheet and CTR log. Working files: don't upload.
```

## View it locally

```
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Edit the clinic's details

Open `js/main.js`. Everything is in the `CLINIC` block at the top: names, qualifications, registration number, address, phone, WhatsApp number, email, hours, map URLs and grievance contact.

A value starting with `[PLACEHOLDER]` is unconfirmed and shows on the page with a soft highlight. To confirm one, replace the whole string and remove the prefix:

```js
phone: "[PLACEHOLDER] +91 00000 00000",   // before
phone: "+91 98100 00000",                 // after
```

Setting a real `whatsapp` number (digits only, with country code) switches the form from its demo preview to opening WhatsApp. When everything is confirmed, set `demoMode: false` and the demo strip disappears.

If the hours change, update all of these together: `hours`, `openingHoursSchema`, `closedDays` and `timeWindows`.

### Details that can't come from the config

Link previews and some crawlers don't run JavaScript, so edit these by hand:

| What | Where |
|---|---|
| Domain (replace `https://www.example.com`) | Every HTML page's `<head>` (canonical, `og:url`, `og:image`, JSON-LD), `robots.txt`, `sitemap.xml`, and `url` in the config. Find them all with `grep -rl "www.example.com" .` |
| Page titles and descriptions | `<head>` of each page |
| Text shown if JavaScript is off | The contents of each `data-c` and `data-hours` element in the HTML. Update these to the real values too. |

## Edit other content

- **Treatments:** each has a card (`.focus-card`) and a detail dialog (`.t-dialog`) in `index.html`, and its own page in `treatments/`. If you add or remove one, update all of these: the card and dialog, its page, the footer list on every page, the related list on the other treatment pages, the dropdown in `book.html`, and `sitemap.xml`. A treatment's value in the dropdown must match the `?treatment=` links.
- **Photos:** the files in `assets/photos/` are cropped from `assets/clinic_photos/`, each at 1× and 2× width, with camera and location data removed. To swap one, export a WebP at the same proportions (16:9 and 3:4 for the intro, 3:2 for the three cards, 4:5 for the doctor, 21:9 for the band, 12:5 for the arrival photo; grid tiles as they are) and update `src`, `srcset` and `alt`. Two cards show a patient from behind with his face out of frame. The photo where his profile is visible (`_MG_3853.jpg`) is not used. `assets/og-image.jpg` is the 1200×630 image for link previews.
- **Colours and type:** all are variables at the top of `styles.css`, sampled from the clinic's roll-up banner (`assets/OfflineBanners.JPG`). Gold used for text on a light ground must stay at `--accent-ink` or darker to keep AA contrast.
- **Logos:** the files in `assets/brand/` were cut from the WhatsApp JPEGs in `assets/logos/`. They look sharp at the sizes used, but are compressed copies. Replace them with exports from the original vector file (SVG, AI or PDF) when the clinic can share it.
- **Items to check:** search the HTML for `[CONFIRM]` to find sample clinical and operational content.

## Before going live

**Clinic to supply**
- [ ] All `[PLACEHOLDER]` values, including the doctor's details and personal note
- [ ] The list of services actually provided. Remove any treatment card that doesn't apply.
- [ ] Real payment methods, including whether EMI is available, and sedation availability
- [ ] After-hours emergency arrangements
- [ ] Real sterilisation, equipment and comfort details, and first-visit steps that match practice
- [ ] Photographs still missing: the sterilisation area (the card shows the doctor in mask and gloves for now) and the street entrance
- [ ] Permission to use the doctor's photos and name, and written consent from the patient in the sterilisation and comfort photos. His face isn't shown, but people who know him may recognise him.
- [ ] The logo as an original vector file (SVG, AI or PDF), and confirmation of the trading name "Elyxian Dental & Smile Studio"

**Clinic to review and approve**
- [ ] All clinical text, reviewed by the doctor. The "Reviewed by" line is only true after this.
- [ ] All content against current DCI and Delhi Dental Council advertising rules. The logo's tagline, "A Beautiful Smile Begins With Exceptional Care", is left off the site because "Exceptional" is a self-promotional claim.
- [ ] The privacy notice and consent wording, reviewed for DPDP compliance, with a retention period set
- [ ] Use of the patient-facing WhatsApp account, including who can access it and how long messages are kept

**Developer**
- [ ] Add the clinic's Google Business Profile, Practo and other listing URLs to `profiles` in the config
- [ ] Follow "At launch" in `seo/SEO-PLAN.md`: Search Console, sitemap submission, Rich Results Test
- [ ] Don't upload `seo/`, `assets/clinic_photos/` or `assets/logos/`
- [ ] Set the domain, set `demoMode: false`, and confirm the WhatsApp link reaches the clinic's phone
- [ ] Replace the Google Maps URLs with the clinic's exact listing
- [ ] Update the privacy notice if analytics are ever added
- [ ] Run Lighthouse again on the live URL

## Deploy

Upload the folder to any static host, such as Cloudflare Pages, Netlify or GitHub Pages. No build command is needed. Turn on HTTPS and compression on the host.

**Sharing the demo before the clinic has agreed:** use a private preview link rather than a public address. The pages are open to search engines (only `404.html` is `noindex`), so anything deployed at a public address can be indexed. To keep a preview out of search, add `<meta name="robots" content="noindex">` back to each page, or `X-Robots-Tag: noindex` for `/*` in `_headers`.

## SEO

See `seo/SEO-PLAN.md`. It covers what's built in (treatment landing pages, structured data, sitemap, internal links, caching) and the ongoing work: keyword research, articles, local listings and reviews, headline tests and audits.

## Design notes

**One idea (Michael Bierut).** Dental anxiety is largely uncertainty, so the site is built on one sentence: *you should always know what happens next.* It sets the intro line, the section headings ("What happens at your first visit", "What happens to your information") and the closing line.

**Brand palette and type, from the clinic's roll-up banner.**

| Role | Colour | Source on the banner |
|---|---|---|
| Ivory ground | `#faf6ea` | Background |
| Sand | `#f5ebd9` | Icon circles; alternate sections |
| Forest green | `#2b3c31` | Footer band; dark sections and buttons |
| Ink | `#172821` | Wordmark letters (`#07100c` in the logo file) |
| Gold | `#b59047` | Monogram and rules |
| Gold on dark | `#c6a559` | "Book your appointment" pill |
| Gold text on light | `#806428` | Darkened from the banner's `#998454` to pass AA |

- *Serif:* Cormorant Garamond for headings, matching the logo's classical capitals and the tagline serif.
- *Sans:* Montserrat for body, buttons and spaced gold capitals (section labels), as in "OUR DENTAL SERVICES".
- *Script:* Allura, the nearest open font to the banner's hand lettering. It is used once, for "up to you." in the closing line, because script lettering is hard to read in running text.

**Page structure, after gene.com.**
- *Floating controls:* a light chip (menu and logo) and a light Book button replace the header bar. The menu opens as a full screen of numbered links; the page behind is inert until it closes. On phones and tablets the controls slide away while you scroll down and return when you scroll up; the bottom bar (Call, WhatsApp, Book) stays.
- *Intro:* the clinic's own wordmark, traced to vector from `assets/logos/main.jpeg` (`assets/brand/wordmark.svg`). Scrolling fills the letters with studio photographs from the centre out, zooms symmetrically through the heart-tooth mark into a 3×3 grid of photographs, then opens the centre one to full screen. The zoom point is the thickest part of the mark's stroke, measured when tracing.
- *Sheets:* each section then slides up as a rounded panel, with one full-width photograph between two of them. Treatments follow gene's "Our Focus Areas": a looping carousel on forest green with one ivory card in the centre, its neighbours peeking either side, studio photos in two corners, and a "1 of 6" pager. "Learn more" opens a dialog with who it suits, what to expect, aftercare and the booking link. Without JavaScript the six details are listed instead.
- With reduced motion turned on, or without JavaScript, the intro is the static wordmark and line, and nothing pins or moves.

**Brand language, taken from the clinic's logo.**
- *Type:* the logo pairs spaced serif capitals with spaced sans capitals between hairline rules. The site uses Cormorant Garamond for headings, and spaced gold capitals with a gold hairline rule for section labels.
- *Marks:* the wordmark is in the header (ink) and footer (light), and the EDS monogram in the closing band, favicon and touch icon. The logo's tooth stays within the logo; the site adds no other tooth imagery.

**How it behaves (Don Norman).**
- *Conceptual model:* the five-step timeline shows how a visit works before anyone books, and the form explains exactly what happens after submitting.
- *Signifiers:* buttons look pressable, links are underlined, and a plus turns to a minus when a panel opens.
- *Feedback:* the navigation shows where you are, errors appear beside their fields, and a panel shows the finished message.
- *Constraints:* the date field rejects past dates and closed days, and time of day is a choice rather than free text.
- *Error recovery:* mistakes keep what you typed, focus moves to the first problem, and if WhatsApp fails you can copy, email or call.
- *Mapping:* panels open where you clicked, and a treatment's "Ask about" link preselects it on the form.
