export type Booking = { name: string; phone: string; car: string; service: string; comment: string };

// Ключ Web3Forms (web3forms.com) для адреса sto@detalka.info. Ключ не секретный:
// он только указывает сервису, на какую почту пересылать заявки.
// Если сервис недоступен, форма предлагает позвонить или написать в MAX / Telegram.
export const WEB3FORMS_KEY = 'fdea26c7-1aba-463b-9b09-a3aa8fbf999f';

// Текст заявки для письма.
export function buildBookingText(b: Booking): string {
  return [
    `Имя: ${b.name.trim() || 'не указано'}`,
    `Телефон: ${b.phone.trim()}`,
    `Автомобиль: ${b.car.trim() || 'не указан'}`,
    `Услуга: ${b.service}`,
    `Комментарий: ${b.comment.trim() || 'нет'}`,
  ].join('\n');
}

// Отправка заявки на почту через Web3Forms. Возвращает false, если ключ не задан,
// сервис отказал или сеть недоступна.
export async function sendBooking(b: Booking): Promise<boolean> {
  if (!WEB3FORMS_KEY) return false;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Заявка с сайта «Деталька»: ${b.service}`,
        from_name: 'Сайт техцентра «Деталька»',
        message: buildBookingText(b),
      }),
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && data.success === true;
  } catch {
    return false;
  }
}
