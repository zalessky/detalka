'use client';

import { useEffect, useState } from 'react';
import { PALETTE, type Palette } from '@/lib/site';

// Временный переключатель палитр для сравнения на живом сайте (p4 «Морской» ↔ p5 «Графит и петроль»).
// Выбор запоминается в браузере. Когда палитру утвердим — компонент убрать из шапки.
const OPTIONS: { id: Palette; a: string; b: string; title: string }[] = [
  { id: 'p4', a: '#1d4f6e', b: '#1d8bd8', title: 'Палитра 4' },
  { id: 'p5', a: '#22292f', b: '#2d8ccc', title: 'Палитра 5' },
];

export default function PaletteSwitch() {
  const [cur, setCur] = useState<Palette>(PALETTE);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('detalka-palette'); } catch {}
    const fromUrl = document.documentElement.getAttribute('data-palette') as Palette;
    const p = (OPTIONS.find((o) => o.id === saved)?.id ?? fromUrl ?? PALETTE) as Palette;
    apply(p, false);
  }, []);

  function apply(p: Palette, save = true) {
    document.documentElement.setAttribute('data-palette', p);
    setCur(p);
    if (save) try { localStorage.setItem('detalka-palette', p); } catch {}
    // флаг на WebGL перечитывает цвета палитры
    window.dispatchEvent(new Event('palettechange'));
  }

  return (
    <div className="pal-switch" role="group" aria-label="Палитра сайта">
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.title}
          aria-label={o.title}
          aria-pressed={cur === o.id}
          onClick={() => apply(o.id)}
          style={{ background: `linear-gradient(135deg, ${o.a} 50%, ${o.b} 50%)` }}
        />
      ))}
    </div>
  );
}
