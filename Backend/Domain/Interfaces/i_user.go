package domain

import (
	domain "backend/Domain"
	"context"
)

// we should use GetByID instead of GetByEmail for performance
type IOTPRepository interface {
	StoreOTP(ctx context.Context, otp *domain.UnverifiedUserDTO) (*domain.UnverifiedUserDTO, error)
	GetByEmail(ctx context.Context, email string) (*domain.UnverifiedUserDTO, error)
	DeleteByID(ctx context.Context, userID string) error
}
