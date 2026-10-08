# Portfolio

Next.js 15 (App Router) · Framer Motion · GSAP + ScrollTrigger + SplitText · Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Publishing

Live at **https://mazen-z.netlify.app** (Netlify, free plan). The site is a
static export (`output: 'export'` in `next.config.mjs`), so the build is a
plain `out/` folder. After editing, publish the update with:

```bash
npm run deploy
```

## Editing content

Everything you'd want to change is in `src/content/site.ts`: name, email, copy,
projects, roles, services, skills and image URLs. The images are placeholder
photos from picsum.photos. To use your own, put files in `public/images/` and
point the entries at `/images/your-file.jpg` (then the `remotePatterns` in
`next.config.mjs` can go).

**Set your real email** in `site.email` (it's `hello@example.com` for now).

## Where each effect lives

| Effect | Component |
| --- | --- |
| CRT boot: counter, scanlines, flicker, white-line power-on | `LoadingScreen` |
| Faster branded curtain for other pages and route changes | `PageLoader`, `TransitionLink` |
| Background image + draggable momentum carousel with parallax | `Hero`, `Carousel` |
| Grayscale → colour on hover (in-view on touch) | `.gs` in `globals.css`, `useTouchColor` |
| Stacked, pinned "slide" sections | `SlideStack` |
| Scroll reveals (lines, stagger, side-slide images, counters, parallax) | `RevealScope` (`data-reveal`, `data-count`, `data-parallax`) |
| Cursor-following image preview list | `ProjectList` |
| Difference-blend custom cursor with states | `Cursor` (`data-cursor`, `data-cursor-label`) |
| Frosted glass stacked tabs | `GlassTabs` |
| Physics tag blocks you can throw | `TagBlock` |
| Magnetic buttons / underline links | `Magnetic`, `.u-link`, `.btn` |

## Behaviour notes

- The CRT intro plays once per browser session on the homepage (`sessionStorage`
  key `mz-crt`). Every other load and every navigation uses the quick curtain.
- Touch devices get native scrolling, a native swipe carousel, colour-on-view
  instead of hover, a static tag layout, and no custom cursor.
- `prefers-reduced-motion`: no CRT, no scroll animations, no stacking, no
  physics, no parallax or panning; loaders become short fades.
- All scroll animations use `power3.out` (`EASE` in `src/lib/gsap.ts`, `--ease`
  in CSS).
