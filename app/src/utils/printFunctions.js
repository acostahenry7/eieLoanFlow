//Section divisor
export function zSection(title, x, y, p) {
  x = x?.toString();
  y = y?.toString();
  p = p?.toString() || "35";

  return `
      ^FO${p},${y - 5}^GB500,25,2^FS
      ^FO${x},${y},^ADN,26,11^FD${title}^FS
      `;
}

export function zTitle(text, x, y, h, w) {
  x = x?.toString();
  y = y?.toString();
  w = w?.toString() || "22";
  h = h?.toString() || "25";

  return `^FO${x},${y},^A0N,${h},${w}^FD${text}^FS`;
}

//Text

export function zText(text, x, y) {
  x = x.toString();
  y = y.toString();

  return `^FO${x},${y},^ADN,26,12^FD${text}^FS`;
}
