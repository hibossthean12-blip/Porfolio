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
| `resume.html` | Profile, Experience, Education, Skills, Strengths, At a glance, print-to-PDF |
| `portfolio.html` | Filterable grid of 6 project cards + call to action |
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
        ├── hero-phone.svg    ← hero background (person holding a phone)
        ├── profile.svg       ← About Me profile photo
        └── favicon.svg
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

## Personalise these first

Everything below is a deliberate placeholder. Search and replace.

### 1. Social links (used ~20× across the four files)

| Current placeholder | Replace with |
| --- | --- |
| `github.com/thinchitsothean` | your real GitHub username |
| `linkedin.com/in/thin-chitsothean` | your real LinkedIn profile URL |

Fastest way to update all occurrences at once:

```bash
# PowerShell
(Get-ChildItem *.html) | ForEach-Object {
  (Get-Content $_ -Raw) -replace 'thinchitsothean', 'YOUR-HANDLE' | Set-Content $_ -NoNewline
}
```

### 2. Photos

The site ships with **illustrated SVG placeholders** so it looks finished out of the box.
Swap in real images — keep the same filenames to change nothing else, or edit the `src`:

| File | Suggested replacement |
| --- | --- |
| `assets/images/hero-phone.svg` | A photo of yourself holding a phone, ~1600×1000 |
| `assets/images/profile.svg` | A portrait of yourself, ~800×1000 (4:5 portrait) |

The hero already has a dark scrim over the image, so any reasonably dark photo will keep
the headline readable. For the profile photo, replace the `<img>` in the About section of
`index.html`:

```html
<img src="assets/images/me.jpg" alt="Portrait of Thin Chitsothean" loading="lazy">
```

### 3. Resume content

`resume.html` contains **realistic placeholder roles, employers and dates** so the layout
reads properly. Replace them with your actual history — edit the `.entry` blocks inside
`.timeline`:

- Experience → three `.entry` blocks (Software Engineer, Intern, Freelance)
- Education → Limkokwing University BSc, plus a secondary/high-school entry
- Skills → the `.pill-list` groups and the `.meter` percentages
- At a glance → the `.fact-list` rows

### 4. Portfolio projects

`portfolio.html` has six project cards. Each one needs:

- `data-category="web|backend|mobile|oss"` — **must exactly match** a `data-filter` value
  on a filter chip, or the card becomes unreachable
- Title, description and the `.tag` chips
- The `href` on the "View project" link (currently points at the placeholder GitHub)

The numbered watermark in `.project__thumb` and its gradient are inline — change
`background:linear-gradient(...)` per card to recolour the thumbnails.

---

## Connect the contact form (Formspree)

The form validates in the browser, then posts to Formspree with `fetch` and shows an inline
success state — the visitor never leaves the page.

**Two-minute setup, once:**

1. Create a free form at <https://formspree.io> and set *Send to* =
   `hibossfact12@gmail.com`.
2. Copy the form ID out of the endpoint it gives you.
   `https://formspree.io/f/abcdwxyz` → the ID is **`abcdwxyz`**.
3. In `contact.html`, paste it into the two spots marked `<!-- PASTE ID -->`:

   ```html
   data-endpoint="https://formspree.io/f/abcdwxyz"
   action="https://formspree.io/f/abcdwxyz"
   ```

Until the ID is filled in the form still works — it detects the placeholder and falls back
to opening the visitor's mail client, so nothing is silently swallowed.

The form already includes a `_gotcha` honeypot field, which is what Formspree uses to
silently drop bot submissions. The first submission usually lands in Formspree's inbox for
confirmation; after you click the link in that email, messages arrive in Gmail.

---

## Features included

- **Scroll reveals** — every section animates in via `IntersectionObserver`, staggered by
  a `--d` custom property. Elements marked `data-reveal-group` stagger their children
  automatically. Direction variants: `data-reveal="left" | "right" | "scale"`.
- **Sticky header** — transparent over the hero, then blurred with a purple bottom stroke.
- **Mobile nav** — hamburger toggle, closes on link click and `Escape`, resets on resize
  above the breakpoint.
- **Skill meters** — fill on scroll, driven by `data-meter="90"`.
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
