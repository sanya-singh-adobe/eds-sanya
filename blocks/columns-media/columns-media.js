export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // Benefits variant: text column has no heading (h1-h6). Tag the block so CSS
  // can apply the full-bleed image / fixed-height treatment without nested :has().
  const hasHeading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (!hasHeading) {
    block.classList.add('columns-media-media');
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-media-img-col');
        }
      }
    });
  });
}
