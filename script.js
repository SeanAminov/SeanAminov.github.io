// Starfield background (lightweight)
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
    a: Math.random() * 0.5 + 0.5 // alpha
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
    // twinkle
    s.a += (Math.random() - 0.5) * 0.05;
    if (s.a < 0.2) s.a = 0.2;
    if (s.a > 1) s.a = 1;

    ctx.globalAlpha = s.a;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}
animate();

// Smooth-scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('is-visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .card, .project').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
