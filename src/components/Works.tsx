import { ALL_WORKS, HOURLY_RATE } from '@/lib/site';

export default function Works() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 className="h2 reveal">Все работы</h2>
        <div className="chips">
          {ALL_WORKS.map((w) => (
            <span className="reveal" key={w}>{w}</span>
          ))}
        </div>
        <p className="note">
          Нормочас {HOURLY_RATE}. Об акциях и скидках спрашивайте при визите — они бывают постоянно.
        </p>
      </div>
    </section>
  );
}
