# Архитектура и руководство: Быстрая и Социальная авторизация (Google, Apple, Yandex)

В Dopamine Market реализована гибкая гибридная система авторизации, сочетающая:
1. **Zero-friction 1-Click Авторизацию (Google, Apple, Yandex)** — мгновенный вход в один клик без паролей и внешних зависимостей.
2. **Классическую регистрацию и вход** — Email + пароль с Argon2 хэшированием (ADR-007).
3. **Возможность бесшовного перехода на реальные внешние OAuth 2.0 провайдеры** в продакшене.

---

## 1. Как работает текущая быстрая авторизация (1-Click Social Auth)

### Принцип работы
В соответствии с духом синтетического маркетплейса (ADR-012) и требованием к мгновенному чекауту без трения:
- Пользователь в каталоге, корзине или модальном окне чекаута нажимает кнопку провайдера (**Google**, **Yandex** или **Apple**).
- Фронтенд (`quick-auth-modal.tsx`, `login/page.tsx`, `register/page.tsx`) обращается к эндпоинту `POST /auth/quick-login`.
- Бэкенд (`apps/api/internal/modules/identity`):
  - Находит существующего пользователя или автоматически регистрирует нового с безопасным сгенерированным хэшем пароля.
  - Генерирует JWT access-токен (15 мин) и opaque refresh-токен (30 дней) в Redis с поддержкой ротации и reuse detection (ADR-007).
  - Устанавливает безопасные `httpOnly`, `SameSite=Lax` куки.
- Фронтенд автоматически вызывает `POST /cart/merge`, привязывая гостевую корзину (`X-Guest-ID`) к авторизованному пользователю.
- Идентичность пользователя сохраняется в `localStorage` браузера (`dopamine_auth_google` и т.д.), гарантируя, что при повторном клике на "Google" пользователь всегда попадает в свой существующий профиль, сохраняя историю заказов, стрики геймификации и корзину.

---

## 2. Руководство по интеграции реального OAuth 2.0 (Production)

Если требуется переключить быстрый 1-Click вход на реальные OAuth 2.0 провайдеры (Google Cloud Console, Apple Developer, Яндекс OAuth), выполните следующие шаги.

### 2.1. Миграция базы данных (Таблица связки OAuth-аккаунтов)

Создайте миграцию в `apps/api/internal/platform/migrations/sql/identity_002_create_oauth_accounts.sql`:

```sql
-- +goose Up
CREATE TABLE IF NOT EXISTS identity.oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
    provider VARCHAR(32) NOT NULL, -- 'google', 'apple', 'yandex'
    provider_user_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_provider_user_id UNIQUE (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_accounts_user_id ON identity.oauth_accounts(user_id);

-- +goose Down
DROP TABLE IF EXISTS identity.oauth_accounts;
```

---

### 2.2. Настройка Google OAuth 2.0 (Google Identity Services)

1. **Регистрация в Google Cloud Console**:
   - Перейдите в [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
   - Создайте **OAuth 2.0 Client ID** (тип: *Web Application*).
   - Authorized JavaScript origins: `http://localhost:3000`, `https://your-domain.com`.
   - Authorized redirect URIs: `http://localhost:8080/auth/oauth/google/callback` или обработка ID Token через One Tap / Google Button SDK на клиенте.
2. **Переменные окружения (`.env`)**:
   ```env
   GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxx.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. **Валидация токена на Go бэкенде**:
   - Используйте официальную библиотеку `google.golang.org/api/idtoken`:
   ```go
   payload, err := idtoken.Validate(ctx, idTokenString, googleClientID)
   if err != nil {
       return nil, errors.New("invalid google id token")
   }
   email := payload.Claims["email"].(string)
   googleUserID := payload.Subject
   ```

---

### 2.3. Настройка Яндекс ID (Yandex OAuth)

1. **Регистрация в Яндекс OAuth**:
   - Перейдите в [Яндекс OAuth Кабинет](https://oauth.yandex.ru/).
   - Создайте новое приложение.
   - Права доступа: `login:email`, `login:info`, `login:avatar`.
   - Redirect URI: `http://localhost:3000/auth/callback/yandex` или `http://localhost:8080/auth/oauth/yandex/callback`.
2. **Переменные окружения (`.env`)**:
   ```env
   YANDEX_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   YANDEX_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. **Обмен кода на токен и профиль**:
   - URL обмена кода: `POST https://oauth.yandex.ru/token` (`grant_type=authorization_code`, `code`, `client_id`, `client_secret`).
   - Получение профиля: `GET https://login.yandex.ru/info?format=json` с заголовком `Authorization: OAuth <token>`.
   - Ответ содержит `default_email`, `real_name`, `id`.

---

### 2.4. Настройка Sign in with Apple

1. **Настройка в Apple Developer Portal**:
   - Создайте **App ID** и включите возможность **Sign in with Apple**.
   - Создайте **Services ID** (например, `com.dopamine.market.auth`) и привяжите домен и Return URL: `https://your-domain.com/auth/oauth/apple/callback`.
   - Сгенерируйте приватный ключ **Sign in with Apple Key** (`.p8`), запишите `Key ID` и `Team ID`.
2. **Переменные окружения (`.env`)**:
   ```env
   APPLE_CLIENT_ID=com.dopamine.market.auth
   APPLE_TEAM_ID=XXXXXXXXXX
   APPLE_KEY_ID=XXXXXXXXXX
   APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   ```
3. **Валидация Apple ID Token**:
   - Apple отправляет `id_token` (JWT), подписанный открытыми ключами Apple (JWKS: `https://appleid.apple.com/auth/keys`).
   - Проверяются claims: `iss == "https://appleid.apple.com"`, `aud == APPLE_CLIENT_ID`, `exp`.
   - Из claims извлекаются `sub` (уникальный Apple User ID) и `email` (включая приватные релеи `@privaterelay.appleid.com`).

---

## 3. Схема обработки и слияния сессий (Session Flow)

```
[Пользователь]
      │
      ├─► Клик "Google / Yandex / Apple"
      │
      ├─► [Фронтенд] POST /auth/quick-login (или OAuth Callback)
      │         │
      │         ▼
      │   [Backend Identity Module]
      │   1. Валидация / создание User в identity.users
      │   2. Создание сессии в Redis (Refresh Token Family)
      │   3. Выпуск JWT Access Token (15 мин)
      │   4. Установка httpOnly Cookies
      │         │
      │         ▼
      ├─► [Фронтенд] POST /cart/merge { guest_id: "..." }
      │         │
      │         ▼
      │   [Backend Cart Module]
      │   Слияние товаров из корзины гостя в корзину аккаунта
      │
      ▼
[Успешный вход + Редирект в чекаут / профиль]
```

## 4. API Контракт

| Метод | Эндпоинт | Описание |
|---|---|---|
| `POST` | `/auth/quick-login` | Быстрый вход / регистрация в 1 клик с передачей `email`, `nickname`, `provider` |
| `POST` | `/auth/register` | Регистрация с паролем (>= 8 символов) |
| `POST` | `/auth/login` | Вход по email и паролю |
| `POST` | `/auth/refresh` | Ротация refresh токена из `httpOnly` cookie |
| `POST` | `/auth/logout` | Отзыв сессии в Redis и очистка кук |
| `GET` | `/auth/me` | Получение профиля текущего авторизованного пользователя |
