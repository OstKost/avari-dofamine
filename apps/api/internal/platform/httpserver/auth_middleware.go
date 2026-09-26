package httpserver

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string

const (
	userIDContextKey  contextKey = "user_id"
	isGuestContextKey contextKey = "is_guest"
)

const (
	AccessTokenCookie  = "access_token"
	RefreshTokenCookie = "refresh_token"
	GuestIDCookie      = "guest_id"
	GuestIDHeader      = "X-Guest-ID"
)

// ContextWithUserID помещает user_id в контекст запроса.
func ContextWithUserID(ctx context.Context, userID uuid.UUID) context.Context {
	return context.WithValue(ctx, userIDContextKey, userID)
}

// ContextWithIsGuest помещает флаг гостя в контекст запроса.
func ContextWithIsGuest(ctx context.Context, isGuest bool) context.Context {
	return context.WithValue(ctx, isGuestContextKey, isGuest)
}

// UserIDFromContext извлекает user_id из контекста запроса.
func UserIDFromContext(ctx context.Context) (uuid.UUID, bool) {
	val := ctx.Value(userIDContextKey)
	if val == nil {
		return uuid.Nil, false
	}
	id, ok := val.(uuid.UUID)
	return id, ok
}

// IsGuestFromContext проверяет, является ли пользователь анонимным гостем.
func IsGuestFromContext(ctx context.Context) bool {
	val := ctx.Value(isGuestContextKey)
	if val == nil {
		return false
	}
	isGuest, ok := val.(bool)
	return ok && isGuest
}

// OptionalAuth извлекает авторизованного пользователя или создаёт/поддерживает гостевую сессию (Guest ID).
func OptionalAuth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := ""

			if cookie, err := r.Cookie(AccessTokenCookie); err == nil && cookie.Value != "" {
				tokenString = cookie.Value
			}
			if tokenString == "" {
				authHeader := r.Header.Get("Authorization")
				if strings.HasPrefix(authHeader, "Bearer ") {
					tokenString = strings.TrimPrefix(authHeader, "Bearer ")
				}
			}

			if tokenString != "" {
				token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
					if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
						return nil, errors.New("unexpected signing method")
					}
					return []byte(jwtSecret), nil
				})

				if err == nil && token.Valid {
					if claims, ok := token.Claims.(jwt.MapClaims); ok {
						if sub, ok := claims["sub"].(string); ok {
							if userID, err := uuid.Parse(sub); err == nil {
								ctx := ContextWithUserID(r.Context(), userID)
								ctx = ContextWithIsGuest(ctx, false)
								next.ServeHTTP(w, r.WithContext(ctx))
								return
							}
						}
					}
				}
			}

			// Не авторизован — используем или создаём Guest ID
			var guestID uuid.UUID
			guestStr := ""

			if cookie, err := r.Cookie(GuestIDCookie); err == nil && cookie.Value != "" {
				guestStr = cookie.Value
			}
			if guestStr == "" {
				guestStr = r.Header.Get(GuestIDHeader)
			}

			if parsed, err := uuid.Parse(guestStr); err == nil && parsed != uuid.Nil {
				guestID = parsed
			} else {
				guestID = uuid.New()
				http.SetCookie(w, &http.Cookie{
					Name:     GuestIDCookie,
					Value:    guestID.String(),
					Path:     "/",
					MaxAge:   30 * 24 * 3600, // 30 дней
					HttpOnly: false,          // Доступно JS для синхронизации с localStorage
					SameSite: http.SameSiteLaxMode,
				})
			}

			ctx := ContextWithUserID(r.Context(), guestID)
			ctx = ContextWithIsGuest(ctx, true)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// RequireAuth проверяет access JWT-токен из cookie или Authorization: Bearer заголовока.
func RequireAuth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := ""

			// 1. Сначала проверяем cookie (ADR-007: httpOnly cookies для веб-клиента)
			if cookie, err := r.Cookie(AccessTokenCookie); err == nil && cookie.Value != "" {
				tokenString = cookie.Value
			}

			// 2. Fallback на заголовок Authorization: Bearer (для API/Postman/мобильных клиентов)
			if tokenString == "" {
				authHeader := r.Header.Get("Authorization")
				if strings.HasPrefix(authHeader, "Bearer ") {
					tokenString = strings.TrimPrefix(authHeader, "Bearer ")
				}
			}

			if tokenString == "" {
				http.Error(w, `{"error":"unauthorized","message":"missing access token"}`, http.StatusUnauthorized)
				return
			}

			token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
				if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("unexpected signing method")
				}
				return []byte(jwtSecret), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, `{"error":"unauthorized","message":"invalid or expired access token"}`, http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, `{"error":"unauthorized","message":"invalid token claims"}`, http.StatusUnauthorized)
				return
			}

			sub, ok := claims["sub"].(string)
			if !ok {
				http.Error(w, `{"error":"unauthorized","message":"missing subject in token"}`, http.StatusUnauthorized)
				return
			}

			userID, err := uuid.Parse(sub)
			if err != nil {
				http.Error(w, `{"error":"unauthorized","message":"invalid user id in token"}`, http.StatusUnauthorized)
				return
			}

			ctx := ContextWithUserID(r.Context(), userID)
			ctx = ContextWithIsGuest(ctx, false)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

