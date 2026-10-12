'use client';

import { useState } from 'react';
import Flag from '@/components/Flag';
import { MaxLogo, TelegramLogo } from '@/components/MessengerIcons';
import { sendBooking } from '@/lib/booking';
import { BOOKING_SERVICES, MAX_URL, PHONE, PHONE_HREF, TELEGRAM_NAME, TELEGRAM_URL } from '@/lib/site';

type State = 'idle' | 'sending' | 'sent' | 'failed';

export default function Booking() {
  const [state, setState] = useState<State>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '');
    setState('sending');
    const ok = await sendBooking({ name: get('name'), phone: get('phone'), car: get('car'), service: get('service'), comment: get('comment') });
    setState(ok ? 'sent' : 'failed');
  }

  return (
    <section className="dark booking sec" id="booking">
      <Flag />
      <div className="wrap">
        <div>
          <h2 className="h2">Запишитесь на сервис</h2>
          <p className="lead-d">
            Оставьте заявку — администратор перезвонит, уточнит детали и подберёт удобное время. Быстрее всего ответим в MAX.
          </p>
          <div className="chat-cards">
            <a className="chat" href={MAX_URL} target="_blank" rel="noopener">
              <MaxLogo />
              <span><small>Отвечаем быстрее всего</small><b>Написать в MAX</b></span>
            </a>
            <a className="chat" href={TELEGRAM_URL} target="_blank" rel="noopener">
              <TelegramLogo className="tg" />
              <span><small>{TELEGRAM_NAME}</small><b>Написать в Telegram</b></span>
            </a>
            <a className="chat" href={PHONE_HREF}>
              <span className="tg" style={{ display: 'grid', placeItems: 'center', background: 'var(--acc)', color: 'var(--acc-ink)', fontSize: 20 }} aria-hidden="true">✆</span>
              <span><small>Позвонить</small><b>{PHONE}</b></span>
            </a>
          </div>
        </div>

        {state === 'sent' || state === 'failed' ? (
          <div className="form form-done" role="status">
            <h3>{state === 'sent' ? 'Заявка отправлена' : 'Заявка не ушла'}</h3>
            <p style={{ color: 'var(--ink2)' }}>
              {state === 'sent'
                ? 'Администратор перезвонит вам в рабочее время, ежедневно с 9 до 18.'
                : 'Не получилось отправить заявку — похоже, пропала связь. Позвоните или напишите нам, запишем сразу.'}
            </p>
            <div className="btns">
              <a className="btn btn-pri" href={PHONE_HREF}>{PHONE}</a>
              <a className="btn btn-line" href={MAX_URL} target="_blank" rel="noopener">Написать в MAX</a>
            </div>
            <button className="btn btn-line" onClick={() => setState('idle')}>Заполнить ещё раз</button>
          </div>
        ) : (
          <form className="form" onSubmit={onSubmit}>
            <h3>Онлайн-заявка</h3>
            <div className="row">
              <label>Имя (необязательно)<input id="b-name" name="name" autoComplete="given-name" placeholder="Как к вам обращаться" /></label>
              <label>Телефон<input id="b-phone" name="phone" type="tel" required autoComplete="tel" placeholder="+7 (___) ___-__-__" /></label>
            </div>
            <div className="row">
              <label>Автомобиль<input id="b-car" name="car" placeholder="Марка, модель, год" /></label>
              <label>Услуга
                <select id="b-service" name="service" defaultValue={BOOKING_SERVICES[0]}>
                  {BOOKING_SERVICES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
            <label>Комментарий<textarea id="b-comment" name="comment" placeholder="Что беспокоит, удобное время" /></label>
            <button className="btn btn-pri" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
            </button>
            <small>Перезвоним в рабочее время: ежедневно с 9 до 18.</small>
            {/* Честная формулировка вместо «не является сбором ПД»: телефон — персональные данные,
                поэтому говорим, что сайт их не хранит, куда уходит заявка и как обойтись без формы. */}
            <small className="form-note">
              Сайт не хранит введённые данные: заявка сразу уходит письмом администратору техцентра (через сервис отправки
              форм Web3Forms) и нужна только для того, чтобы перезвонить и записать вас. Не хотите оставлять телефон —
              позвоните нам или напишите в MAX.
            </small>
          </form>
        )}
      </div>
    </section>
  );
}
