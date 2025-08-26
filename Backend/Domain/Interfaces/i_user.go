package domain

import (
	"context"
	domain "wekil_ai/Domain"
)

// we should use GetByID instead of GetByEmail for performance
type IOTPRepository interface {
	StoreOTP(ctx context.Context, otp *domain.UnverifiedUserDTO) (*domain.UnverifiedUserDTO, error)
	GetByEmail(ctx context.Context, email string) (*domain.UnverifiedUserDTO, error)
	DeleteByID(ctx context.Context, userID string) error
}

type IuserRepository interface {
    UpdateResetOTP(ctx context.Context, email, otp string) error
    VerifyResetOTP(ctx context.Context, email, otp string) error
}
type IUserValidation interface {
	IsValidEmail(email string) bool
	IsStrongPassword(password string) bool
	Hashpassword(password string) string
	ComparePassword(userPassword, password string) error
}