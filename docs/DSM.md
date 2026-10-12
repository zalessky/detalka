# Тестовый стенд на NAS (Synology DSM)

«Деталька» живёт в том же проекте Container Manager `rolf`, что и rolf64.ru (`/volume1/docker/web/compose.yaml`),
и обновляется той же ночной задачей «Обновление сайтов» (`pull` + `up -d`). Пока сайт смотрим только из локальной сети.

## 1. Собрать образ (один раз на каждую версию)

GitHub → репозиторий `zalessky/detalka` → **Releases → Draft a new release** → тег `v0.1` (новый), Target — `main` → Publish.
Workflow `Docker image` соберёт `ghcr.io/zalessky/detalka` с тегами `latest` и `0.1` (вкладка Actions, ~5 минут).

## 2. Доступ NAS к образу

Репозиторий приватный, поэтому пакет после первой сборки тоже приватный. Два варианта:

- **как у rolf64 (проще):** GitHub → профиль → Packages → `detalka` → Package settings → Change visibility → **Public**.
  Публичным станет только собранный образ (готовая статика сайта), исходники останутся закрытыми;
- **оставить приватным:** на NAS один раз под root выполнить `docker login ghcr.io -u zalessky`
  и ввести токен GitHub с единственным правом `read:packages`.

## 3. Добавить сервис в compose.yaml

В `/volume1/docker/web/compose.yaml` (первая строка файла должна быть `name: rolf`) в раздел `services:` добавить:

```yaml
  detalka:
    image: ghcr.io/zalessky/detalka:latest
    restart: unless-stopped
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    ports:
      - "8081:8080"   # временно: просмотр только из локальной сети, на роутере НЕ пробрасывать
    networks: [web]
```

Применить: Container Manager → проект `rolf` → Остановить → Собрать → Запустить
(или Планировщик задач → «Обновление сайтов» → Выполнить).

Открыть: **http://192.168.1.56:8081**

## 4. Обновления

Новая версия = новый Release с тегом `vX.Y` на `main`. Ночью задача сама подтянет `latest`;
чтобы увидеть сразу — «Выполнить» у задачи «Обновление сайтов».

## 5. Выход в интернет (позже)

1. A-записи `detalka.info` и `www` → `188.235.151.20`.
2. NPM (`http://192.168.1.56:81`) → новый Proxy Host: `detalka.info`, `www.detalka.info` → `http`, адрес `detalka`, порт `8080`;
   Block Common Exploits, SSL Let's Encrypt, Force SSL, HTTP/2, HSTS.
3. У сервиса `detalka` удалить строку `ports` и применить compose.yaml.
