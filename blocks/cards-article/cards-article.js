import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hoist the "Latest Insights / Thinking Forward" header that authors placed as
  // default content immediately before this block into the block, so the whole
  // insights unit (header + cards) sits together on one grey full-bleed band and
  // the header can be laid out as a row (heading left, "View All" button right).
  const wrapper = block.closest('.cards-article-wrapper') || block.parentElement;
  const prev = wrapper ? wrapper.previousElementSibling : null;
  let header = null;
  if (prev && prev.classList.contains('default-content-wrapper')
    && prev.querySelector('h1, h2, h3, h4, h5, h6')
    && !prev.querySelector('picture, img')) {
    header = document.createElement('div');
    header.className = 'cards-article-header';
    const headings = document.createElement('div');
    headings.className = 'cards-article-header-text';
    const link = prev.querySelector('a');
    let button = null;
    if (link) {
      button = link.closest('p') || link;
      button.classList.add('cards-article-header-cta');
    }
    while (prev.firstChild) {
      const node = prev.firstChild;
      if (button && (node === button)) header.append(node);
      else headings.append(node);
    }
    header.prepend(headings);
    prev.remove();
  }

  block.textContent = '';
  if (header) block.append(header);
  block.append(ul);
}
