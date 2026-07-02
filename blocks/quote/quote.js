export default function decorate(block) {
  const rows = [...block.children];
  // Row 1 = quotation text, Row 2 (optional) = attribution/cite.
  const [quoteRow, citeRow] = rows;

  if (quoteRow) {
    quoteRow.className = 'quote-body';
  }
  if (citeRow) {
    citeRow.className = 'quote-cite';
  }
}
