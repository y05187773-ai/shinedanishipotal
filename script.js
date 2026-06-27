/* ===== Stagger animation ===== */
document.querySelectorAll('.card-grid').forEach(grid => {
  grid.querySelectorAll('.card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.06}s`;
  });
});

/* ===== Mouse spotlight on cards ===== */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ===== Blue sparkle on hover ===== */
const SPARKLE_COLORS = ['#3b82f6','#60a5fa','#06b6d4','#818cf8','#38bdf8'];
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', e => {
    for (let i = 0; i < 5; i++) {
      const sp = document.createElement('div');
      sp.className = 'sparkle';
      const angle  = Math.random() * Math.PI * 2;
      const dist   = 30 + Math.random() * 40;
      const dist2  = 50 + Math.random() * 60;
      sp.style.cssText = `
        left:${e.clientX + Math.cos(angle) * 4}px;
        top:${e.clientY + Math.sin(angle) * 4}px;
        background:${SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]};
        --dx:${Math.cos(angle) * dist}px;
        --dy:${Math.sin(angle) * dist}px;
        --dx2:${Math.cos(angle) * dist2}px;
        --dy2:${Math.sin(angle) * dist2}px;
        animation-delay:${i * 0.07}s;
      `;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 900);
    }
  });
});

/* ===== Drawer (mobile) ===== */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const drawer       = document.getElementById('drawer');
const overlay      = document.getElementById('overlay');
const drawerClose  = document.getElementById('drawerClose');

function openDrawer()  { drawer.classList.add('open');    overlay.classList.add('open'); }
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); }

hamburgerBtn.addEventListener('click', openDrawer);
drawerClose .addEventListener('click', closeDrawer);
overlay     .addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

/* ===== Active sidebar link on scroll ===== */
const sections     = document.querySelectorAll('.section');
const sidebarLinks = document.querySelectorAll('#sidebar .sidebar-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      sidebarLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ===== Search / filter ===== */
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  sections.forEach(section => {
    let visible = 0;
    section.querySelectorAll('.card').forEach(card => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    section.classList.toggle('all-hidden', visible === 0);
  });
});

/* ===== Scroll-to-top ===== */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
