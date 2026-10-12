/** @type {import('next').NextConfig} */
const nextConfig = {
  // Сборка в чистую статику (папка out/) — сайту не нужен сервер Node.js.
  output: 'export',
  // В статическом режиме нет сервера оптимизации картинок.
  images: { unoptimized: true },
};

export default nextConfig;
