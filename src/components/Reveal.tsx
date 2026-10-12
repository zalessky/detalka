'use client';

import { useEffect } from 'react';

// Элементы с классом .reveal появляются снизу по очереди, когда до них доходит прокрутка.
// Прячем только то, что ниже первого экрана, поэтому без скрипта страница остаётся целой.
export default function Reveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const order = new Map<Element, number>();
    els.forEach((el) => {
      const parent = el.parentElement!;
      const i = order.get(parent) ?? 0;
      order.set(parent, i + 1);
      el.style.setProperty('--d', `${Math.min(i, 8) * 0.08}s`);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove('pre');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pre');
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);
  return null;
}
