# Тестовый стенд на NAS (Synology DSM)

«Деталька» — **отдельный** проект Container Manager `detalka` со своей папкой, своим `compose.yaml`
и своей задачей обновления. С проектом `rolf` (rolf64.ru) не связан: его файлы и задачу не трогаем.
Пока сайт смотрим только из локальной сети.

| | rolf64 | Деталька |
| --- | --- | --- |
| Проект Container Manager | `rolf` | `detalka` |
| Папка | `/volume1/docker/web` | `/volume1/docker/detalka` |
| Образ | `ghcr.io/zalessky/sterx` | `ghcr.io/zalessky/detalka` |
| Задача в Планировщике | «Обновление сайтов» | «Обновление Детальки» |

## 1. Собрать образ

GitHub → `zalessky/detalka` → **Releases → Draft a new release** → новый тег `v0.1`, Target — `main` → Publish.
Workflow `Docker image` соберёт `ghcr.io/zalessky/detalka` с тегами `latest` и `0.1` (вкладка Actions, несколько минут).

После первой сборки проверить, что пакет публичный (NAS скачивает без логина):
профиль GitHub → Packages → `detalka` → Package settings → Change visibility → **Public**.

## 2. Папка и compose.yaml

1. File Station: создать папку `/volume1/docker/detalka`.
2. Положить в неё `compose.yaml`:

```yaml
name: detalka
services:
  site:
    image: ghcr.io/zalessky/detalka:latest
    restart: unless-stopped
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    ports:
      - "8081:8080"   # просмотр только из локальной сети; на роутере НЕ пробрасывать
```

3. Container Manager → Проект → Создать: имя `detalka`, путь `/volume1/docker/detalka`, «Использовать существующий compose.yaml» → Готово.

Открыть: **http://192.168.1.56:8081**

## 3. Автообновление — отдельная задача

Скрипт лежит в репозитории: [`deploy/nas-update.sh`](../deploy/nas-update.sh) (только латиница — DSM капризничает с длинными
сценариями и кириллицей в поле задачи). Скопировать его в `/volume1/docker/detalka/update.sh`.

Панель управления → Планировщик задач → Создать → Запланированная задача → Пользовательский сценарий:
имя «Обновление Детальки», пользователь `root`, ежедневно ночью (можно на 10 минут позже задачи rolf), сценарий — одна строка:

```bash
sh /volume1/docker/detalka/update.sh
```

> Если после ввода пароля DSM пишет «Сбой подключения. Проверьте сетевые настройки» — откройте DSM напрямую
> по `http://192.168.1.56:5000` (из локальной сети или с компьютера в ней через RMS), а не через удалённый адрес/прокси,
> и создайте задачу ещё раз. Окно подтверждения пароля обращается к DSM по другому адресу, и через прокси запрос не проходит.

Содержимое скрипта (для справки):

```bash
cd /volume1/docker/detalka || exit 1
export PATH="$PATH:/usr/local/bin"
P=detalka   # имя проекта в Container Manager
if docker compose version >/dev/null 2>&1; then DC="docker compose -p $P"; else DC="docker-compose -p $P"; fi
{
  echo "=== $(date '+%F %T')"
  # защита: не создавать второй комплект контейнеров, если имя проекта не совпало
  if [ -z "$($DC ps -a -q)" ]; then
    echo "Проект $P не найден — проверьте P= в скрипте. Ничего не сделано."
    exit 1
  fi
  $DC pull && $DC up -d --remove-orphans
} >> update.log 2>&1
```

Лог — `/volume1/docker/detalka/update.log`. Новая версия = новый Release `vX.Y`; чтобы увидеть сразу, а не ночью, — «Выполнить» у задачи.

`docker image prune` здесь не вызываем: его уже делает задача rolf, а двум задачам незачем чистить образы друг за друга.

## 4. Выход в интернет (позже)

Наружу сайты выходят через Nginx Proxy Manager, который живёт в проекте `rolf`. Проекты остаются раздельными,
NPM просто проксирует на опубликованный порт «Детальки»:

1. A-записи `detalka.info` и `www` → `188.235.151.20`.
2. NPM (`http://192.168.1.56:81`) → новый Proxy Host: `detalka.info`, `www.detalka.info` → `http`, `192.168.1.56`, порт `8081`;
   Block Common Exploits, SSL Let's Encrypt, Force SSL, HTTP/2, HSTS.
3. Порт `8081` на роутере по-прежнему не пробрасывать — снаружи сайт доступен только через NPM (80/443).
