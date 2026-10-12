// Симуляция ткани флага (Верле): сетка частиц со связями, закреплённый левый край, тяжесть и ветер.
// Отдельно от компонента, чтобы параметры можно было проверить без браузера.

export const NX = 36; // частиц по длине (минус один)
export const NY = 24; // по высоте
export const W = 1.5;
export const H = 1.0;
export const ITER = 4; // проходов по связям за шаг: больше — жёстче ткань и дороже расчёт

// Подобрано по проверке scripts/cloth-check.mjs: флаг держится развёрнутым, но хлопает и мнётся.
export const CLOTH = { wind: 5, lift: 1.4, drag: 0.8, gravity: 1.0, density: 0.38 };
// Скорость времени для флага: 1 — реальное, меньше — плавнее и спокойнее (и дешевле для процессора)
export const SPEED = 0.42;

export function makeCloth(seed: number, o = CLOTH) {
  const n = (NX + 1) * (NY + 1);
  // физика считается в 64-битных числах (так быстрее в JS), для видеокарты — копия в out
  const pos = new Float64Array(n * 3);
  const prev = new Float64Array(n * 3);
  const force = new Float64Array(n * 3);
  const out = new Float32Array(n * 3);
  const nor = new Float32Array(n * 3);
  const uv = new Float32Array(n * 2);
  const id = (i: number, j: number) => j * (NX + 1) + i;
  for (let j = 0; j <= NY; j++)
    for (let i = 0; i <= NX; i++) {
      const k = id(i, j);
      pos[k * 3] = -0.75 + (i / NX) * W;
      pos[k * 3 + 1] = -0.5 + (j / NY) * H;
      pos[k * 3 + 2] = 0.002 * Math.sin(i * 1.3 + j * 0.7);
      uv[k * 2] = i / NX;
      uv[k * 2 + 1] = j / NY;
    }
  prev.set(pos);

  // связи: по сетке (держат длину), диагональные (сдвиг) и через одну (слабый изгиб)
  const cons: number[] = [];
  const add = (a: number, b: number, stiff: number) => {
    const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
    cons.push(a, b, Math.sqrt(dx * dx + dy * dy + dz * dz), stiff);
  };
  for (let j = 0; j <= NY; j++)
    for (let i = 0; i <= NX; i++) {
      if (i < NX) add(id(i, j), id(i + 1, j), 1);
      if (j < NY) add(id(i, j), id(i, j + 1), 1);
      if (i < NX && j < NY) { add(id(i, j), id(i + 1, j + 1), 0.6); add(id(i + 1, j), id(i, j + 1), 0.6); }
      if (i < NX - 1) add(id(i, j), id(i + 2, j), 0.08);
      if (j < NY - 1) add(id(i, j), id(i, j + 2), 0.08);
    }
  // связи в плоских массивах: индексы уже умножены на 3, веса поправок посчитаны заранее
  // (закреплённая точка не двигается, её сосед двигается за двоих)
  const nc = cons.length / 4;
  const CA = new Int32Array(nc), CB = new Int32Array(nc), CR = new Float64Array(nc), CS = new Float64Array(nc);
  const KA = new Float64Array(nc), KB = new Float64Array(nc);
  const isPinned = (k: number) => k % (NX + 1) === 0;
  for (let q = 0; q < nc; q++) {
    const a = cons[q * 4], b = cons[q * 4 + 1];
    CA[q] = a * 3; CB[q] = b * 3; CR[q] = cons[q * 4 + 2]; CS[q] = cons[q * 4 + 3];
    const pa = isPinned(a), pb = isPinned(b);
    KA[q] = pa ? 0 : pb ? 2 : 1; KB[q] = pb ? 0 : pa ? 2 : 1;
  }

  const tris: number[] = [];
  for (let j = 0; j < NY; j++)
    for (let i = 0; i < NX; i++) {
      const a = id(i, j), b = id(i + 1, j), c = id(i, j + 1), d = id(i + 1, j + 1);
      tris.push(a, b, c, b, d, c);
    }
  const T = new Uint16Array(tris);
  const PIN = new Uint8Array(n);
  for (let k = 0; k < n; k++) PIN[k] = isPinned(k) ? 1 : 0;
  const cellArea = (W / NX) * (H / NY);

  let t = seed;
  const DT = 1 / 120;

  function step() {
    t += DT;
    // ветер: основной поток вдоль флага, порывы и завихрения, разные по месту и времени
    const gust = 0.62 + 0.25 * Math.sin(t * 0.71) * Math.sin(t * 0.27 + seed) + 0.13 * Math.sin(t * 2.3 + seed * 2.0);
    const wx = o.wind * gust, wyBase = 0.25 * Math.sin(t * 0.9 + seed), wzBase = 0.55 * Math.sin(t * 1.4 + seed);
    force.fill(0);
    const invDT = 1 / DT;
    for (let q = 0; q < T.length; q += 3) {
      const a = T[q] * 3, b = T[q + 1] * 3, c = T[q + 2] * 3;
      const ax = pos[a], ay = pos[a + 1], az = pos[a + 2];
      const e1x = pos[b] - ax, e1y = pos[b + 1] - ay, e1z = pos[b + 2] - az;
      const e2x = pos[c] - ax, e2y = pos[c + 1] - ay, e2z = pos[c + 2] - az;
      let nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= len; ny /= len; nz /= len;
      const area = len * 0.5;
      // завихрения: ветер в каждой точке немного свой
      const cx = ax + (e1x + e2x) / 3, cy = ay + (e1y + e2y) / 3;
      const turb = Math.sin(cx * 4.1 - t * 5.3 + cy * 2.7) + 0.6 * Math.sin(cy * 6.3 + t * 3.1 - cx * 1.9);
      // ветер относительно движущейся ткани
      const rx = wx - (ax - prev[a]) * invDT;
      const ry = wyBase + 0.25 * turb - (ay - prev[a + 1]) * invDT;
      const rz = wzBase + 0.5 * turb - (az - prev[a + 2]) * invDT;
      // давление на полотнище (по нормали) + трение потока вдоль ткани — оно и вытягивает флаг по ветру
      const f = (nx * rx + ny * ry + nz * rz) * area * o.lift;
      const fd = area * o.drag;
      const fx = nx * f + rx * fd, fy = ny * f + ry * fd, fz = nz * f + rz * fd;
      force[a] += fx; force[a + 1] += fy; force[a + 2] += fz;
      force[b] += fx; force[b + 1] += fy; force[b + 2] += fz;
      force[c] += fx; force[c + 1] += fy; force[c + 2] += fz;
    }
    const dt2 = DT * DT;
    const kf = dt2 / (cellArea * o.density) / 3; // масса частицы: площадь × плотность ткани (меньше — легче)
    const g = -o.gravity * dt2;
    for (let k = 0; k < n; k++) {
      if (PIN[k]) continue;
      const i = k * 3;
      let x = pos[i];
      pos[i] = x + (x - prev[i]) * 0.992 + force[i] * kf; prev[i] = x;
      x = pos[i + 1];
      pos[i + 1] = x + (x - prev[i + 1]) * 0.992 + force[i + 1] * kf + g; prev[i + 1] = x;
      x = pos[i + 2];
      pos[i + 2] = x + (x - prev[i + 2]) * 0.992 + force[i + 2] * kf; prev[i + 2] = x;
    }
    for (let it = 0; it < ITER; it++) {
      for (let q = 0; q < nc; q++) {
        const a = CA[q], b = CB[q];
        const dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1], dz = pos[b + 2] - pos[a + 2];
        const l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const st = CS[q], rest = CR[q];
        // изгибным связям разрешаем сжиматься — ткань складывается, а не пружинит
        if (st < 0.5 && l < rest) continue;
        const diff = ((l - rest) / l) * 0.5 * st;
        const ka = KA[q] * diff, kb = KB[q] * diff;
        pos[a] += dx * ka; pos[a + 1] += dy * ka; pos[a + 2] += dz * ka;
        pos[b] -= dx * kb; pos[b + 1] -= dy * kb; pos[b + 2] -= dz * kb;
      }
    }
  }

  // нормали и копия координат для видеокарты — раз в кадр
  function normals() {
    out.set(pos);
    nor.fill(0);
    for (let q = 0; q < T.length; q += 3) {
      const a = T[q], b = T[q + 1], c = T[q + 2];
      const e1x = pos[b * 3] - pos[a * 3], e1y = pos[b * 3 + 1] - pos[a * 3 + 1], e1z = pos[b * 3 + 2] - pos[a * 3 + 2];
      const e2x = pos[c * 3] - pos[a * 3], e2y = pos[c * 3 + 1] - pos[a * 3 + 1], e2z = pos[c * 3 + 2] - pos[a * 3 + 2];
      const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      nor[a * 3] += nx; nor[a * 3 + 1] += ny; nor[a * 3 + 2] += nz;
      nor[b * 3] += nx; nor[b * 3 + 1] += ny; nor[b * 3 + 2] += nz;
      nor[c * 3] += nx; nor[c * 3 + 1] += ny; nor[c * 3 + 2] += nz;
    }
  }

  return { pos, out, nor, uv, T, step, normals, id };
}

