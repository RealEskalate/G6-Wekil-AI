package domain

import (
	"context"
	"net/http"
	domain "wekil_ai/Domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// IIndividualRepository now uses context.Context and works with the domain model.
type IIndividualRepository interface {
	CreateIndividual(ctx context.Context,individual *domain.Individual) (*domain.Individual, error)
	FindByEmail(ctx context.Context,email string) (*domain.Individual, error)
	FindByID(ctx context.Context,individualID primitive.ObjectID) (*domain.Individual, error)
	UpdateIndividual(ctx context.Context,individualID primitive.ObjectID, updates map[string]interface{}) (error) // for the time being
	UpdateResetOTP(ctx context.Context, email, otp string) error
    VerifyResetOTP(ctx context.Context, email, otp string) error
	UpdatePasswordByEmail(ctx context.Context, email, newHashedPassword string) error
	DeleteIndividual(ctx context.Context, individualID primitive.ObjectID) error
	DeleteRefreshToken(ctx context.Context, userID string) error
	UpdateProfile(ctx context.Context, id primitive.ObjectID, updateData map[string]interface{}) error
}
type IOAuthUsecase interface {
	HandleOAuthLogin(req *http.Request, res http.ResponseWriter) (*domain.Individual, error)
}
 

// we should use GetByID instead of GetByEmail for performance
type IOTPRepository interface {
	CreateUnverifiedUser(ctx context.Context, unverifiedUser *domain.UnverifiedUserDTO) (error)
	GetByEmail(ctx context.Context, email string) (*domain.UnverifiedUserDTO, error)
	DeleteByID(ctx context.Context, userID string) error
}

type IUserValidation interface {
	IsValidEmail(email string) bool
	IsStrongPassword(password string) bool
	Hashpassword(password string) string
	ComparePassword(userPassword, password string) error
}

