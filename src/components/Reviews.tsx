import { ArrowUpRight } from 'lucide-react';
import { GIS_REVIEWS_URL, REVIEWS } from '@/lib/site';

export default function Reviews() {
  return (
    <section className="sec reviews" id="reviews">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2 reveal">Что говорят клиенты</h2>
        </div>
        <div className="rev-grid">
          {REVIEWS.map((r) => (
            <figure className="rev reveal" key={r.slice(0, 24)}>
              <div className="stars" aria-label="5 из 5">★★★★★</div>
              <blockquote>{r}</blockquote>
            </figure>
          ))}
        </div>
        <a className="rev-more" href={GIS_REVIEWS_URL} target="_blank" rel="noopener">
          Все отзывы в 2ГИС <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
