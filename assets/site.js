// Small stand-ins for Framer runtime behaviour on the frozen template.

// FAQ: clicking a closed item makes it the open one (swap variant classes, name and inline style).
document.addEventListener('click', (e) => {
  const item = e.target.closest('[data-framer-name="Close"][tabindex]');
  if (!item) return;
  const list = item.closest('[data-framer-name="List"]');
  const open = list && list.querySelector('[data-framer-name="Open"][tabindex]');
  if (!open) return;
  for (const attr of ['class', 'style', 'data-framer-name']) {
    const a = open.getAttribute(attr), b = item.getAttribute(attr);
    if (b === null) open.removeAttribute(attr); else open.setAttribute(attr, b);
    if (a === null) item.removeAttribute(attr); else item.setAttribute(attr, a);
  }
});

// Mobile menu: toggle a class the template CSS can't provide without its runtime.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-framer-name="Hamburger"]');
  if (!btn) return;
  const nav = btn.closest('nav, [data-framer-name="Phone"]');
  if (nav) nav.classList.toggle('menu-open');
});

// Scroll reveal: freeze.py marks the elements Framer faded in on appear (headings fade word by word).
(() => {
  const els = document.querySelectorAll('[data-el-reveal]');
  if (!els.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  els.forEach((el) => {
    const block = el.parentElement && el.parentElement.closest('h1, h2, h3, p');
    const words = block ? [...block.querySelectorAll('[data-el-reveal]')] : [el];
    el.style.transitionDelay = Math.min(words.indexOf(el), 20) * 25 + 'ms';
  });
  document.documentElement.classList.add('el-js');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('el-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
})();

// Process wheel: the sticky section has Step 2-4 trigger markers; rotate the wheel a quarter turn per step
// passed and dim the inactive steps (Framer swapped variants for this).
(() => {
  const wheel = document.querySelector('[data-framer-name="Steps Component Wrapper"] .framer-1azaxyt');
  const triggers = [...document.querySelectorAll('[data-framer-name$="Trigger"]')];
  if (!wheel || !triggers.length) return;
  // step order around the wheel: top (1), right (2), bottom (3), left (4)
  const steps = ['.framer-umx4zz-container', '.framer-htbavz-container', '.framer-1y2tot2-container', '.framer-f5vjbn-container']
    .map((s) => wheel.querySelector(s));
  wheel.style.transition = 'transform .8s cubic-bezier(.65,0,.35,1)';
  steps.forEach((s) => s && (s.style.transition = 'opacity .5s ease'));
  let current = -1;
  const update = () => {
    const mid = innerHeight / 2;
    const step = triggers.filter((t) => t.getBoundingClientRect().top < mid).length;
    if (step === current) return;
    current = step;
    wheel.style.transform = `rotate(${-90 * step}deg)`;
    steps.forEach((s, i) => s && (s.style.opacity = i === step ? '1' : '0.2'));
  };
  addEventListener('scroll', update, { passive: true });
  update();
})();

// Language switcher: build.py appends it after the header; move it into the visible nav row next to "Book a call".
(() => {
  const sw = document.querySelector('.el-lang');
  const row = [...document.querySelectorAll('[data-framer-name="Button Wrapper"]')].find((e) => e.offsetParent && e.closest('[data-framer-name="Nav Container"]'));
  if (sw && row) { row.prepend(sw); sw.classList.add('in-nav'); }
  document.addEventListener('click', (e) => { if (sw && sw.open && !sw.contains(e.target)) sw.open = false; });
})();

// Contact form: FormSubmit sends the visitor back to /contact/#sent after a successful submission.
(() => {
  const note = location.hash === '#sent' && document.querySelector('.form-sent');
  if (note) { note.hidden = false; note.scrollIntoView({ block: 'center' }); }
})();
