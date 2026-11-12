# SEO plan: Elyxian Dental & Smile Studio

This plan follows the eight-step process in Apollo Digital's "SEO process" guide (apollodigital.io/blog/seo-process), adapted for a local dental clinic on a static site. The guide's WordPress plugins (WP Rocket, Smush, Yoast, Rank Math) aren't needed here: this file and the site already cover what they would do.

**Status (12 Nov 2026):** Steps 1, 3 and 6 are built into the site. Steps 2, 4, 5, 7 and 8 are ongoing work and start at launch. All public pages are open to search engines; only `404.html` is `noindex`.

Working files in this folder (don't upload it to the host):

| File | Use |
|---|---|
| `keywords.csv` | The keyword sheet (Step 2): phrase, page, priority, status, topic cluster, volume, CPC |
| `ctr-tests.csv` | The headline test log (Step 7) |

---

## Step 1. Technical and on-page SEO

**Done**

| Guide item | How the site handles it |
|---|---|
| Sitemap | `sitemap.xml` lists all 8 public pages with `lastmod` dates |
| robots.txt | Allows everything except source photos, original logo files and `/seo/` |
| Crawl depth under 4 | Every page is one click from the home page (treatment dialogs and footer), and two at most from any other page |
| Next-gen images | All photos are WebP, served at 1x and 2x through `srcset`, with width and height set |
| Images not resized in CSS | Every image ships at roughly its display size; the browser picks from `srcset` |
| Lazy loading | Everything below the first screen uses `loading="lazy"` |
| Duplicate content | Each page has a canonical URL. Each treatment page is unique, not a reworded copy. |
| Gzip and minifying | Cloudflare Pages and Netlify compress files automatically. There are 3 local files (one CSS, one JS, one HTML), so bundling gains little. |
| CDN | Cloudflare Pages serves from Cloudflare's CDN. A separate BunnyCDN isn't needed at this traffic. |
| Caching | `_headers` caches photos for 30 days and CSS/JS for a day |
| On-page best practice | One `h1` per page, with the target phrase in it. A title of up to about 60 characters and a meta description of up to about 155. Descriptive alt text. Open Graph and Twitter cards. |
| Structured data | `Dentist` (with address, hours, map, profiles and the doctor) and `WebSite` on the home page. `BreadcrumbList` on every inner page. `MedicalWebPage` and `MedicalProcedure` on each treatment page. `FAQPage` built from each page's questions. |
| 404 page | `404.html` links back to the main pages |

**At launch**
1. Replace `https://www.example.com` everywhere (`grep -rl "www.example.com" .`).
2. Fill in `profiles` in `js/main.js` with the Google Business Profile, Practo and other listing URLs.
3. Run PageSpeed Insights on mobile and desktop for the home page and one treatment page. Aim for a load under 2–3 seconds.
4. Test the structured data with Google's Rich Results Test.
5. Set up Google Search Console and Bing Webmaster Tools, verified by DNS so no tracking code goes on the site, and submit `sitemap.xml`.

## Step 2. Keyword research

`keywords.csv` is a first pass: 42 phrases, each mapped to a page, with priorities set by judgement. Volume and CPC are blank, so priorities are provisional until real numbers are in.

1. List the top 5 *SEO* competitors: the dental clinics that rank in Google's top results for "dentist in lajpat nagar", "dental implants south delhi" and similar searches. Practo and Justdial listings are directories, not competitors.
2. Run each competitor through Semrush Organic Research, or Ahrefs or Ubersuggest, and add their relevant keywords to the sheet.
3. Run the top keywords through Ubersuggest or Google Keyword Planner for related phrases, volume and CPC.
4. Re-rank priorities. A high CPC usually means a phrase converts well.

**Local note.** For "dentist near me" searches, Google shows the map pack before any website. Ranking there depends mainly on the Google Business Profile, its reviews, and distance from the searcher. The website supports this, so Step 5's local listings matter as much as anything on the site.

## Step 3. Landing pages

**Done.** There is one page per treatment, each aimed at a direct-intent local phrase:

| Page | Primary phrase |
|---|---|
| `/treatments/general-dentistry/` | dental check-up / teeth cleaning in Lajpat Nagar |
| `/treatments/cosmetic-dentistry/` | cosmetic dentist, teeth whitening in Lajpat Nagar |
| `/treatments/dental-implants/` | dental implants in Lajpat Nagar |
| `/treatments/braces-and-aligners/` | braces / clear aligners in Lajpat Nagar |
| `/treatments/root-canal-treatment/` | root canal treatment in Lajpat Nagar |
| `/treatments/childrens-dentistry/` | children's (pediatric) dentist in Lajpat Nagar |

Each page follows the same structure: who it suits, the steps, aftercare, four questions, links to the other treatments, and a booking link that preselects the treatment.

**Before launch:** the doctor reviews every page (each is marked `[CONFIRM]`), and the clinic removes any treatment it doesn't offer. Also remove the matching footer link, sitemap entry and booking dropdown option.

**What not to do:** don't clone a page for each nearby area ("dentist in Defence Colony", "dentist in Amar Colony") with the place name swapped. Google treats these as doorway pages. The guide's "template landing page" approach suits genuinely different phrasings of one service, not different places.

## Step 4. Blog content

The `(blog)` rows in `keywords.csv` are the content backlog. They are informational searches, which are easier to rank for than landing pages.

**Outline for each article**
1. Word count: about 1.5x the top-ranking article, unless that article is already thorough.
2. Headings: follow the structure of the top 3–5 results, and mark each heading h2 or h3.
3. For each heading, state in plain words what the section must cover.
4. Look on Reddit (r/india, r/delhi, r/Dentistry) and Quora for the questions people actually ask, and answer them.
5. Add at least 3 internal links: one to the relevant treatment page, one to booking, and one to a related article.

**Writing rules for this clinic**
- Use the site's existing voice: plain, calm, and specific about what happens next. Avoid fluff.
- Make no claims of superiority, guarantees, prices, before-and-after photos or patient testimonials. The DCI code restricts self-promotion by dentists.
- The doctor reviews every article before it goes live. Use real photographs, not stock.
- Check drafts with Grammarly and Hemingway.

Suggested first three, linked to the highest-value landing pages: "Is root canal treatment painful?", "Dental implant or bridge?" and "Braces or clear aligners?"

When the first article is ready, add a `/blog/` index page and its URLs to `sitemap.xml`.

## Step 5. Links

Local dentistry isn't a link-war niche. Most of the gain comes from consistent local listings and a handful of genuine local links.

1. **Google Business Profile.** This is the biggest single factor for local search. Use the same name, address and phone number (NAP) as the site, choose the category "Dentist", list the treatments as services, add real photographs, and add the website link.
2. **Citations**, with exactly the same NAP everywhere: Practo, Justdial, Lybrate, Sulekha, Bing Places, Apple Business Connect, and the clinic's Instagram and Facebook pages. Add each URL to `profiles` in `js/main.js`.
3. **Reviews.** Ask patients after a visit for an honest Google review. Don't offer incentives, and don't copy reviews onto the website. Reply to every review without mentioning any treatment details (patient confidentiality).
4. **Local links.** Resident welfare associations, schools (a children's dental talk), local news, Lajpat Nagar market associations, and the doctor's dental college alumni page.
5. **Linkable asset**, later on: a useful free resource, such as a printable children's brushing chart or a "what to do in a dental emergency" card, shared in local parent and community groups.

## Step 6. Internal links

**Done.**
- The home page treatment dialogs link to each full treatment page.
- Every page's footer lists all six treatments.
- Each treatment page links to the other five, to booking (with the treatment preselected), to the first-visit steps and to the emergency instructions where relevant.
- Breadcrumbs on each treatment page.

**Ongoing:** every new article links to at least 3 relevant pages. Twice a year, search `site:yourdomain.com "dental implants"` (and synonyms such as "implant") and link any unlinked mentions to the right page.

## Step 7. Headline CTR

Start once Search Console has 28 days of data.

1. Export each page's CTR and average position for the last 28 days into `ctr-tests.csv`.
2. Compare each page with these rough benchmarks: position 1 ≈ 32%, 2 ≈ 25%, 3 ≈ 19%, 4 ≈ 14%, 5 ≈ 10%, 6 ≈ 6%, 7 ≈ 4%, 8 ≈ 3%, 9 ≈ 3%. Local searches with a map pack get lower CTRs.
3. For each underperforming page, write 4–5 title ideas, implement the best, and record the date.
4. Wait 3–4 weeks. Keep the title if it wins, or try the next one.

Titles must stay factual and free of superlatives ("best", "top", "No. 1"), for DCI reasons.

## Step 8. Track and improve

Review rankings monthly in Search Console. If a page has little traffic 6–12 months after launch, audit it:

- **Content:** is it as thorough as the top results? Are the images real and useful? Is it up to date, and reviewed by the doctor?
- **Internal links:** does it link to and from enough relevant pages? (Search Console → Links → Internal links.)
- **Backlinks and local signals:** does the clinic have as many quality citations and reviews as the clinics ranking above it? Are the links from India? Disavow obvious spam.
- **Speed:** does it load in under 3 seconds on mobile (PageSpeed Insights)? Are the images compressed and lazy-loaded?
