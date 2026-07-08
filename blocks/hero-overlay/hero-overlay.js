export default function decorate(block) {
  // The media cell may reference a background video (e.g. the homepage primary
  // hero uses an .mp4). Videos MUST be authored as a link (<a href="…mp4">):
  // AEM's image pipeline rejects an <img src="…mp4"> and rewrites it to
  // about:error on publish, so an authored image would never render. Detect the
  // mp4/webm reference from either a link (preferred, publish-safe) or an <img>
  // (local/EMA only) and get its URL.
  const mediaCell = block.querySelector(':scope > div:first-child');
  const isVideoUrl = (url) => /\.(mp4|webm)(\?|$)/i.test(url || '');
  const mediaLink = mediaCell
    ? [...mediaCell.querySelectorAll('a[href]')].find((a) => isVideoUrl(a.getAttribute('href')))
    : null;
  const mediaImg = mediaCell ? mediaCell.querySelector('img') : null;
  const videoUrl = (mediaLink && mediaLink.getAttribute('href'))
    || (mediaImg && isVideoUrl(mediaImg.getAttribute('src')) ? mediaImg.getAttribute('src') : null);

  if (!videoUrl && !block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Swap the authored link/img for an autoplaying, muted, looping <video>.
  if (videoUrl) {
    const src = videoUrl;
    const video = document.createElement('video');
    // Set autoplay-critical flags as HTML ATTRIBUTES (not just JS properties).
    // Browsers only honor muted-autoplay when the `muted` and `autoplay`
    // attributes are present in the markup; setting the JS property alone is
    // unreliable on published environments (worked in EMA, failed on aem.page).
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    video.setAttribute('aria-hidden', 'true');
    // Keep the properties too for good measure (some engines read them first).
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    // Use a nested <source> so the type is explicit and the element can retry.
    const source = document.createElement('source');
    source.setAttribute('src', src);
    source.setAttribute('type', src.includes('.webm') ? 'video/webm' : 'video/mp4');
    video.append(source);
    // Replace whatever carried the video reference: the authored link (and its
    // wrapping <p>), or the <picture>/<img> on local/EMA.
    let target = mediaLink || mediaImg;
    if (mediaImg && !mediaLink) target = mediaImg.closest('picture') || mediaImg;
    const wrapperP = target && target.closest('p');
    (wrapperP || target).replaceWith(video);
    // Kick off playback explicitly (covers browsers that ignore the attribute).
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => { /* autoplay blocked; poster frame remains */ });
    }
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
