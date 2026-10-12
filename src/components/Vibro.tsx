import { VIBRO_PRICE } from '@/lib/site';

// Новая услуга, которой нет у большинства сервисов, — продвигаем первой.
// Формулировки по материалам производителя стенда VIBROCAR (t.me/vibrocar_ru1).
const POINTS = [
  'Проверка под нагрузкой, а не только на подъёмнике',
  'Узлы проверяем и при повёрнутых колёсах: часть стуков слышна только в повороте',
  'Отличаем настоящий источник стука от звука, который передаётся по кузову',
  'Проверяем и недавно заменённые детали: брак и ошибки монтажа тоже стучат',
];

export default function Vibro() {
  return (
    <section className="dark vibro sec" id="vibro">
      <div className="flag flag-right" />
      <div className="wrap">
        <div>
          <span className="badge">Новинка в Энгельсе</span>
          <h2 className="h2">Диагностика подвески на вибростенде</h2>
          <p className="lead-d">
            На подъёмнике подвеска висит без нагрузки, и многие стуки просто не проявляются. Стенд раскачивает каждое
            колесо под весом машины, как на неровной дороге, поэтому мастер слышит стук и находит его источник.
          </p>
          <ul className="checks">
            {POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <a className="btn btn-pri" href="#booking">Записаться на вибростенд</a>
        </div>
        <div className="vibro-ph">
          <img src="/images/photos/vibrostand.jpg" alt="Автомобиль на вибростендах VIBROCAR" width={800} height={600} loading="lazy" />
          <div className="price-tag">
            <small>Диагностика</small>
            <b>{VIBRO_PRICE}</b>
          </div>
        </div>
      </div>
    </section>
  );
}
