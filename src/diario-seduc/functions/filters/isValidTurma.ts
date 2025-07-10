export function isValidTurma(document: Document) {
  const nodes = document.querySelectorAll<HTMLTableRowElement>(
    'html > body > .container tbody > tr',
  );
  return nodes.length !== 0;
}
