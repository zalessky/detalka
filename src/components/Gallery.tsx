// Фото временные: из карточек 2ГИС и Яндекс Карт. Заменить на свои, когда будут.
const PHOTOS = [
  { src: 'workshop-1.jpg', alt: 'Посты техцентра', cls: 'wide tall' },
  { src: 'workshop-2.jpg', alt: 'Автомобиль на подъёмнике', cls: 'wide' },
  { src: 'vibrostand-wheel.jpg', alt: 'Колесо на площадке вибростенда', cls: '' },
  { src: 'shop.jpg', alt: 'Автохимия и масла в магазине', cls: 'tall' },
  { src: 'lounge.jpg', alt: 'Зона ожидания для клиентов', cls: '' },
  { src: 'workshop-3.jpg', alt: 'Ремонтная зона', cls: 'wide' },
];

export default function Gallery() {
  return (
    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 className="h2 reveal">Как у нас</h2>
        <p className="lead reveal" style={{ marginBottom: 28 }}>
          8 постов, зона ожидания с Wi-Fi, магазин запчастей рядом с боксами.
        </p>
        <div className="gallery">
          {PHOTOS.map((p) => (
            <figure className={`${p.cls} reveal`} key={p.src}>
              <img src={`/images/photos/${p.src}`} alt={p.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
