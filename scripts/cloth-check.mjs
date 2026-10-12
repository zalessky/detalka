// Проверка физики флага без браузера: node --experimental-strip-types scripts/cloth-check.mjs [wind lift drag gravity density]
// Печатает, насколько флаг развёрнут по длине (span), как провисает (sag) и насколько живо колышется (motion).
import { makeCloth, CLOTH, NX, NY } from '../src/lib/cloth.ts';
const a = process.argv.slice(2).map(Number);
const o = a.length === 5 ? { wind: a[0], lift: a[1], drag: a[2], gravity: a[3], density: a[4] } : CLOTH;
const c = makeCloth(1.1, o);
for (let i = 0; i < 600; i++) c.step();
let span = [], sag = [], zs = [], motion = 0, last = null, bad = false;
for (let f = 0; f < 600; f++) {
  c.step();
  if (f % 4) continue;
  const tip = c.id(NX, NY >> 1) * 3;
  const x = c.pos[tip], y = c.pos[tip + 1], z = c.pos[tip + 2];
  if (!Number.isFinite(x)) { bad = true; break; }
  span.push(x + 0.75); sag.push(y); zs.push(z);
  if (last) motion += Math.hypot(x - last[0], y - last[1], z - last[2]);
  last = [x, y, z];
}
const avg = (v) => v.reduce((s, x) => s + x, 0) / v.length;
const rng = (v) => Math.max(...v) - Math.min(...v);
console.log(JSON.stringify({ o, bad, span: +avg(span).toFixed(2), spanRange: +rng(span).toFixed(2), sag: +avg(sag).toFixed(2), zRange: +rng(zs).toFixed(2), motion: +motion.toFixed(2) }));
