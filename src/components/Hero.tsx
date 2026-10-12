import Brand from '@/components/Brand';
import Flag from '@/components/Flag';
import { MaxLogo, TelegramLogo } from '@/components/MessengerIcons';
import { ADDRESS, MAX_URL, PHONE_HREF, PHONE_SHORT, TELEGRAM_URL } from '@/lib/site';

export default function Hero() {
  return (
    <section className="dark hero" id="top">
      <Flag />
      <div className="wrap">
        <div className="hero-text">
          <Brand className="brand-hero" />
          <h1>Ремонт и обслуживание автомобилей — от диагностики до последней детальки</h1>
          <p className="hero-sub">
            Диагностика подвески на вибростенде, двигатель, ходовая, развал-схождение 3D, кондиционеры. Магазин запчастей
            при СТО: подберём деталь по VIN.
          </p>
          <div className="cta">
            <a className="btn btn-pri" href="#booking">Записаться на сервис</a>
            <a className="btn btn-ghost" href={MAX_URL} target="_blank" rel="noopener">
              <MaxLogo className="ico-img" />
              Написать в MAX
            </a>
            <a className="btn btn-ghost" href={TELEGRAM_URL} target="_blank" rel="noopener">
              <TelegramLogo className="ico-img" />
              Написать в Telegram
            </a>
          </div>
          {/* адрес растянут ровно по ширине номера телефона */}
          <div className="hero-contact">
            <a className="hero-tel" href={PHONE_HREF}>{PHONE_SHORT}</a>
            <svg className="hero-addr" viewBox="0 0 600 30" role="img" aria-label={ADDRESS}>
              <text x="0" y="22" textLength="600" lengthAdjust="spacingAndGlyphs">{ADDRESS}</text>
            </svg>
          </div>
        </div>
        <div className="hero-vis">
          <img src="/images/brand/mascot-ok.png" alt="" width={330} height={464} />
        </div>
      </div>
    </section>
  );
}
