(function() {
  'use strict';

  if (location.protocol === 'file:') {
    const script = document.createElement('script');
    script.src = 'edit.js';
    document.head.appendChild(script);
  }

  const getClientWidth = () => document.documentElement.clientWidth;

  const wordReplacer = match => `<strong>${match}</strong>`;

  const notesReplacer = match => {
    const notes = match.slice(1).replace(/[(+/)]+/g, '<i>$&</i>');
    return `<span class="notes">${notes}</span>`;
  };

  const handleWordValue = text => {
    return text
      .replace(/[^:|]*/, wordReplacer)
      .replace(/\|[^:]+/, notesReplacer)
      .replace(/:(.+)/, '<span class="translation">$1</span>');
  };

  const tip = ((elem) => {
    return {
      get hidden() {
        return !elem.offsetWidth;
      },
      move({left, top, right, bottom}) {
        const offset = 5;
        const w = elem.offsetWidth;
        const h = elem.offsetHeight + offset;
        const x = left + w >= getClientWidth() - offset ? right - w : left;
        const y = bottom + h >= window.innerHeight ? top - h : bottom + offset;
        elem.style.setProperty('--x', `${~~x}px`);
        elem.style.setProperty('--y', `${y + window.scrollY >> 0}px`);
      },
      render(text = '') {
        elem.innerHTML = text && handleWordValue(text);
        return this;
      }
    };
  })(document.getElementById('tip'));

  document.addEventListener('click', onTipFocus);
  document.addEventListener('mouseover', onTipFocus);

  function onTipFocus(e) {
    const trg = e.target;
    const text = trg.matches('.word')
      ? trg.dataset.value.replace(/^&/, trg.textContent)
      : '';

    if (text) return tip.render(text).move(trg.getBoundingClientRect());

    !tip.hidden && tip.render('');
  }
})();