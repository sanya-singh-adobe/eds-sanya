export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // The media cell may reference a background video that the importer captured
  // as an <img> (e.g. the homepage primary hero uses an .mp4). An <img> cannot
  // render a video, so swap it for an autoplaying, muted, looping <video>.
  const mediaImg = block.querySelector(':scope > div:first-child img');
  if (mediaImg && /\.(mp4|webm)(\?|$)/i.test(mediaImg.getAttribute('src') || '')) {
    const src = mediaImg.getAttribute('src');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.src = src;
    // Replace the whole <picture> (or the bare <img>) with the video.
    const picture = mediaImg.closest('picture');
    (picture || mediaImg).replaceWith(video);
  }

  // Distinguish usages by the content row shape:
  // - careers hero: eyebrow (h1) + large headline (h2), centered over a
  //   full-bleed photo.
  // - homepage "primary" hero: single large headline (h1) + subcopy (p),
  //   asymmetric editorial layout with a partial-width background video.
  // The homepage row has an h1 + p but no h2, so use that as the signal.
  const contentRow = block.querySelector(':scope > div:last-child');
  if (contentRow
    && contentRow.querySelector('h1')
    && contentRow.querySelector('p')
    && !contentRow.querySelector('h2')) {
    block.classList.add('primary');
  }
}
