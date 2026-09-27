# Thin Chitsothean — Personal CV / Portfolio Website

A four-page personal site built with plain HTML, CSS and JavaScript. No build step,
no framework, no dependencies — open `index.html` and it works.

**Design:** dark neutral surfaces with a purple accent and purple stroke borders,
Inter sans-serif, subtle scroll-reveal animations, fully mobile responsive.

---

## Pages

| File | Contents |
| --- | --- |
| `index.html` | Hero, tagline, About Me + contact details, Connect with Me, footer |
| `resume.html` | Profile, CV preview, Selected Projects, Education, Skills, At a glance, print-to-PDF |
| `portfolio.html` | Filterable grid of 5 project cards + acknowledgement + call to action |
| `contact.html` | Validated contact form plus direct email / phone / social links |

```
thin-chitsothean-cv/
├── index.html
├── resume.html
├── portfolio.html
├── contact.html
├── .github/workflows/deploy.yml   ← automatic GitHub Pages deploy
├── .gitattributes
├── .gitignore
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── images/
        ├── hero-phone.svg          ← hero background (placeholder illustration)
        ├── me.jpg                  ← About Me portrait
        ├── favicon.svg
        └── projects/
            ├── ygtechstore.jpg
            ├── event-management.jpg
            ├── library.jpg
            ├── limkokwing.jpg      ← resume education entry
            ├── shb.jpg             ← resume education entry
            └── cv.jpg              ← resume CV preview
```

---

## Publish it (GitHub Pages)

Deploys automatically on every push to `main`.

1. **Create the repo** on GitHub (no README, no `.gitignore` — this folder already has both).
2. **Point the local repo at it and push:**

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. **Turn Pages on:** repo → **Settings** → **Pages** → *Build and deployment* →
   Source: **GitHub Actions**. (The workflow does the rest.)
4. Your site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/` within a minute or two.
   The workflow run log shows the exact URL.

To use a custom domain, add a `CNAME` file in the repo root containing just the domain
(e.g. `thin-chitsothean.dev`) and set the same domain under Settings → Pages.

---

## Run it locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
# or, with Python
python -m http.server 8000
```

Then visit <http://localhost:8000>.

---

## Personalise these

### 1. Hero background — still a placeholder

`assets/images/hero-phone.svg` is an **illustrated placeholder**, not a photo. To use a real
image, drop it at `assets/images/hero.jpg` and change the `background` in the `.hero__media`
rule in `assets/css/styles.css`:

```css
background: var(--bg-soft) url("../images/hero.jpg") center / cover no-repeat;
```

A wide photo (~1920px) works best. The hero already has a dark scrim over the image, so any
reasonably dark photo will keep the headline readable.

### 2. Profile photo and logo

Two images are derived from one high-resolution portrait:

| File | Size | Used for |
|---|---|---|
| `assets/images/me.jpg` | 800×1028 | The About Me frame on the home page |
| `assets/images/brand.jpg` | 160×160 | The 38px logo in the header and footer of all four pages |

`me.jpg` renders into the 400px-wide frame at a 4:5 aspect ratio using `object-fit: cover`, so
it downscales cleanly and stays sharp on high-density screens. `brand.jpg` is a top-biased
square crop, since faces sit high in portrait photos — adjust the `0.18` vertical bias in the
image pipeline if the framing looks off.

An early 200×200 export needed a frame cap (`.photo-frame:has(img[src$="me.jpg"])`) to avoid
upscaling. That cap is gone; if you swap in a small image again, reintroduce it.

### 3. Contact form — nothing to do

The form has no backend and needs no configuration. It validates in the browser, then opens
the visitor's own mail client with the subject and body pre-filled and addressed to the
address in `data-mailto`. Change the recipient in one place:

```html
<form class="form" data-contact-form data-mailto="hibossfact12@gmail.com">
```

The one limitation worth knowing: on some devices and in some webmail setups, tapping a
`mailto:` link does nothing. That is why the page also shows the plain email address and
phone number directly beneath the form — a visitor who hits a dead mail client still has a
way to reach you.

### 4. Limkokwing campus photo

`assets/images/projects/limkokwing.jpg` is the **Cyberjaya campus in Selangor, Malaysia**,
but it sits beside the Phnom Penh, Cambodia degree entry in `resume.html`. Swap in a Phnom
Penh campus photo, or drop the `<img class="entry__thumb">` from that entry to remove the
implication.

### 5. Portfolio categories

`portfolio.html` has five project cards. If you add or recategorise one:

- `data-category="web|mobile"` — **must exactly match** a `data-filter` value on a filter
  chip, or the card becomes unreachable
- `data-filter-count` in the "Showing N projects" line is the default count for
  no-JS visitors; keep it in sync
- Card screenshots live in `assets/images/projects/` and are letterboxed with
  `object-fit: contain`, so portrait phone screenshots are not cropped. Cards without a
  screenshot fall back to a gradient plus a large number.

---

## Features included

- **Scroll reveals** — every section animates in via `IntersectionObserver`, staggered by
  a `--d` custom property. Elements marked `data-reveal-group` stagger their children
  automatically. Direction variants: `data-reveal="left" | "right" | "scale"`.
- **Sticky header** — transparent over the hero, then blurred with a purple bottom stroke.
- **Mobile nav** — hamburger toggle, closes on link click and `Escape`, resets on resize
  above the breakpoint.
- **Portfolio filter** — client-side, with live result count, deep-linkable
  (`portfolio.html?filter=mobile`).
- **Pointer-tracked card glow** — follows the cursor via `--mx` / `--my`.
- **Form validation** — inline, on blur, clearing as soon as a field is fixed.
- **Print stylesheet** — `Ctrl+P` on `resume.html` produces a clean single-column white CV
  with chrome, shadows and colour stripped out.
- **Accessibility** — skip link, semantic landmarks, labelled form fields, `aria-current`
  on the active nav item, `aria-pressed` on filter chips, `aria-live` status region, and a
  full `prefers-reduced-motion` path that disables all animation.

### Theming

All colours live in the `:root` block at the top of `assets/css/styles.css`:

```css
--bg: #0a0a0f;        /* page background      */
--surface: #14141d;   /* cards and panels     */
--purple-500: #8b5cf6;/* accent               */
--stroke: rgba(139, 92, 246, 0.28); /* purple borders */
```

Change those and the whole site re-themes.
