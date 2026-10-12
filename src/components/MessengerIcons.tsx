type IconProps = { className?: string };

// Значок MAX — фирменная картинка приложения.
export const MaxLogo = ({ className = '' }: IconProps) => (
  <img src="/images/brand/max-logo.png" alt="" className={className} />
);

// Значок Telegram: бумажный самолётик на голубом фоне.
export const TelegramLogo = ({ className = '' }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="tg-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#37BBFE" />
        <stop offset="1" stopColor="#1E96D7" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="10" fill="url(#tg-bg)" />
    <path
      fill="#fff"
      d="M11.2 23.4c7.2-3.1 12-5.2 14.4-6.2 6.9-2.9 8.3-3.4 9.2-3.4.2 0 .7 0 1 .3.2.2.3.5.3.7v.9c-.4 4-2 13.7-2.9 18.1-.4 1.9-1.1 2.5-1.8 2.6-1.5.1-2.6-1-4.1-2-2.3-1.5-3.6-2.4-5.8-3.9-2.6-1.7-.9-2.6.6-4.1.4-.4 7-6.4 7.1-6.9 0-.1 0-.3-.1-.4-.2-.1-.4-.1-.5 0-.2 0-3.9 2.5-11 7.3-1 .7-2 1.1-2.8 1-.9 0-2.7-.5-4-1-1.6-.5-2.9-.8-2.8-1.7.1-.5.7-.9 1.9-1.3z"
    />
  </svg>
);
