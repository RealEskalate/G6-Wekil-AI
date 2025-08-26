package domain

import (
	"context"
	domain "wekil_ai/Domain"
)

type IUserUseCase interface {
	ReSendAccessToken(jwtToken string) (string, error) // (accessTokenString, error)
	ValidOTPRequest(emailOtp *domain.EmailOTP) (*domain.UnverifiedUserDTO, error)
	StoreUserInOTPColl(user *domain.UnverifiedUserDTO) (error)
	StoreUserInMainColl(user *domain.UnverifiedUserDTO) (*domain.Individual, error)
	Login(email, password string) (string,string, error)
	SendResetOTP(ctx context.Context, email string) error
	ResetPassword(ctx context.Context, email, otp, newPassword string) error
}
