
(() => {
  const links = [...document.querySelectorAll('.toc a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.removeAttribute('aria-current'));
        const a = links.find(x => x.getAttribute('href') === '#' + e.target.id);
        if (a) a.setAttribute('aria-current','true');
      }
    });
  }, {rootMargin:'-20% 0px -70% 0px'});
  sections.forEach(s => obs.observe(s));
})();
