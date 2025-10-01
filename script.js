// --- Starfield background ---
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d', { alpha: true });
let W, H, stars;
const STAR_COUNT = 160;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.3 + 0.2,
    v: Math.random() * 0.25 + 0.05,
    a: Math.random() * 0.5 + 0.5
  }));
}
resize();
window.addEventListener('resize', resize);

function animate() {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff';
  stars.forEach(s => {
    s.y += s.v;
    if (s.y > H) s.y = -2;
    s.a += (Math.random() - 0.5) * 0.05;
    if (s.a < 0.2) s.a = 0.2; if (s.a > 1) s.a = 1;
    ctx.globalAlpha = s.a;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}
animate();

// --- Smooth scroll for internal anchors ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// --- Reveal on scroll ---
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.section, .card, .project').forEach(el => {
  el.classList.add('reveal'); observer.observe(el);
});

// --- Footer year ---
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// --- Progress bar (Unreal courses) ---
(function () {
  const el = document.querySelector('.progress');
  if (!el) return;
  const complete = +el.dataset.complete || 0;
  const total = +el.dataset.total || 1;
  const pc = Math.max(0, Math.min(100, (complete / total) * 100));
  el.querySelector('.progress__bar').style.width = pc + '%';
  el.querySelector('.progress__txt').textContent = `${complete} / ${total}`;
})();

// --- Lightbox for certificates ---
(function () {
  const lightbox = document.getElementById('lightbox');
  const imgEl = lightbox.querySelector('.lightbox__img');
  const capEl = lightbox.querySelector('.lightbox__caption');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  function open(src, alt, caption) {
    imgEl.src = src; imgEl.alt = alt || '';
    capEl.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    imgEl.src = ''; imgEl.alt = ''; capEl.textContent = '';
  }

  document.querySelectorAll('.ue-cert img').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.dataset.full || img.src;
      const fig = img.closest('figure');
      const caption = fig?.querySelector('figcaption')?.textContent?.trim();
      open(src, img.alt, caption);
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
