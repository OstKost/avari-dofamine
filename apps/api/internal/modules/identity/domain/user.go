package domain

import (
	"time"

	"github.com/google/uuid"
)

// User — доменный агрегат пользователя.
type User struct {
	id           uuid.UUID
	email        Email
	passwordHash string
	nickname     string
	createdAt    time.Time
}

// NewUser создаёт новую сущность пользователя.
func NewUser(id uuid.UUID, email Email, passwordHash, nickname string, createdAt time.Time) (*User, error) {
	if id == uuid.Nil {
		id = uuid.New()
	}
	if email.IsZero() {
		return nil, ErrInvalidEmail
	}
	if passwordHash == "" {
		return nil, ErrWeakPassword
	}
	if createdAt.IsZero() {
		createdAt = time.Now().UTC()
	}
	if nickname == "" {
		nickname = email.LocalPart()
	}

	return &User{
		id:           id,
		email:        email,
		passwordHash: passwordHash,
		nickname:     nickname,
		createdAt:    createdAt,
	}, nil
}

func (u *User) ID() uuid.UUID {
	return u.id
}

func (u *User) Email() Email {
	return u.email
}

func (u *User) PasswordHash() string {
	return u.passwordHash
}

func (u *User) Nickname() string {
	return u.nickname
}

func (u *User) DisplayName() string {
	if u.nickname != "" {
		return u.nickname
	}
	return u.email.LocalPart()
}

func (u *User) CreatedAt() time.Time {
	return u.createdAt
}

