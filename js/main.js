// --- THEME TOGGLE ---
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// --- NAVBAR ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function closeNav() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

function toggleNav() {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navOverlay.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleNav);
navOverlay.addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// --- TYPING EFFECT ---
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const typingEl = document.getElementById('typingText');
const cursorEl = document.getElementById('typingCursor');
const phrases = [
  'Full-Stack Developer building scalable web applications',
  'Node.js & TypeScript enthusiast',
  'Vue, React, and everything in between',
  'From military logistics to microservices'
];

if (!prefersReducedMotion) {
  typingEl.textContent = '';
  let phraseIdx = 0, charIdx = 0, deleting = false, pauseTimer = 0;

  function typeLoop() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      typingEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pauseTimer = setTimeout(() => { deleting = true; typeLoop(); }, 2200);
        return;
      }
      setTimeout(typeLoop, 45 + Math.random() * 35);
    } else {
      typingEl.textContent = current.substring(0, charIdx);
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx = 0;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 25);
    }
  }
  typeLoop();
} else {
  typingEl.textContent = phrases[0];
  cursorEl.style.display = 'none';
}

// --- PARTICLE CONSTELLATION ---
const canvas = document.getElementById('heroCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let animId;
let particlesVisible = true;
const PARTICLE_COUNT = 60;
const CONNECT_DIST = 120;

function resizeCanvas() {
  const hero = canvas.parentElement;
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1
    });
  }
}

function drawParticles() {
  if (!particlesVisible) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isLight = root.getAttribute('data-theme') === 'light';
  const dotColor = isLight ? 'rgba(3, 105, 161,' : 'rgba(14, 165, 233,';
  const lineColor = isLight ? 'rgba(3, 105, 161,' : 'rgba(14, 165, 233,';

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = dotColor + '0.5)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = lineColor + (0.15 * (1 - dist / CONNECT_DIST)) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  animId = requestAnimationFrame(drawParticles);
}

if (!prefersReducedMotion && canvas && ctx) {
  resizeCanvas();
  createParticles();
  drawParticles();

  // Pause particles when hero is off-screen to save battery
  const heroSection = document.getElementById('hero');
  const particleObs = new IntersectionObserver((entries) => {
    particlesVisible = entries[0].isIntersecting;
    if (particlesVisible && !animId) drawParticles();
    else if (!particlesVisible) { cancelAnimationFrame(animId); animId = null; }
  }, { threshold: 0 });
  particleObs.observe(heroSection);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => { resizeCanvas(); createParticles(); }, 200);
  });
}

// --- RADAR CHART ---
const radarCanvas = document.getElementById('radarCanvas');
const rctx = radarCanvas.getContext('2d');
const categories = [
  { label: 'Backend', value: 0.92 },
  { label: 'Frontend', value: 0.88 },
  { label: 'Database', value: 0.85 },
  { label: 'Cloud/DevOps', value: 0.78 },
  { label: 'Testing', value: 0.72 },
  { label: 'Systems', value: 0.70 }
];

const radarColors = ['#0EA5E9', '#22C55E', '#A855F7', '#F59E0B', '#EF4444', '#EC4899'];
let radarAnimProgress = 0;
let radarAnimated = false;
let hoveredCategory = -1;

// Build legend
const legendEl = document.getElementById('radarLegend');
categories.forEach((cat, i) => {
  const item = document.createElement('div');
  item.className = 'radar-legend-item';
  item.innerHTML = `<span class="radar-legend-dot" style="background:${radarColors[i]}"></span>${cat.label}`;
  item.addEventListener('mouseenter', () => { hoveredCategory = i; drawRadar(); });
  item.addEventListener('mouseleave', () => { hoveredCategory = -1; drawRadar(); });
  legendEl.appendChild(item);
});

function drawRadar() {
  const W = radarCanvas.width, H = radarCanvas.height;
  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(W, H) * 0.38;
  const n = categories.length;
  const isLight = root.getAttribute('data-theme') === 'light';

  rctx.clearRect(0, 0, W, H);

  // Grid rings
  for (let ring = 1; ring <= 4; ring++) {
    const r = maxR * (ring / 4);
    rctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? rctx.moveTo(x, y) : rctx.lineTo(x, y);
    }
    rctx.closePath();
    rctx.strokeStyle = isLight ? 'rgba(203,213,225,0.5)' : 'rgba(51,65,85,0.4)';
    rctx.lineWidth = 1;
    rctx.stroke();
  }

  // Axis lines + labels
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;

    rctx.beginPath();
    rctx.moveTo(cx, cy);
    rctx.lineTo(x, y);
    rctx.strokeStyle = isLight ? 'rgba(203,213,225,0.3)' : 'rgba(51,65,85,0.3)';
    rctx.stroke();

    // Labels
    const labelR = maxR + 20;
    const lx = cx + Math.cos(angle) * labelR;
    const ly = cy + Math.sin(angle) * labelR;
    rctx.font = `${hoveredCategory === i ? '600' : '500'} 12px 'Space Grotesk', sans-serif`;
    rctx.fillStyle = hoveredCategory === i ? radarColors[i] : (isLight ? '#475569' : '#94A3B8');
    rctx.textAlign = 'center';
    rctx.textBaseline = 'middle';
    rctx.fillText(categories[i].label, lx, ly);
  }

  // Data polygon
  const progress = Math.min(radarAnimProgress, 1);
  rctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = (Math.PI * 2 * idx / n) - Math.PI / 2;
    const val = categories[idx].value * progress;
    const r = maxR * val;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i === 0 ? rctx.moveTo(x, y) : rctx.lineTo(x, y);
  }
  rctx.closePath();

  // Fill
  const grad = rctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
  grad.addColorStop(1, 'rgba(14, 165, 233, 0.03)');
  rctx.fillStyle = grad;
  rctx.fill();

  rctx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
  rctx.lineWidth = 2;
  rctx.stroke();

  // Data points
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const val = categories[i].value * progress;
    const r = maxR * val;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const isHovered = hoveredCategory === i;
    const dotR = isHovered ? 6 : 4;

    // Glow
    if (isHovered) {
      rctx.beginPath();
      rctx.arc(x, y, 12, 0, Math.PI * 2);
      rctx.fillStyle = `${radarColors[i]}22`;
      rctx.fill();
    }

    rctx.beginPath();
    rctx.arc(x, y, dotR, 0, Math.PI * 2);
    rctx.fillStyle = radarColors[i];
    rctx.fill();
    rctx.strokeStyle = isLight ? '#FFFFFF' : '#0F172A';
    rctx.lineWidth = 2;
    rctx.stroke();

    // Percentage on hover
    if (isHovered) {
      rctx.font = "700 13px 'Space Grotesk', sans-serif";
      rctx.fillStyle = radarColors[i];
      rctx.textAlign = 'center';
      rctx.fillText(Math.round(categories[i].value * 100) + '%', x, y - 16);
    }
  }
}

function animateRadar() {
  if (radarAnimProgress < 1) {
    radarAnimProgress += 0.025;
    drawRadar();
    requestAnimationFrame(animateRadar);
  } else {
    radarAnimProgress = 1;
    drawRadar();
  }
}

// Trigger radar animation when scrolled into view
const radarObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !radarAnimated) {
    radarAnimated = true;
    if (prefersReducedMotion) { radarAnimProgress = 1; drawRadar(); }
    else animateRadar();
    radarObs.unobserve(radarCanvas);
  }
}, { threshold: 0.3 });
radarObs.observe(radarCanvas);

// Redraw radar on theme change
window.addEventListener('themechange', () => { if (radarAnimated) drawRadar(); });

// --- TILT CARD EFFECT ---
if (!prefersReducedMotion) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 400ms ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}

// --- MAGNETIC BUTTONS ---
if (!prefersReducedMotion) {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 300ms ease';
      setTimeout(() => { btn.style.transition = ''; }, 300);
    });
  });
}

// --- PAGE TRANSITIONS ---
const pageTransition = document.getElementById('pageTransition');

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && link.target !== '_blank') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      pageTransition.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 350);
    });
  }
});

// Fade in on page load
window.addEventListener('pageshow', () => {
  pageTransition.classList.remove('active');
});

// --- FADE-UP OBSERVER ---
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${i * 80}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
}
