(function() {
  'use strict';

  let isPending = false;
  const nav = document.createElement('nav');
  const overlay = document.createElement('div');
  const trigger = document.createElement('button');

  overlay.id = 'nav-overlay';
  trigger.id = 'menu-switcher';
  trigger.innerHTML = '<i></i>'.repeat(4);
  nav.innerHTML = '<i style="padding-left:1em">Loading...</i>';

  document.body.prepend(trigger, nav, overlay);

  trigger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  function toggleMenu() {
    trigger.classList.toggle('__active');
    !isPending && fillMenu();
  }

  async function fillMenu() {
    if (isPending) return;

    isPending = true;

    const response =  await fetch('https://raw.githubusercontent.com/Le-Marin/Oxford-Latin-Course/main/README.md');
    const respText = await response.text();
    const links = respText.match(/\/cap-\d+\.html/g);

    nav.innerHTML = links.map((url, i) => {
      return `<a href=".${url}">Capitulum ${i + 1}</a>`;
    }).join('');

    for (const link of nav.children) {
      if (link.pathname !== location.pathname) continue;
      return link.classList.add('__active');
    }
  }
})();