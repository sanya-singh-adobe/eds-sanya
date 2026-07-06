export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Homepage variant ("IT and Business Services"): the instance is authored
  // with an <h2> heading and a right-aligned CTA. Group the heading + copy so
  // CSS can lay them out on the left with the button on the right. The careers
  // instance uses a bold <p> heading (no <h2>) and is left unchanged.
  const content = block.querySelector(':scope > div > div');
  if (content && content.querySelector('h2')) {
    block.classList.add('has-heading');
    const button = content.querySelector(':scope > .button-wrapper');
    const textNodes = [...content.children].filter((el) => el !== button);
    if (button && textNodes.length) {
      const textGroup = document.createElement('div');
      textGroup.className = 'hero-cta-banner-text';
      textNodes.forEach((el) => textGroup.append(el));
      content.prepend(textGroup);
    }
  }
}
