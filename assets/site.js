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
