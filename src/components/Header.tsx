'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PHONE, PHONE_HREF } from '@/lib/site';

const LINKS = [
  { href: '#vibro', label: 'Вибростенд' },
  { href: '#services', label: 'Услуги' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#route', label: 'Как проехать' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="head">
      <div className="wrap">
        <a href="#top" className="logo" aria-label="Деталька — на главную" onClick={close}>
          <img src="/images/brand/logo-white.png" alt="Деталька" width={207} height={38} />
        </a>
        <nav className="nav" aria-label="Разделы">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <a className="head-phone" href={PHONE_HREF}>{PHONE}</a>
        <a className="btn btn-pri" href="#booking">Записаться</a>
        <button className="burger" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <nav className={`mnav${open ? ' open' : ''}`} aria-label="Меню">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
        ))}
        <a href={PHONE_HREF} onClick={close}>{PHONE}</a>
        <a className="btn btn-pri" href="#booking" onClick={close}>Записаться на сервис</a>
      </nav>
    </header>
  );
}
