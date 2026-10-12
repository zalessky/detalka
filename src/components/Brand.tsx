// Логотип «Деталька» с подписью «ТЕХЦЕНТР»: подпись по центру под логотипом, ровно в половину его ширины.
// Подпись — SVG с заданной длиной текста, поэтому пропорция держится на любом размере.
export default function Brand({ className = '' }: { className?: string }) {
  return (
    <span className={`brand ${className}`}>
      <img src="/images/brand/logo-white.png" alt="Деталька" width={1600} height={294} />
      <svg viewBox="0 0 400 54" role="img" aria-label="Техцентр">
        {/* буквы не сжимаем — под ширину растягиваются только промежутки, как на визитке */}
        <text x="200" y="45" textLength="396" lengthAdjust="spacing" textAnchor="middle">ТЕХЦЕНТР</text>
      </svg>
    </span>
  );
}
