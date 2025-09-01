package domain

import (
	"time"

	"github.com/golang-jwt/jwt/v5"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	User       = "user"
	AdminRole  = "admin"
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
	RefreshToken	   string			  `json:"refresh_token" bson:"refresh_token"`
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
type LoginDTO struct{
	Email string `json:"email" bson:"email"`
	Password string `json:"password" bson:"password"`
}

type ForgotPasswordRequestDTO struct {
	Email string `json:"email" binding:"required,email"`
}


type ResetPasswordRequestDTO struct {
	Email       string `json:"email" binding:"required,email"`
	OTP         string `json:"otp" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6,max=50"`
}

type UpdateProfileRequestDTO struct {
	FirstName    *string `json:"first_name,omitempty" binding:"omitempty,min=1,max=50"`
	LastName     *string `json:"last_name,omitempty" binding:"omitempty,min=1,max=50"`
	MiddleName   *string `json:"middle_name,omitempty" binding:"omitempty,min=1,max=50"`
	Address      *string `json:"address,omitempty" binding:"omitempty,min=1,max=100"`
	Telephone    *string             `json:"telephone,omitempty" bson:"telephone,omitempty"`
	Signature    *string `json:"signature,omitempty" binding:"omitempty"`
	ProfileImage *string `json:"profile_image,omitempty" binding:"omitempty,url"`
}