# James Strohm — Portfolio

A modern, single-page developer portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just clean, performant code.

**[Live Demo](#)** · **[Resume](James%20Strohm%20-%20Full-Stack%20Developer.pdf)**

---

## Features

- **Particle Constellation** — Animated canvas background with connecting nodes
- **Interactive Radar Chart** — Skill visualization with hover highlighting
- **Dark / Light Theme** — Toggle with localStorage persistence
- **Magnetic Buttons & Tilt Cards** — Cursor-reactive UI elements
- **Typing Effect** — Animated hero title cycling through roles
- **Scroll Animations** — Fade-up reveals with staggered timing
- **Fully Responsive** — Mobile-first layout with fluid typography
- **Accessibility** — Respects `prefers-reduced-motion`, semantic HTML, ARIA labels

## Sections

| Section | Description |
|---|---|
| **Hero** | Animated intro with particle canvas and typing effect |
| **About** | Background, highlights, and professional summary |
| **Experience** | Timeline of roles at Clube Certo and Comfortly Travel |
| **Projects** | Featured work with dedicated detail pages |
| **Skills** | Interactive radar chart + categorized skill pills |
| **Education** | Degrees, certifications, and languages |
| **Contact** | Email, LinkedIn, GitHub, and phone |

## Tech Stack

**Languages:** JavaScript · HTML5 · CSS3

**Key APIs:** Canvas API · Intersection Observer · localStorage

**Fonts:** Space Grotesk · Bebas Neue (Google Fonts)

## Project Structure

```
├── index.html                 # Main portfolio page
├── favicon.svg                # Site icon
├── headshot.jpg               # Profile photo
├── James_Strohm_Resume.html   # Full resume page
└── projects/
    ├── hero-dashboard.html    # Vue 3 admin dashboard
    ├── billing-engine.html    # Automated billing system
    ├── alfred.html            # AI voice assistant
    └── chess-engine.html      # Chess engine
```

## Getting Started

No installation required — it's a static site.

```bash
# Option 1: Open directly
open index.html

# Option 2: Local server
python -m http.server 8000
# Visit http://localhost:8000
```

## Deployment

Ready for any static hosting provider — GitHub Pages, Vercel, Netlify, etc. No build step needed.

## License

© James Strohm. All rights reserved.
