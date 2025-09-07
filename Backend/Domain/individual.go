package domain

import (
	"time"

	"github.com/golang-jwt/jwt/v5"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	User      = "user"
	AdminRole = "admin"
)

// Individual represents a person's complete data model in the database.
type Individual struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email        string             `json:"email" bson:"email"`
	PasswordHash string             `json:"-" bson:"password"` // Hidden from JSON
	FirstName    string             `json:"first_name" bson:"first_name"`
	LastName     string             `json:"last_name" bson:"last_name"`
	MiddleName   string             `json:"middle_name,omitempty" bson:"middle_name,omitempty"`
	Telephone    string             `json:"telephone,omitempty" bson:"telephone,omitempty"`
	Address      string             `json:"address,omitempty" bson:"address,omitempty"`
	AccountType  string             `json:"account_type" bson:"account_type"`
	IsVerified   bool               `json:"is_verified" bson:"is_verified"`
	ProfileImage string             `json:"profile_image" bson:"profile_image"`
	Signature    string             `json:"signature" bson:"signature"`
	CreatedAt    time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt    time.Time          `json:"updated_at" bson:"updated_at"`
	RefreshToken string             `json:"refresh_token" bson:"refresh_token"`
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
	UserName    string `json:"user_name"`
	Email       string `json:"email"`
	IsVerified  bool   `json:"is_verified"`
	AccountType string `json:"account_type"`
	TokenType   string `json:"token_type"` // The requested field to identify the token's type
	jwt.RegisteredClaims
}
type UnverifiedUserDTO struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email       string             `json:"email" bson:"email"`
	Password    string             `json:"password" bson:"password"` // Hidden from JSON
	FirstName   string             `json:"first_name" bson:"first_name"`
	LastName    string             `json:"last_name" bson:"last_name"`
	MiddleName  string             `json:"middle_name,omitempty" bson:"middle_name,omitempty"`
	Telephone   string             `json:"telephone,omitempty" bson:"telephone,omitempty"`
	AccountType string             `json:"account_type" bson:"account_type"`
	OTP         string             `json:"otp,omitempty" bson:"otp,omitempty"`
	ExpiresAt   time.Time          `json:"expires_at" bson:"expires_at"`
}
type EmailOTP struct {
	Email string `json:"email" bson:"email"`
	OTP   string `json:"otp" bson:"otp"`
}
type LoginDTO struct {
	Email    string `json:"email" bson:"email"`
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
	Telephone    *string `json:"telephone,omitempty" bson:"telephone,omitempty"`
	Signature    *string `json:"signature,omitempty" binding:"omitempty"`
	ProfileImage *string `json:"profile_image,omitempty" binding:"omitempty,url"`
}

// Notification represents a notification document sent to users.

type ChangePasswordRequestDTO struct {
	OldPassword string `json:"old_password" bson:"old_password" binding:"required,min=6,max=50"`
	NewPassword string `json:"new_password" bson:"new_password" binding:"required,min=6,max=50"`
}
type ResendOTPRequestDTO struct {
	Email string `json:"email" binding:"required,email"`
}

type GoogleProfile struct {
	Sub           string `json:"sub"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Picture       string `json:"picture"`
}

// ? well today is saturday and smn is not responding so:
type Notification_ struct {
	ID         primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Recipient  User_              `json:"recipient" bson:"recipient"`
	Sender     User_              `json:"sender" bson:"sender"`
	Type       string             `json:"type" bson:"type"`
	Content    Content_           `json:"content" bson:"content"`
	IsRead     bool               `json:"is_read" bson:"is_read"`
	IsArchived bool               `json:"is_archived" bson:"is_archived"`
	CreatedAt  time.Time          `json:"created_at" bson:"created_at"`
	ReadAt     time.Time          `json:"read_at" bson:"read_at,omitempty"`
	TargetURL  string             `json:"target_url" bson:"target_url"`
}

type User_ struct {
	UserID   primitive.ObjectID `json:"user_id,omitempty" bson:"user_id,omitempty"`
	UserName string             `json:"user_name,omitempty" bson:"user_name,omitempty"`
	Email    string             `json:"email" bson:"email"`
}
type Content_ struct {
	Title string `json:"title" bson:"title"`
	Body  string `json:"body" bson:"body"`
}
