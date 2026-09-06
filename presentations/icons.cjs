const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const sharp = require('sharp');
const fa6 = require('react-icons/fa6');

const cache = new Map();

async function icon(name, color, px = 256) {
  const key = name + '|' + color + '|' + px;
  if (cache.has(key)) return cache.get(key);
  const El = fa6[name];
  if (!El) throw new Error('Missing icon: ' + name);
  const svg = renderToStaticMarkup(React.createElement(El, { color: '#' + color, size: px }));
  const buf = await sharp(Buffer.from(svg), { density: 384 }).resize(px, px, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  }).png().toBuffer();
  const data = 'image/png;base64,' + buf.toString('base64');
  cache.set(key, data);
  return data;
}

module.exports = { icon };
