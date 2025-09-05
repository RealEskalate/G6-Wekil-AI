package domain

import (
	"context"
	domain "wekil_ai/Domain"
)

type IUserUseCase interface {
	ReSendAccessToken(jwtToken string) (string, string, error) // (accessTokenString, error)
	ValidOTPRequest(emailOtp *domain.EmailOTP) (*domain.UnverifiedUserDTO, error)
	StoreUserInOTPColl(ctx context.Context, user *domain.UnverifiedUserDTO) error
	StoreUserInMainColl(user *domain.UnverifiedUserDTO) (*domain.Individual, error)
	Login(email, password string) (string, string, string, error)
	SendResetOTP(ctx context.Context, email string) error
	Logout(ctx context.Context, user string) error
	ResetPassword(ctx context.Context, email, otp, newPassword string) error
	GetProfile(ctx context.Context, userID string) (*domain.Individual, error)
	UpdateProfile(ctx context.Context, userID string, updateReq *domain.UpdateProfileRequestDTO) error
	GetNotifications(userID string, page, limit int64) ([]domain.Notification, error)
	ChangePassword(ctx context.Context, email, oldPassword, newPassword string) error
	ResendOTP(ctx context.Context, email string) error
	GetAllUsers(ctx context.Context, page, limit int64, sort string) ([]domain.Individual, int64, error)
	GoogleNextJS(ctx context.Context, profile domain.GoogleProfile) (*domain.Individual, string, string, error) 
}
