export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // Benefits variant: text column has no heading (h1-h6). Tag the block so CSS
  // can apply the full-bleed image / fixed-height treatment without nested :has().
  const hasHeading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (!hasHeading) {
    block.classList.add('columns-media-media');
  }

  // Collage variant: an image column holds more than one picture (homepage
  // "What We Do"). Tag the block so CSS can lay the photos out as a collage
  // without regressing the single-image careers instances.
  const hasCollage = [...block.querySelectorAll(':scope > div > div')]
    .some((col) => col.querySelectorAll('picture').length > 1);
  if (hasCollage) {
    block.classList.add('columns-media-collage');
  }

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pictures = col.querySelectorAll('picture');
      // An image column is a cell whose only content is one or more pictures.
      // EDS may wrap bare images in <p> tags, so also treat a cell whose direct
      // children are only pictures and/or picture-only <p> wrappers as an image
      // column (this is the collage case: three pictures inside a single <p>).
      const onlyPicturesOrPWrappers = [...col.children].every((child) => {
        if (child.tagName === 'PICTURE') return true;
        return child.tagName === 'P'
          && child.querySelector('picture')
          && child.querySelectorAll('picture').length === child.children.length;
      });
      if (pictures.length && onlyPicturesOrPWrappers) {
        col.classList.add('columns-media-img-col');
      }
    });
  });
}
