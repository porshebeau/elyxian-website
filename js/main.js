/* ==========================================================================
   CLINIC DETAILS: edit everything here, in one place.

   A value starting with "[PLACEHOLDER]" is unconfirmed. It displays without
   that prefix, with a soft highlight, so it is easy to spot on the page.
   When you have the real value, replace the whole string and drop the prefix.

   Page titles, meta tags, canonical URLs, robots.txt and sitemap.xml cannot
   be set from here. README.md lists them.
   ========================================================================== */
const CLINIC = {
  demoMode: true, // false removes the demo strip

  name: "Elyxian Dental & Smile Studio",
  url: "[PLACEHOLDER] https://www.example.com/",

  doctorName: "Dr. Komal Sharma",
  doctorQualifications: "[PLACEHOLDER] BDS, MDS (speciality), university",
  doctorSpecialisation: "[PLACEHOLDER] Area of specialisation",
  doctorRegistration: "[PLACEHOLDER] Delhi Dental Council Reg. No. 00000",
  doctorNote: "[PLACEHOLDER] A few lines in the doctor’s own words: why they practise, and how they like to work with the people they treat.",

  addressLine: "[PLACEHOLDER] Building and street",
  locality: "Lajpat Nagar",
  city: "New Delhi",
  region: "Delhi",
  postalCode: "[PLACEHOLDER] 110024",
  latitude: "[PLACEHOLDER] 28.5677",
  longitude: "[PLACEHOLDER] 77.2433",

  phone: "[PLACEHOLDER] +91 00000 00000",
  whatsapp: "[PLACEHOLDER] 910000000000", // digits with country code (e.g. 919810000000)
  email: "[PLACEHOLDER] hello@example.com",
  submitWebhookUrl: "", // Optional: URL to send JSON consultation leads in the background (e.g. Formspree/Make/Apps Script)

  hours: [
    { days: "[PLACEHOLDER] Monday to Saturday", time: "[PLACEHOLDER] 10:00 am to 7:00 pm" },
    { days: "[PLACEHOLDER] Sunday", time: "[PLACEHOLDER] Closed" }
  ],
  openingHoursSchema: "[PLACEHOLDER] Mo-Sa 10:00-19:00", // same hours, for search engines
  closedDays: [0], // 0 = Sunday ... 6 = Saturday; the date field rejects these
  timeWindows: ["Morning (10 am to 1 pm)", "Afternoon (1 pm to 4 pm)", "Evening (4 pm to 7 pm)"],
  firstVisitLength: "[PLACEHOLDER] about 45 minutes",

  landmark: "[PLACEHOLDER] Nearest landmark, for example a market or a well-known building",
  metro: "[PLACEHOLDER] Lajpat Nagar Metro (Violet and Pink Lines), gate and walking time to confirm",
  parking: "[PLACEHOLDER] Where to park, and whether a space can be reserved",
  accessibility: "[PLACEHOLDER] Step-free entry, lift and wheelchair access to confirm",
  mapEmbedUrl: "[PLACEHOLDER] https://www.google.com/maps?q=Lajpat+Nagar,+New+Delhi&output=embed",
  mapLinkUrl: "[PLACEHOLDER] https://www.google.com/maps/search/?api=1&query=Lajpat+Nagar,+New+Delhi",

  payment: "[PLACEHOLDER] UPI, debit and credit cards, and EMI through selected banks",
  afterHours: "[PLACEHOLDER] Outside clinic hours, send a WhatsApp message and the clinic will reply at the earliest opening.",

  // For search engines only (structured data). List the clinic's public profiles:
  // Google Business Profile, Practo, Justdial, Instagram and so on. Placeholders are skipped.
  areaServed: ["Lajpat Nagar", "South Delhi", "New Delhi"],
  profiles: [
    "[PLACEHOLDER] https://g.page/your-google-business-profile",
    "[PLACEHOLDER] https://www.practo.com/delhi/clinic/your-clinic"
  ],

  grievanceOfficer: "[PLACEHOLDER] Name of grievance officer",
  grievanceEmail: "[PLACEHOLDER] grievance@example.com",
  retention: "[PLACEHOLDER] 12 months"
};

/* ========================================================================== */

(function () {
  "use strict";

  const PREFIX = "[PLACEHOLDER]";
  const isPlaceholder = (v) => typeof v === "string" && v.startsWith(PREFIX);
  const clean = (v) => (isPlaceholder(v) ? v.slice(PREFIX.length).trim() : v);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const $ = (selector, root) => (root || document).querySelector(selector);

  CLINIC.addressFull = (isPlaceholder(CLINIC.addressLine) || isPlaceholder(CLINIC.postalCode) ? PREFIX + " " : "") +
    `${clean(CLINIC.addressLine)}, ${CLINIC.locality}, ${CLINIC.city} ${clean(CLINIC.postalCode)}`;

  /* Fill the page -------------------------------------------------------- */
  function setValue(el, value) {
    el.textContent = clean(value);
    el.classList.toggle("ph", isPlaceholder(value));
  }

  $$("[data-c]").forEach((el) => {
    if (el.dataset.c in CLINIC) setValue(el, CLINIC[el.dataset.c]);
  });

  $$("[data-hours]").forEach((list) => {
    list.textContent = "";
    CLINIC.hours.forEach((row) => {
      const li = document.createElement("li");
      const days = document.createElement("span");
      const time = document.createElement("span");
      setValue(days, row.days);
      setValue(time, row.time);
      li.append(days, " ", time);
      list.append(li);
    });
  });

  const whatsappDigits = clean(CLINIC.whatsapp).replace(/\D/g, "");
  const whatsappReady = !isPlaceholder(CLINIC.whatsapp) && whatsappDigits.length >= 10;
  function whatsappUrl(text) {
    const base = whatsappReady ? `https://wa.me/${whatsappDigits}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(text)}`;
  }
  const phoneHref = `tel:${clean(CLINIC.phone).replace(/[^+\d]/g, "")}`;
  const links = {
    call: phoneHref,
    whatsapp: whatsappUrl(`Hello ${CLINIC.name}, I have a question about visiting the clinic.`),
    email: `mailto:${clean(CLINIC.email)}`,
    grievance: `mailto:${clean(CLINIC.grievanceEmail)}`,
    map: clean(CLINIC.mapLinkUrl)
  };
  $$("[data-link]").forEach((a) => { a.href = links[a.dataset.link]; });

  if (!CLINIC.demoMode) $$("[data-demo-strip]").forEach((el) => el.remove());

  /* Structured data ------------------------------------------------------
     The clinic (Dentist) on the home and booking pages, built from CLINIC.
     Each page's questions (FAQPage) are read from its [data-faq] lists.
     Breadcrumbs and the treatment pages' markup are written in the HTML. */
  const addLd = (data) => {
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(data);
    document.head.append(ld);
  };
  const siteUrl = clean(CLINIC.url).replace(/\/?$/, "/");
  const pageType = document.body.dataset.page;

  if (pageType === "home") {
    addLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: CLINIC.name,
      url: siteUrl,
      inLanguage: "en-IN",
      publisher: { "@id": siteUrl + "#clinic" }
    });
  }

  if (pageType === "home" || pageType === "book") {
    addLd({
      "@context": "https://schema.org",
      "@type": "Dentist",
      "@id": siteUrl + "#clinic",
      name: CLINIC.name,
      url: siteUrl,
      image: siteUrl + "assets/og-image.jpg",
      logo: siteUrl + "assets/brand/apple-touch-icon.png",
      medicalSpecialty: "Dentistry",
      areaServed: CLINIC.areaServed,
      hasMap: clean(CLINIC.mapLinkUrl),
      sameAs: CLINIC.profiles.filter((v) => v && !isPlaceholder(v)),
      employee: { "@type": "Person", name: clean(CLINIC.doctorName), jobTitle: "Dentist" },
      telephone: clean(CLINIC.phone).replace(/\s/g, ""),
      email: clean(CLINIC.email),
      address: {
        "@type": "PostalAddress",
        streetAddress: clean(CLINIC.addressLine),
        addressLocality: `${CLINIC.locality}, ${CLINIC.city}`,
        addressRegion: CLINIC.region,
        postalCode: clean(CLINIC.postalCode),
        addressCountry: "IN"
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: Number(clean(CLINIC.latitude)),
        longitude: Number(clean(CLINIC.longitude))
      },
      openingHours: clean(CLINIC.openingHoursSchema)
    });
  }

  const faqs = $$("[data-faq] .disclosure").map((d) => ({
    "@type": "Question",
    name: $(".disclosure-title", d).textContent.trim(),
    acceptedAnswer: { "@type": "Answer", text: $(".disclosure-body", d).textContent.replace(/\s+/g, " ").trim() }
  }));
  if (faqs.length) addLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs });

  /* Menu: a full-screen panel. While it is open, the page behind is inert -- */
  const toggle = $(".menu-toggle");
  const nav = $(".site-nav");
  if (toggle && nav) {
    const label = $(".menu-label", toggle);
    const behind = $$("body > *:not(.site-header):not(script)").concat($$(".site-header .chip-book"));
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
      document.documentElement.classList.toggle("menu-open", open);
      behind.forEach((el) => { el.inert = open; });
      if (open) $("a", nav).focus();
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* On phones the floating controls step aside while you read down the page
     and come back as soon as you scroll up (the CSS limits this to small screens) */
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY, root = document.documentElement;
    if (Math.abs(y - lastY) < 8) return;
    root.classList.toggle("chrome-away", y > lastY && y > 240 && !root.classList.contains("menu-open"));
    lastY = y;
  }, { passive: true });

  /* Show where you are in the navigation --------------------------------- */
  const spyLinks = $$('.site-nav a[href^="#"]');
  if (spyLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        spyLinks.forEach((a) => {
          if (a.getAttribute("href") === `#${entry.target.id}`) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    spyLinks.forEach((a) => {
      const section = $(a.getAttribute("href"));
      if (section) spy.observe(section);
    });
  }

  /* Scroll: intro progress, the logo appearing after it, and parallax ----- */
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const intro = $(".intro");
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const span = (p, from, to) => clamp01((p - from) / (to - from));

  // The thickest point of the heart-tooth stroke, measured when the wordmark
  // was traced (scratchpad/trace_logo.py). Zooming there keeps the zoom centred.
  const MARK = { width: 564, fx: .4923, fy: .5474, core: 4.33 };
  let stage = null;

  function layoutStage() {
    const box = $(".intro-stage", intro).getBoundingClientRect();
    const img = $(".intro-wordmark img", intro).getBoundingClientRect();
    const vw = box.width, vh = box.height, gap = 6;
    const tw = (vw - 2 * gap) / 3, th = (vh - 2 * gap) / 3;
    const L = img.left - box.left, T = img.top - box.top, W = img.width, H = img.height;
    stage.svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
    const wide = vw >= vh;
    const centre = wide ? (vw * (window.devicePixelRatio || 1) > 1700 ? "intro-wide-2400" : "intro-wide-1600") : "intro-tall-1000";
    stage.tiles.forEach((tile, i) => {
      tile.setAttribute("x", (i % 3) * (tw + gap));
      tile.setAttribute("y", Math.floor(i / 3) * (th + gap));
      tile.setAttribute("width", tw);
      tile.setAttribute("height", th);
      if (i === 4) tile.setAttribute("href", `assets/photos/${centre}.webp`);
    });
    const unit = W / MARK.width;
    stage.geo = {
      vw, vh, L, T, unit,
      x0: L + MARK.fx * W, y0: T + MARK.fy * H,
      // grow until the stroke covers the whole screen, corners included
      sMax: 1.08 * vw / 2 / (unit * fitInStroke(vw / vh)),
      gMax: Math.max(vw / tw, vh / th)
    };
  }

  // Half the width, in logo units, of the largest screen-shaped box centred on
  // the zoom point that fits inside the heart-tooth stroke. The stroke runs
  // diagonally, so the screen's corners are what limit the zoom, not its centre.
  function fitInStroke(aspect) {
    const path = stage.marks[1];
    const cx = MARK.fx * MARK.width, cy = MARK.fy * (MARK.width * 102 / 564);
    const fallback = MARK.core / Math.hypot(1, 1 / aspect) / 1.15;
    if (!path.isPointInFill) return fallback;
    const pt = (x, y) => { const p = stage.svg.createSVGPoint(); p.x = x; p.y = y; return path.isPointInFill(p); };
    const fits = (h) => {
      const v = h / aspect;
      for (let i = 0; i < 32; i++) {
        const t = (i / 32) * 4, side = Math.floor(t), f = t - side;
        const x = [-h + 2 * h * f, h, h - 2 * h * f, -h][side];
        const y = [-v, -v + 2 * v * f, v, v - 2 * v * f][side];
        if (!pt(cx + x, cy + y)) return false;
      }
      return pt(cx, cy);
    };
    let lo = 0, hi = MARK.core * 2;
    if (!fits(.05)) return fallback;
    for (let i = 0; i < 20; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    return lo;
  }

  function drawStage(p) {
    const g = stage.geo;
    const fill = ease(span(p, .03, .2));          // photographs fill the letters, from the centre out
    const zoom = ease(span(p, .22, .62));         // then the view zooms through the mark
    const open = ease(span(p, .7, .92));          // and the centre photograph opens to fill the screen
    stage.fill.setAttribute("x", g.vw / 2 * (1 - fill));
    stage.fill.setAttribute("width", g.vw * fill);
    const s = Math.pow(g.sMax, zoom);
    const px = g.x0 + (g.vw / 2 - g.x0) * zoom, py = g.y0 + (g.vh / 2 - g.y0) * zoom;
    const m = `matrix(${s * g.unit} 0 0 ${s * g.unit} ${px + s * (g.L - g.x0)} ${py + s * (g.T - g.y0)})`;
    stage.marks.forEach((el) => el.setAttribute("transform", m));
    stage.logo.style.opacity = fill < 1 ? 1 : 0;
    const k = 1 + (g.gMax - 1) * open;
    stage.grid.setAttribute("transform", `translate(${g.vw / 2} ${g.vh / 2}) scale(${k}) translate(${-g.vw / 2} ${-g.vh / 2})`);
    stage.type.style.opacity = 1 - span(p, .06, .2);
    stage.type.style.visibility = p > .2 ? "hidden" : "";
    stage.cue.style.opacity = 1 - span(p, 0, .04);
    stage.caption.style.opacity = span(p, .9, .97);
  }

  async function buildStage() {
    const text = await (await fetch($(".intro-wordmark img", intro).getAttribute("src"))).text();
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    const [ink, gold] = $$("path", doc).map((el) => el.getAttribute("d"));
    const gradient = $("linearGradient", doc).outerHTML;
    const photos = intro.dataset.photos.split(/\s+/);
    const svg = $(".intro-svg", intro);
    svg.innerHTML =
      // a clipPath may hold shapes but not groups, so each path carries the transform
      `<defs>${gradient}<clipPath id="mark-clip"><path class="mark" d="${ink}"/><path class="mark" d="${gold}"/></clipPath>` +
      `<clipPath id="fill-clip"><rect class="fill" y="-1" height="100%"/></clipPath></defs>` +
      `<g class="logo"><g class="mark"><path fill="#07100c" d="${ink}"/><path fill="url(#g)" d="${gold}"/></g></g>` +
      `<g clip-path="url(#mark-clip)"><g clip-path="url(#fill-clip)"><g class="grid">` +
      photos.map((src) => `<image preserveAspectRatio="xMidYMid slice" href="${src === "CENTRE" ? "" : src}"/>`).join("") +
      `</g></g></g>`;
    stage = {
      svg,
      tiles: $$("image", svg),
      marks: $$(".mark", svg),
      logo: $(".logo", svg),
      fill: $(".fill", svg),
      grid: $(".grid", svg),
      type: $(".intro-type", intro),
      cue: $(".intro-cue", intro),
      caption: $(".intro-caption", intro)
    };
    intro.classList.add("intro--live");
    layoutStage();
    requestFrame();
  }

  let ticking = false;
  function onFrame() {
    ticking = false;
    if (!intro) return;
    const vh = window.innerHeight;
    const r = intro.getBoundingClientRect();
    const run = r.height - vh;
    const p = run > 0 ? clamp01(-r.top / run) : 0;
    if (stage) drawStage(p);
    document.body.classList.toggle("past-intro", r.bottom < vh * .6);
  }
  const requestFrame = () => { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } };
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", () => { if (stage) layoutStage(); requestFrame(); });
  if (intro && !calm) buildStage().catch(() => {}); // if the stage can't be built, the static wordmark stays
  onFrame();

  /* Focus carousel: one card in the centre, looping. Arrows, swipes and the
     side cards all move it; only the centre card's button can take focus. -- */
  $$("[data-focus]").forEach((root) => {
    const cards = $$(".focus-card", root);
    const count = $("[data-count]", root);
    const n = cards.length;
    let index = 0;
    const offset = (i) => { let d = (((i - index) % n) + n) % n; return d > n / 2 ? d - n : d; };
    const render = () => {
      cards.forEach((card, i) => {
        const d = offset(i);
        const far = Math.abs(d) > 1;
        // a card moving between two hidden positions jumps instead of sliding across
        card.style.transition = far && card.classList.contains("is-far") ? "none" : "";
        card.style.setProperty("--d", d);
        card.classList.toggle("is-active", d === 0);
        card.classList.toggle("is-far", far);
        card.setAttribute("aria-hidden", String(d !== 0));
        $(".focus-more", card).tabIndex = d === 0 ? 0 : -1;
      });
      count.textContent = `${index + 1} of ${n}`;
    };
    const go = (step) => { index = (index + step + n) % n; render(); };
    $$(".focus-arrow", root).forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.dir))));
    let swiped = false;
    cards.forEach((card, i) => card.addEventListener("click", () => {
      if (!swiped && offset(i) !== 0) go(offset(i));
      swiped = false;
    }));
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
    let startX = null;
    const track = $(".focus-track", root);
    track.addEventListener("pointerdown", (e) => { startX = e.clientX; });
    track.addEventListener("pointerup", (e) => {
      swiped = startX !== null && Math.abs(e.clientX - startX) > 40;
      if (swiped) go(e.clientX < startX ? 1 : -1);
      startX = null;
    });
    render();
  });

  /* Treatment details open as a dialog; Esc, Close or the backdrop closes it */
  $$("[data-open]").forEach((button) => {
    const dialog = document.getElementById(button.dataset.open);
    button.addEventListener("click", () => dialog.showModal());
  });
  $$(".t-dialog").forEach((dialog) => {
    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      // the dialog itself is the target for its padding too, so check the click fell outside it
      const r = dialog.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (e.target === dialog && outside) dialog.close();
    });
  });

  /* Fade in on scroll, only for content that starts below the fold -------- */
  if (!calm && "IntersectionObserver" in window) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        entry.target.classList.remove("is-pending");
        reveal.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px 15% 0px" }); // start just before content arrives, so scrolling never meets a blank area
    $$(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("is-pending");
        reveal.observe(el);
      }
    });
  }

  /* Map loads only when asked, so nothing reaches Google before then ------ */
  const mapButton = $("[data-map-load]");
  if (mapButton) {
    mapButton.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = clean(CLINIC.mapEmbedUrl);
      iframe.title = `Map showing ${CLINIC.name}, ${CLINIC.locality}, ${CLINIC.city}`;
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      mapButton.closest(".map-box").replaceChildren(iframe);
      iframe.focus();
    });
  }

  /* Booking form --------------------------------------------------------- */
  const form = $("#booking-form");
  if (!form) return;

  const result = $("#result");
  const fields = {
    name: $("#name"),
    phone: $("#phone"),
    date: $("#date"),
    time: $("#time"),
    treatment: $("#treatment"),
    message: $("#message"),
    consent: $("#consent")
  };

  CLINIC.timeWindows.forEach((label) => fields.time.add(new Option(label, label)));

  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  fields.date.min = today;

  const parseDate = (value) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  // A treatment link on the home page carries its choice over: book.html?treatment=implants
  const preselect = new URLSearchParams(location.search).get("treatment");
  if (preselect && Array.from(fields.treatment.options).some((o) => o.value === preselect)) {
    fields.treatment.value = preselect;
  }

  // Restore draft if saved previously
  try {
    const draft = JSON.parse(localStorage.getItem("elyxian_booking_draft") || "{}");
    if (draft.name && !fields.name.value) fields.name.value = draft.name;
    if (draft.phone && !fields.phone.value) fields.phone.value = draft.phone;
    if (draft.treatment && !preselect && Array.from(fields.treatment.options).some((o) => o.value === draft.treatment)) {
      fields.treatment.value = draft.treatment;
    }
  } catch (_) {}

  function saveDraft() {
    try {
      localStorage.setItem("elyxian_booking_draft", JSON.stringify({
        name: fields.name.value,
        phone: fields.phone.value,
        treatment: fields.treatment.value
      }));
    } catch (_) {}
  }

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    phone: (v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15 ? "" : "Please enter a 10-digit mobile number, so the clinic can reach you.";
    },
    date: (v) => {
      if (!v) return "Please choose a preferred date.";
      if (v < today) return "That date has passed. Please choose today or a later date.";
      const date = parseDate(v);
      if (CLINIC.closedDays.includes(date.getDay())) {
        return `The clinic is closed on ${date.toLocaleDateString("en-IN", { weekday: "long" })}s. Please choose another day.`;
      }
      if (v === today && now.getHours() >= 19) {
        return "Clinic hours for today have ended (closed at 7:00 pm). Please choose tomorrow or a later date.";
      }
      return "";
    },
    time: (v) => {
      if (!v) return "Please choose a time of day.";
      if (fields.date.value === today) {
        const h = now.getHours();
        if (v.startsWith("Morning") && h >= 13) {
          return "Morning hours (10 am to 1 pm) have passed for today. Please pick an afternoon or evening time.";
        }
        if (v.startsWith("Afternoon") && h >= 16) {
          return "Afternoon hours (1 pm to 4 pm) have passed for today. Please pick an evening time.";
        }
      }
      return "";
    },
    treatment: (v) => (v ? "" : "Please choose an option. “Not sure yet” is fine."),
    consent: (_, el) => (el.checked ? "" : "Please tick this box so the clinic may use these details to contact you.")
  };

  function check(key) {
    const el = fields[key];
    const message = rules[key](el.value, el);
    const errorEl = $(`#${key}-error`);
    errorEl.textContent = message;
    errorEl.hidden = !message;
    if (message) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
    return !message;
  }

  Object.keys(rules).forEach((key) => {
    const el = fields[key];
    // Correct errors as soon as they are fixed, but don't scold while someone is still typing
    el.addEventListener("input", () => {
      if (el.getAttribute("aria-invalid")) check(key);
      if (key === "name" || key === "phone" || key === "treatment") saveDraft();
    });
    el.addEventListener("change", () => {
      if (el.type !== "text" && el.type !== "tel") check(key);
      if (key === "treatment") saveDraft();
    });
    el.addEventListener("blur", () => { if (el.value && el.type !== "checkbox") check(key); });
  });

  fields.date.addEventListener("change", () => {
    if (fields.time.value) check("time");
  });

  form.addEventListener("input", () => { result.hidden = true; });

  function buildMessage() {
    const date = parseDate(fields.date.value).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    const lines = [
      `*Consultation Request — ${CLINIC.name}*`,
      "",
      `*Name:* ${fields.name.value.trim()}`,
      `*Phone:* ${fields.phone.value.trim()}`,
      `*Preferred date:* ${date}`,
      `*Preferred time:* ${fields.time.value}`,
      `*Interested in:* ${fields.treatment.selectedOptions[0].text}`
    ];
    if (fields.message.value.trim()) lines.push(`*Notes:* ${fields.message.value.trim()}`);
    return lines.join("\n");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const invalid = Object.keys(rules).filter((key) => !check(key));
    if (invalid.length) {
      fields[invalid[0]].focus();
      return;
    }

    const message = buildMessage();
    const url = whatsappUrl(message);
    $("#result-message").textContent = message;
    $("#result-whatsapp").href = url;
    $("#result-email").href = `mailto:${clean(CLINIC.email)}?subject=${encodeURIComponent("Consultation request")}&body=${encodeURIComponent(message)}`;
    $("#result-demo").hidden = whatsappReady;
    $("#result-sent-note").hidden = !whatsappReady;
    $("#copy-status").textContent = "";
    result.hidden = false;
    result.focus();

    // Send to optional background webhook if configured (prevents lead loss)
    if (CLINIC.submitWebhookUrl && !isPlaceholder(CLINIC.submitWebhookUrl)) {
      try {
        fetch(clean(CLINIC.submitWebhookUrl), {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: fields.name.value.trim(),
            phone: fields.phone.value.trim(),
            date: fields.date.value,
            time: fields.time.value,
            treatment: fields.treatment.value,
            message: fields.message.value.trim(),
            timestamp: new Date().toISOString()
          })
        }).catch((err) => console.warn("Webhook submit failed:", err));
      } catch (_) {}
    }

    // Clear saved draft on successful submit
    try { localStorage.removeItem("elyxian_booking_draft"); } catch (_) {}

    // Open WhatsApp smoothly
    if (whatsappReady) {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = url;
      } else {
        const win = window.open(url, "_blank", "noopener");
        if (!win) window.location.href = url;
      }
    }
  });

  $("#copy-message").addEventListener("click", async () => {
    const status = $("#copy-status");
    try {
      await navigator.clipboard.writeText($("#result-message").textContent);
      status.textContent = "Copied.";
    } catch (err) {
      status.textContent = "Couldn’t copy automatically. Please select the text above.";
    }
  });
})();
