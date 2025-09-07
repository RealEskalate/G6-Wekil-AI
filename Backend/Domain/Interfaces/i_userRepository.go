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
	// FindUser(ctx context.Context,userID string) (*domain.Individual, error)
	UpdateIndividual(ctx context.Context,individualID primitive.ObjectID, updates map[string]interface{}) (error) // for the time being
	UpdateResetOTP(ctx context.Context, email, otp string) error
    VerifyResetOTP(ctx context.Context, email, otp string) error
	UpdatePasswordByEmail(ctx context.Context, email, newHashedPassword string) error
	DeleteIndividual(ctx context.Context, individualID primitive.ObjectID) error
	DeleteRefreshToken(ctx context.Context, userID string) error
	UpdateProfile(ctx context.Context, email string, updateData map[string]interface{}) error
	FindAll(ctx context.Context, page, limit int64, sort string) ([]domain.Individual, int64, error)
	
}
type IOAuthUsecase interface {
	HandleOAuthLogin(req *http.Request, res http.ResponseWriter) (*domain.Individual,string,string, error)
}


// we should use GetByID instead of GetByEmail for performance
type IOTPRepository interface {
	CreateUnverifiedUser(ctx context.Context, unverifiedUser *domain.UnverifiedUserDTO) (error)
	GetByEmail(ctx context.Context, email string) (*domain.UnverifiedUserDTO, error)
	DeleteByID(ctx context.Context, userID string) error
	UpdateUnverifiedUser(ctx context.Context, user *domain.UnverifiedUserDTO) error
}

type IUserValidation interface {
	IsValidEmail(email string) bool
	IsStrongPassword(password string) bool
	Hashpassword(password string) string
	ComparePassword(userPassword, password string) error
}
type INotification_ interface {
	CreateNotification_(ctx context.Context, notification *domain.Notification_) (*domain.Notification_, error)
	FindByReceiverID_(ctx context.Context, individualID string, page, limit int64) ([]*domain.Notification_, error)
	CountByReceiverID_(ctx context.Context, receiverID string) (int64, error)
	FindUserByEmail_(ctx context.Context, email string) ([]*domain.Notification_, error)
}

type IOTPService interface{
	GenerateOTP() string
	 SendOTP(toEmail, otp string) error
}