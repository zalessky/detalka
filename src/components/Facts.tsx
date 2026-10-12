import { FACTS } from '@/lib/site';

export default function Facts() {
  return (
    <div className="facts">
      <div className="wrap">
        {FACTS.map((f) => (
          <div className="f" key={f.label}>
            <b>{f.value}</b>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
