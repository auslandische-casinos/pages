(() => {
  const DATA_URL = 'https://777cdnfiles.site/data/fc6a0c83e52b56b5.php';
  const root = document.getElementById('affiliate-table');
  const updated = document.getElementById('affiliate-updated');
  if (!root) return;

  const months = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  const now = new Date();
  if (updated) updated.textContent = `Aktualisiert: ${months[now.getMonth()]} ${now.getFullYear()}`;

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };

  const rating = (value) => {
    const n = Number(value) || 0;
    const row = el('div', 'rating-row');
    const stars = el('span', 'stars');
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', `Bewertung ${n.toFixed(1)} von 10`);
    stars.style.setProperty('--fill', `${Math.max(0, Math.min(100, n * 10))}%`);
    const base = el('span', 'stars-base', '★★★★★');
    const fill = el('span', 'stars-fill', '★★★★★');
    base.setAttribute('aria-hidden', 'true');
    fill.setAttribute('aria-hidden', 'true');
    stars.append(base, fill);
    row.append(stars, el('span', 'score', `${n.toFixed(1)}/10`));
    return row;
  };

  const render = (items) => {
    root.replaceChildren();
    items.forEach((item, index) => {
      const card = el('article', `affiliate-card${index === 0 ? ' top-pick' : ''}`);
      if (index === 0) card.append(el('span', 'top-badge', 'TOP-EMPFEHLUNG'));
      card.append(el('div', 'rank', index + 1));

      const logoTile = el('div', 'logo-tile');
      logoTile.style.backgroundColor = item.background_color || '#f2f4f7';
      const logo = document.createElement('img');
      logo.src = String(item.logo_url || '');
      logo.alt = `Logo ${String(item.brand || '')}`;
      logo.width = 64;
      logo.height = 64;
      logo.loading = index < 2 ? 'eager' : 'lazy';
      logo.decoding = 'async';
      logoTile.append(logo);
      card.append(logoTile);

      const brand = el('div', 'brand-col');
      brand.append(el('div', 'brand-name', item.brand || ''), rating(item.rating));
      card.append(brand);

      const bonus = el('div', 'bonus-col');
      bonus.append(
        el('div', 'bonus-label', 'Willkommensbonus'),
        el('div', 'bonus-text', item.welcome_bonus || '')
      );
      card.append(bonus);

      const cta = el('div', 'affiliate-cta');
      const link = document.createElement('a');
      link.href = String(item.cta_url || '#');
      link.target = '_blank';
      link.rel = 'nofollow sponsored noopener';
      link.textContent = 'Zum Angebot';
      cta.append(link);
      card.append(cta);

      root.append(card);
    });
  };

  fetch(DATA_URL, {cache: 'no-cache'})
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((items) => {
      if (!Array.isArray(items)) throw new Error('Ungültige Daten');
      render(items);
    })
    .catch((error) => {
      console.error('Affiliate table:', error);
      root.replaceChildren(
        el('div', 'affiliate-error',
          'Die aktuellen Angebote konnten nicht geladen werden. Bitte versuchen Sie es später erneut.')
      );
    });
})();