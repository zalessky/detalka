import { Navigation, MapPin } from 'lucide-react';
import { ADDRESS, GIS_URL, HOURS, YANDEX_MAP_WIDGET, YANDEX_ROUTE_URL } from '@/lib/site';

export default function Route() {
  return (
    <section className="sec" id="route">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2 reveal">Как проехать</h2>
        </div>
        <div className="route-grid">
          <div className="route-info">
            <img src="/images/photos/facade.jpg" alt="Фасад техцентра с вывеской «Техцентр Деталька»" loading="lazy" />
            <div className="addr">
              <b>{ADDRESS}</b>
              <span>{HOURS} · заезд через ворота под вывеской</span>
            </div>
            <div className="cta">
              <a className="btn btn-pri" href={YANDEX_ROUTE_URL} target="_blank" rel="noopener">
                <Navigation size={18} /> Построить маршрут
              </a>
              <a className="btn btn-line" href={GIS_URL} target="_blank" rel="noopener">
                <MapPin size={18} /> Открыть в 2ГИС
              </a>
            </div>
          </div>
          <div className="map">
            <iframe src={YANDEX_MAP_WIDGET} title="Техцентр «Деталька» на Яндекс Картах" loading="lazy" allowFullScreen />
          </div>
        </div>
      </div>
    </section>
  );
}
