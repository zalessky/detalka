'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, Shuffle } from 'lucide-react';
import { GIS_REVIEWS_URL, REVIEWS, REVIEWS_SHOWN, YANDEX_REVIEWS_URL, type Review } from '@/lib/site';

const SRC = { yandex: 'Яндекс Карты', '2gis': '2ГИС' } as const;

// Случайная подборка без повторов; при «Другие отзывы» стараемся не показывать те же самые.
function pick(prev: Review[] = []): Review[] {
  const rest = REVIEWS.filter((r) => !prev.includes(r));
  const pool = rest.length >= REVIEWS_SHOWN ? rest : REVIEWS;
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, REVIEWS_SHOWN);
}

export default function Reviews() {
  // При сборке в статику — первые отзывы списка, в браузере сразу заменяются случайными.
  const [shown, setShown] = useState<Review[]>(REVIEWS.slice(0, REVIEWS_SHOWN));
  useEffect(() => setShown(pick()), []);

  return (
    <section className="sec reviews" id="reviews">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2 reveal">Что говорят клиенты</h2>
        </div>
        <div className="rev-grid" aria-live="polite">
          {shown.map((r) => (
            <figure className="rev" key={r.text.slice(0, 32)}>
              <div className="stars" aria-label="5 из 5">★★★★★</div>
              <blockquote>{r.text}</blockquote>
              <figcaption>{SRC[r.src]}</figcaption>
            </figure>
          ))}
        </div>
        <div className="rev-links">
          <button className="rev-more" onClick={() => setShown(pick(shown))}>
            <Shuffle size={18} /> Другие отзывы
          </button>
          <a className="rev-more" href={YANDEX_REVIEWS_URL} target="_blank" rel="noopener">
            Все отзывы на Яндекс Картах <ArrowUpRight size={18} />
          </a>
          <a className="rev-more" href={GIS_REVIEWS_URL} target="_blank" rel="noopener">
            Все отзывы в 2ГИС <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
