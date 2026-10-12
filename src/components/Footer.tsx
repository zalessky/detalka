import Brand from '@/components/Brand';
import { ADDRESS, EMAIL, HOURS, MAX_URL, PHONE, PHONE_HREF, TELEGRAM_NAME, TELEGRAM_URL } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="dark foot">
      <div className="wrap">
        <Brand className="brand-foot" />
        <div className="foot-links">
          <a href={PHONE_HREF}>{PHONE}</a>
          <a href={MAX_URL} target="_blank" rel="noopener">MAX</a>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener">Telegram {TELEGRAM_NAME}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
        <div className="foot-copy">
          Техцентр «Деталька» · {ADDRESS} · {HOURS}. Информация на сайте не является публичной офертой, цены указаны «от» —
          точную стоимость назовём после диагностики.
        </div>
      </div>
    </footer>
  );
}
