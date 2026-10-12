import type { Metadata, Viewport } from 'next';
// Шрифты хранятся вместе с сайтом (@fontsource), без запросов к Google.
import '@fontsource/unbounded/500.css';
import '@fontsource/unbounded/700.css';
import '@fontsource/golos-text/400.css';
import '@fontsource/golos-text/500.css';
import '@fontsource/golos-text/600.css';
import './globals.css';
import { PALETTE, PALETTES } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://detalka.info'),
  title: 'Техцентр «Деталька» — автосервис в Энгельсе',
  description:
    'Диагностика подвески на вибростенде, аппаратная замена масла в АКПП, развал-схождение 3D, кондиционеры, ремонт двигателя и ходовой. Магазин запчастей при СТО. Энгельс, ул. 148-й Черниговской Дивизии, 26.',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/images/brand/icon-64.png', type: 'image/png', sizes: '64x64' }],
    apple: [{ url: '/images/brand/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'Техцентр «Деталька», Энгельс',
    description: 'Ремонт и обслуживание автомобилей — от диагностики до последней детальки.',
    images: ['/images/photos/vibrostand.jpg'],
    locale: 'ru_RU',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#0e2738', viewportFit: 'cover' };

// Позволяет посмотреть другую палитру без пересборки: ?palette=p2
const paletteScript = `try{var p=new URLSearchParams(location.search).get('palette');if(${JSON.stringify(
  PALETTES,
)}.indexOf(p)>-1)document.documentElement.setAttribute('data-palette',p)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-palette={PALETTE}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: paletteScript }} />
      </head>
      <body>
        {/* Фильтр, который изгибает клетчатый флаг */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="wave" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.009" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={70} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}
