(function() {
  'use strict';

  const getClientWidth = () => document.documentElement.clientWidth;

  const wordReplacer = match => `<strong class="tip-word">${match}</strong>`;

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
        const x = left + w >= getClientWidth() ? Math.max(2, right - w) : left;
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

  function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
    script.remove();
  }

  if (location.protocol === 'file:') {
    window.handleWordValue = handleWordValue;
    loadScript('edit.js');
  } else {
    loadScript('nav.js');
  }
})();