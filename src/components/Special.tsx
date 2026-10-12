import { Cog, Crosshair, Droplets, Snowflake, Wind, PackageSearch } from 'lucide-react';
import { SPECIAL } from '@/lib/site';

const ICONS = [Cog, Crosshair, Droplets, Snowflake, Wind];

export default function Special() {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2 reveal">Что умеем, а умеют не все</h2>
          <p className="lead reveal">Оборудование, которое есть далеко не в каждом сервисе города.</p>
        </div>
        <div className="grid3">
          {SPECIAL.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <article className="card reveal" key={s.title}>
                <div className="ic"><Icon size={24} /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.price && <div className="price">{s.price}</div>}
              </article>
            );
          })}
          <article className="card parts reveal" id="parts">
            <div className="ic"><PackageSearch size={24} /></div>
            <h3>Магазин запчастей при СТО</h3>
            <p>Подберём детали по VIN и поставим в тот же день, если они в наличии.</p>
            <div className="price">Подбор бесплатно при ремонте у нас</div>
          </article>
        </div>
      </div>
    </section>
  );
}
