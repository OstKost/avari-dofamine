package port

import (
	"context"

	"github.com/google/uuid"
	"github.com/ostkost/dofamine/api/internal/modules/identity/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByEmail(ctx context.Context, email domain.Email) (*domain.User, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
}
