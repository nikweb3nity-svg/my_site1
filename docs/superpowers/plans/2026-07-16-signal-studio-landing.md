# Signal Studio Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, original Russian-language landing page for the Signal web-design studio using the supplied dark design system and procedural motion.

**Architecture:** A dependency-free static site separates semantic page structure (`index.html`), visual system and responsive composition (`styles.css`), and motion/interaction (`script.js`). The hero artwork is a Canvas 2D particle field; content reveal and navigation use browser-native APIs.

**Tech Stack:** HTML5, CSS custom properties, JavaScript, Canvas 2D, IntersectionObserver.

---

## File structure

- `index.html` — semantic landing-page markup and inline SVG logo.
- `styles.css` — source design tokens, typography, responsive layout, focus styles, and CSS motion.
- `script.js` — canvas particle engine, mobile navigation, scroll reveal, and smooth anchor behavior.

### Task 1: Create the semantic landing shell

**Files:**
- Create: `C:/Users/Legion/Documents/my_site1/index.html`
- Test: browser DOM inspection of `index.html`

- [ ] **Step 1: Add page landmarks and navigable sections**

Create a document with `header`, `main`, `footer`; add `#work`, `#approach`, `#team`, and `#contact` sections. Include a labelled canvas (`aria-label="Динамическая абстрактная композиция из частиц"`), a mobile menu button, and real anchor links.

- [ ] **Step 2: Add original studio copy and project content**

Use the approved identity: `Сигнал`, hero heading `Делаем сайты, в которые хочется вернуться.`, services `Стратегия`, `Айдентика`, `Цифровой опыт`, and three fictional case studies. Keep CTA labels consistently as `Обсудить проект`.

- [ ] **Step 3: Verify semantic structure**

Run: `rg -n '<(header|main|section|footer)|id="(work|approach|team|contact)"|<canvas' index.html`

Expected: one header, one main, one footer, four id-bearing sections, and one canvas result.

### Task 2: Implement the supplied visual system and responsive layout

**Files:**
- Create: `C:/Users/Legion/Documents/my_site1/styles.css`
- Modify: `C:/Users/Legion/Documents/my_site1/index.html`
- Test: browser visual inspection at 1440px and 390px viewport widths

- [ ] **Step 1: Define supplied tokens and global defaults**

Copy the supplied variables into `:root`, retaining `#000000`, `#ffffff`, `#9a9a9a`, `#bdbdbd`, `#8052ff`, `#ffb829`, `#15846e`, the 6px spacing scale, 24px radii, and PPNeueMontreal fallback stack. Set `body` to black with white text and use `font-weight: 200` for body copy.

- [ ] **Step 2: Build desktop typography and asymmetric sections**

Use a centred `1280px` container, a two-column hero, and `clamp()` values that reach the supplied 78–113px display scale. Display headings use weight `400` and `letter-spacing: -0.04em`; labels use uppercase 14px semibold text and amber or violet accents. Do not add cards, shadows, borders, or surface panels.

- [ ] **Step 3: Add interaction and accessibility states**

Style a single filled violet pill CTA, text-only secondary links, `:focus-visible` outlines, responsive menu states, and the `.reveal`/`.is-visible` motion classes. Add a `prefers-reduced-motion` media query that stops transitions and canvas-dependent decoration.

- [ ] **Step 4: Add the mobile composition**

At `760px`, switch all two-column sections to one column, make desktop navigation collapsible, keep the canvas within the hero, and reduce headings without losing hierarchy.

- [ ] **Step 5: Verify required visual constraints**

Run: `rg -n '#000000|#8052ff|font-weight: 200|letter-spacing: -0.04em|prefers-reduced-motion|@media' styles.css`

Expected: each design-system constraint appears in the stylesheet.

### Task 3: Implement original animated particle artwork and page interaction

**Files:**
- Create: `C:/Users/Legion/Documents/my_site1/script.js`
- Modify: `C:/Users/Legion/Documents/my_site1/index.html`
- Test: browser interaction at desktop and reduced-motion modes

- [ ] **Step 1: Implement a bounded Canvas particle engine**

Create a `Particle` object with `x`, `y`, `size`, `vx`, `vy`, and `color`. Render outlined triangles with a palette based on violet, amber, teal, magenta, and blue. On each animation frame, update position, wrap particles around the canvas bounds, and redraw the full canvas.

- [ ] **Step 2: Add cursor response and performance handling**

Store pointer coordinates in canvas-local space. Particles within a 150px radius receive a small outward impulse. Use `ResizeObserver` and `devicePixelRatio` to size crisply; cap the particle count at 260 desktop and 130 mobile.

- [ ] **Step 3: Add reveal and menu behavior**

Use `IntersectionObserver` to add `.is-visible` when `.reveal` elements enter view. Toggle `aria-expanded` and `.is-open` for the menu button; close the menu after its anchor links are activated.

- [ ] **Step 4: Respect reduced motion**

If `matchMedia('(prefers-reduced-motion: reduce)').matches`, draw a static particle frame and do not start the `requestAnimationFrame` loop or scroll-reveal animation.

- [ ] **Step 5: Verify JavaScript wiring**

Run: `rg -n 'canvas|requestAnimationFrame|IntersectionObserver|aria-expanded|prefers-reduced-motion' script.js index.html`

Expected: the script exposes all five behaviours and the HTML loads `script.js` with `defer`.

### Task 4: Run end-to-end visual verification

**Files:**
- Modify if needed: `C:/Users/Legion/Documents/my_site1/index.html`
- Modify if needed: `C:/Users/Legion/Documents/my_site1/styles.css`
- Modify if needed: `C:/Users/Legion/Documents/my_site1/script.js`

- [ ] **Step 1: Serve the page locally**

Run: `python -m http.server 4173`

Expected: browser can open `http://localhost:4173/`.

- [ ] **Step 2: Check desktop, mobile, keyboard, and reduced-motion paths**

Inspect at 1440px and 390px. Confirm the particle field moves on desktop; navigation links scroll to their sections; the menu opens on mobile; keyboard focus is visible; and reduced-motion disables continuous animation.

- [ ] **Step 3: Check source integrity**

Run: `rg -n 'TODO|TBD|undefined|console\.error' index.html styles.css script.js`

Expected: no matches.

- [ ] **Step 4: Commit if Git is initialized**

Run: `git status --short`

Expected: show the three site files. If `git rev-parse --is-inside-work-tree` succeeds, add and commit them with `feat: build Signal studio landing`; otherwise report that this workspace is not a Git repository.

## Self-review

- Spec coverage: Tasks 1–4 cover navigation, all six page areas, original copy, supplied tokens, responsive layout, procedural particles, cursor response, scroll motion, and reduced-motion support.
- Placeholder scan: no deferred requirements or undefined file paths.
- Consistency: `index.html`, `styles.css`, and `script.js` use the same section ids, CTA copy, `.reveal` state, and canvas implementation.
