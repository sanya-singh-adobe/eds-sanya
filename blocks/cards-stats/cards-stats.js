import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    const hasPicture = li.querySelector('picture');
    if (hasPicture) {
      // Icon card: [picture cell | number + label cell]
      li.classList.add('cards-stats-icon');
      [...li.children].forEach((div) => {
        if (div.querySelector('picture')) div.className = 'cards-stats-card-image';
        else div.className = 'cards-stats-card-body';
      });
    } else {
      // Percentage stat: [number cell | label cell]
      li.classList.add('cards-stats-percent');
      const cells = [...li.children];
      const numCell = cells[0];
      const labelCell = cells[1];
      if (numCell) {
        numCell.className = 'cards-stats-percent-value';
        // Build a CSS conic-gradient ring proportional to the percentage.
        const raw = (numCell.textContent || '').trim();
        const value = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        if (!Number.isNaN(value)) {
          numCell.style.setProperty('--percent', value);
        }
        // Wrap the trailing "%" so it can be styled smaller, like the source.
        const numEl = numCell.querySelector('h2, h3') || numCell;
        numEl.innerHTML = numEl.textContent.trim().replace(
          /%\s*$/,
          '<span class="cards-stats-percent-sign">%</span>',
        );
      }
      if (labelCell) labelCell.className = 'cards-stats-percent-label';
    }
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
