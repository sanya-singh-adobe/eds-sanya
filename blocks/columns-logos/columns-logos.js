export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];

  // The block is authored as a single row with two cells:
  //   cell 1 -> text content (eyebrow, heading, paragraph, button)
  //   cell 2 -> logo grid (linked logo images)
  cells.forEach((cell) => {
    const links = cell.querySelectorAll('a');
    const hasHeading = cell.querySelector('h1, h2, h3, h4, h5, h6');
    const logoLinks = [...links].filter((a) => a.querySelector('picture, img'));

    if (!hasHeading && logoLinks.length > 1) {
      cell.classList.add('columns-logos-grid');
      // EDS decorateMain wraps standalone links in <p> tags. Move the logo
      // links up to be direct children of the grid cell so they become grid
      // items, then drop the now-empty wrapper paragraphs.
      logoLinks.forEach((a) => {
        a.classList.add('columns-logos-tile');
        cell.append(a);
      });
      [...cell.querySelectorAll('p')].forEach((p) => {
        if (!p.querySelector('a')) p.remove();
      });
    } else {
      cell.classList.add('columns-logos-text');
    }
  });
}
