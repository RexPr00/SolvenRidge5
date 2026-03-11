(() => {
  const qs = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];

  const burger = qs('[data-burger]');
  const drawer = qs('[data-drawer]');
  const backdrop = qs('[data-backdrop]');
  const closeBtn = qs('[data-drawer-close]');
  let lastFocus = null;

  const focusables = () => qsa('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])', drawer)
    .filter(el => !el.hasAttribute('disabled'));

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    backdrop.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
    const first = focusables()[0];
    if (first) first.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
    if (lastFocus) lastFocus.focus();
  }

  burger?.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);
  qsa('[data-drawer] a').forEach(a => a.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
    if (e.key === 'Tab' && drawer?.classList.contains('open')) {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  qsa('.lang').forEach((box) => {
    const toggle = qs('.lang-toggle', box);
    toggle?.addEventListener('click', () => box.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!box.contains(e.target)) box.classList.remove('open');
    });
  });

  qsa('.faq-list details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        qsa('.faq-list details').forEach(other => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  const modal = qs('[data-modal]');
  const modalOpen = qsa('[data-open-privacy]');
  const modalClose = qsa('[data-close-privacy]');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-lock');
    qs('.close-icon', modal)?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-lock');
  }

  modalOpen.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
  modalClose.forEach(b => b.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  qsa('.reveal').forEach(el => io.observe(el));
})();
