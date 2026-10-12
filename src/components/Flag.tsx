'use client';

import { useEffect, useRef } from 'react';
import { makeCloth, SPEED } from '@/lib/cloth';

// Клетчатый флаг пит-стопа (6 × 4 клетки) — симуляция ткани.
// Полотнище — сетка частиц со связями (Верле): связи держат длину ткани, но почти не сопротивляются изгибу,
// поэтому ткань мнётся и складывается, а не пружинит. Левый край закреплён, тянет сила тяжести,
// ветер с порывами и завихрениями давит на каждый треугольник в зависимости от его угла к потоку.
// Складки, хлопки и провисания получаются сами. Цвета — из палитры (--fl-light / --fl-dark).
// Вне экрана и на скрытой вкладке симуляция на паузе; при «уменьшить движение» — один застывший кадр.


const VERT = `
attribute vec3 aPos;
attribute vec3 aN;
attribute vec2 aUV;
uniform mat4 uMVP;
uniform mat4 uModel;
uniform mat3 uNormal;
varying vec2 vUV;
varying vec3 vN;
varying vec3 vPos;
void main() {
  vN = uNormal * aN;
  vPos = (uModel * vec4(aPos, 1.0)).xyz;
  vUV = aUV;
  gl_Position = uMVP * vec4(aPos, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform vec3 uLight;
uniform vec3 uDark;
uniform vec3 uEye;
varying vec2 vUV;
varying vec3 vN;
varying vec3 vPos;
void main() {
  vec2 g = vUV * vec2(6.0, 4.0);
  float c = mod(floor(g.x) + floor(g.y), 2.0);
  vec3 base = mix(uLight, uDark, c);
  base *= 0.97 + 0.03 * sin(vUV.x * 900.0) * sin(vUV.y * 620.0); // плетение
  vec3 n = normalize(vN);
  vec3 V = normalize(uEye - vPos);
  if (dot(n, V) < 0.0) n = -n;
  vec3 L = normalize(vec3(-0.7, 0.5, 0.6));
  float d = dot(n, L) * 0.5 + 0.5;          // матовая ткань: мягкий обёрнутый свет
  float dif = d * d;
  float sheen = pow(1.0 - abs(dot(n, V)), 3.0) * 0.16;
  float spec = pow(max(dot(reflect(-L, n), V), 0.0), 6.0) * 0.05;
  vec3 col = base * (0.16 + 1.0 * dif) + vec3(sheen + spec) * (0.6 + 0.4 * (1.0 - c));
  gl_FragColor = vec4(col, 1.0);
}`;

// --- матрицы (column-major) ---
type M = Float32Array;
const mul = (a: M, b: M): M => {
  const o = new Float32Array(16);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
      o[i * 4 + j] = s;
    }
  return o;
};
const persp = (fovY: number, asp: number, n: number, f: number): M => {
  const t = 1 / Math.tan(fovY / 2);
  return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]);
};
const trans = (x: number, y: number, z: number): M => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
const rx = (a: number): M => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); };
const ry = (a: number): M => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); };
const rz = (a: number): M => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); };

function readColor(name: string, fallback: [number, number, number]): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const m = /^#([0-9a-f]{6})$/i.exec(v);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function Flag({ side = 'left' }: { side?: 'left' | 'right' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: true, alpha: true });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const logs = gl.getAttachedShaders(prog)?.map((s) => gl.getShaderInfoLog(s)).join(' | ');
      console.warn('Flag: WebGL program failed', gl.getProgramInfoLog(prog), logs);
      return;
    }
    gl.useProgram(prog);

    const seed = side === 'right' ? 7.3 : 1.1;
    const cloth = makeCloth(seed);
    // разгон: флаг уже развевается к моменту показа
    for (let i = 0; i < 360; i++) cloth.step();
    cloth.normals();

    const buf = (data: Float32Array, name: string, size: number, usage: number) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      const loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return b;
    };
    const bPos = buf(cloth.out, 'aPos', 3, gl.DYNAMIC_DRAW);
    const bNor = buf(cloth.nor, 'aN', 3, gl.DYNAMIC_DRAW);
    buf(cloth.uv, 'aUV', 2, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cloth.T, gl.STATIC_DRAW);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uMVP = U('uMVP');
    const setColors = () => {
      gl.uniform3fv(U('uLight'), readColor('--fl-light', [0.87, 0.92, 0.95]));
      gl.uniform3fv(U('uDark'), readColor('--fl-dark', [0.06, 0.16, 0.24]));
    };
    setColors();
    const eye: [number, number, number] = [0, 0, 2.3];
    gl.uniform3fv(U('uEye'), eye);
    gl.enable(gl.DEPTH_TEST);

    const model = mul(trans(0.0, 0.08, 0), mul(rz(-0.08), mul(rx(0.12), ry(-0.32))));
    gl.uniformMatrix4fv(U('uModel'), false, model);
    gl.uniformMatrix3fv(U('uNormal'), false, new Float32Array([model[0], model[1], model[2], model[4], model[5], model[6], model[8], model[9], model[10]]));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniformMatrix4fv(uMVP, false, mul(persp((38 * Math.PI) / 180, w / h, 0.1, 10), mul(trans(-eye[0], -eye[1], -eye[2]), model)));
    };

    const draw = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, bPos);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, cloth.out);
      gl.bindBuffer(gl.ARRAY_BUFFER, bNor);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, cloth.nor);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, cloth.T.length, gl.UNSIGNED_SHORT, 0);
    };

    resize();
    draw();
    // переключили палитру — перекрашиваем флаг
    const onPalette = () => { setColors(); draw(); };
    window.addEventListener('palettechange', onPalette);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => window.removeEventListener('palettechange', onPalette);

    let raf = 0, visible = true, last = performance.now(), acc = 0;
    // страховка для слабых устройств: если расчёт кадра стабильно дороже 8 мс, флаг замирает
    let cost = 0, frames = 0, frozen = false;
    const loop = (now: number) => {
      const t0 = performance.now();
      // фиксированный шаг физики, не больше 6 шагов за кадр; время флага идёт со скоростью SPEED
      acc = Math.min(acc + ((now - last) / 1000) * SPEED, 6 / 120);
      last = now;
      while (acc >= 1 / 120) { cloth.step(); acc -= 1 / 120; }
      cloth.normals();
      draw();
      cost += performance.now() - t0;
      if (++frames === 90) {
        if (cost / frames > 8) { frozen = true; raf = 0; return; }
        cost = 0; frames = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    const run = () => { if (!raf && !frozen && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? run() : stop(); });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener('visibilitychange', onVis);
    const ro = new ResizeObserver(() => { resize(); if (!raf) draw(); });
    ro.observe(canvas);
    run();
    return () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('palettechange', onPalette);
    };
  }, [side]);

  return (
    <div className={`flag flag-${side}`} aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
