import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const iconItems = [];
  const percentItems = [];

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
      iconItems.push(li);
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
      percentItems.push(li);
    }
  });

  // Optimize any icon images.
  [...iconItems, ...percentItems].forEach((li) => {
    li.querySelectorAll('picture > img').forEach((img) => {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimizedPic);
    });
  });

  // Hoist the heading that authors placed as default content immediately before
  // this block (e.g. "Our Company at a Glance" + subheading) into the block so
  // it can sit in a dedicated left column beside the icon cards. This keeps the
  // layout robust and self-contained instead of relying on fragile
  // adjacent-sibling section selectors.
  const wrapper = block.closest('.cards-stats-wrapper') || block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  let heading = null;
  if (prev && prev.classList.contains('default-content-wrapper')
    && prev.querySelector('h1, h2, h3, h4, h5, h6')
    && !prev.querySelector('a, ul, ol, picture, img')) {
    heading = document.createElement('div');
    heading.className = 'cards-stats-heading';
    while (prev.firstChild) heading.append(prev.firstChild);
    prev.remove();
  }

  // Build the two visual groups.
  const iconsGroup = document.createElement('div');
  iconsGroup.className = 'cards-stats-icons';
  const iconsList = document.createElement('ul');
  iconItems.forEach((li) => iconsList.append(li));
  iconsGroup.append(iconsList);

  const donutsGroup = document.createElement('div');
  donutsGroup.className = 'cards-stats-donuts';
  const donutsList = document.createElement('ul');
  percentItems.forEach((li) => donutsList.append(li));
  donutsGroup.append(donutsList);

  block.textContent = '';
  if (heading) block.append(heading);
  block.append(iconsGroup);
  block.append(donutsGroup);
}
