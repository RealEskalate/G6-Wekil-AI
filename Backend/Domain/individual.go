package domain

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	OrganizationOwnerRole = "organizationOwner"
	IndividualRole        = "individual"
	AdminRole             = "admin"
)

// Individual represents a person's complete data model in the database.
type Individual struct {
	ID                 primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email              string             `json:"email" bson:"email"`
	PasswordHash       string             `json:"-" bson:"password"` // Hidden from JSON
	FirstName          string             `json:"first_name" bson:"first_name"`
	LastName           string             `json:"last_name" bson:"last_name"`
	MiddleName         string             `json:"middle_name,omitempty" bson:"middle_name,omitempty"`
	Telephone          string             `json:"telephone,omitempty" bson:"telephone,omitempty"`
	Address            string             `json:"address,omitempty" bson:"address,omitempty"`
	AccountType        string             `json:"account_type" bson:"account_type"`
	IsVerified         bool               `json:"is_verified" bson:"is_verified"`
	ProfileImage       string             `json:"profile_image,omitempty" bson:"profile_image,omitempty"`
	Signature          string             `json:"signature,omitempty" bson:"signature,omitempty"`
	CreatedAt          time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt          time.Time          `json:"updated_at" bson:"updated_at"`
	ResetOTP           string              `json:"reset_otp" bson:"reset_otp"` 
}

// IIndividualRepository now uses context.Context and works with the domain model.
type IUserRepository interface {
	CreateUser(ctx context.Context, individual *Individual) (*Individual, error)
	FindByEmail(ctx context.Context, email string) (*Individual, error)
	FindByID(ctx context.Context, individualID primitive.ObjectID) (*Individual, error)
	// UpdateIndividual(ctx context.Context, individualID primitive.ObjectID, updates map[string]interface{}) (*Individual, error) // for the time being
	UpdateResetOTP(ctx context.Context, email, otp string) error
	VerifyResetOTP(ctx context.Context, email, otp string) error
	UpdatePasswordByEmail(ctx context.Context, email, newHashedPassword string) error
	DeleteIndividual(ctx context.Context, individualID primitive.ObjectID) error
}

// UpdateIndividualDTO now uses pointers and has no BSON tags.
// the string being a pointer helps to use omitempty when editing a user's profile, meaning empty strings won't be saved as a name.
type UpdateIndividualDTO struct {
	FirstName    *string `json:"first_name,omitempty"`
	LastName     *string `json:"last_name,omitempty"`
	MiddleName   *string `json:"middle_name,omitempty"`
	Address      *string `json:"address,omitempty"`
	Signature    *string `json:"signature,omitempty"`
	ProfileImage *string `json:"profileImage,omitempty"`
}

type UserClaims struct {
	UserID      string `json:"id"`
	Email       string `json:"email"`
	IsVerified  bool   `json:"is_verified"`
	AccountType string `json:"account_type"`
	TokenType   string `json:"token_type"` // The requested field to identify the token's type
	jwt.RegisteredClaims
}
type UnverifiedUserDTO struct {
	ID                 primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email              string             `json:"email" bson:"email"`
	Password           string             `json:"password" bson:"password"` // Hidden from JSON
	FirstName          string             `json:"firstName" bson:"first_name"`
	LastName           string             `json:"lastName" bson:"last_name"`
	MiddleName         string             `json:"middleName,omitempty" bson:"middle_name,omitempty"`
	Telephone          string             `json:"telephone,omitempty" bson:"telephone,omitempty"`
	AccountType        string             `json:"accountType" bson:"account_type"`
	OTP                string             `json:"otp,omitempty" bson:"otp,omitempty"`
	ExpiresAt          time.Time          `json:"expiresAt" bson:"expires_at"`
}
type EmailOTP struct {
	Email string `json:"email" bson:"email"`
	OTP   string `json:"otp" bson:"otp"`
}

type ForgotPasswordRequestDTO struct {
	Email string `json:"email" binding:"required,email"`
}


type ResetPasswordRequestDTO struct {
	Email       string `json:"email" binding:"required,email"`
	OTP         string `json:"otp" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6,max=50"`
}