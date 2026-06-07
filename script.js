/* ===== Stagger animation delay on cards ===== */
document.querySelectorAll('.card-grid').forEach(grid => {
  grid.querySelectorAll('.card').forEach((card, i) => {
    card.style.animationDelay = `${0.28 + i * 0.07}s`;
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
const sections    = document.querySelectorAll('.section');
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
