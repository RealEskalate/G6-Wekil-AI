package usecases

import (
	"context"
	"errors"
	"fmt"
	converter "wekil_ai/Delivery/Converter"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserUseCase struct {
	userCollection    domain.IUserRepository
	userOTPCollection domainInterface.IOTPRepository
	auth              domainInterface.IAuthentication
}

// StoreUserInMainColl implements domain.IUserUseCase.
func (u *UserUseCase) StoreUserInMainColl(user *domain.UnverifiedUserDTO) (*domain.Individual, error) {
	ind := converter.ToIndividual(user)
	ind.ID = primitive.NilObjectID // making it intentionaly not to store the id of OTP DB in the main
	return u.userCollection.CreateUser(context.Background(), ind)

}

// StoreUserInOTPColl implements domain.IUserUseCase.
func (u *UserUseCase) StoreUserInOTPColl(user *domain.UnverifiedUserDTO) (*domain.UnverifiedUserDTO, error) {
	return u.userOTPCollection.StoreOTP(context.Background(), user)
}

// ValidOTPRequest implements domain.IUserUseCase.
func (u *UserUseCase) ValidOTPRequest(emailOtp *domain.EmailOTP) (*domain.UnverifiedUserDTO, error) {
	user, err := u.userOTPCollection.GetByEmail(context.Background(), emailOtp.Email)
	if err != nil {
		return nil, err
	}
	if user.OTP != emailOtp.OTP {
		return nil, fmt.Errorf("incorrect OTP")
	}
	// if the otp is a match it should be deleted from the otp db
	u.userOTPCollection.DeleteByID(context.Background(), user.ID.Hex()) // it shouldn't return an error because of this
	return user, err
}

// ReSendAccessToken implements domain.IUserUseCase.
func (u *UserUseCase) ReSendAccessToken(jwtToken string) (string, error) {
	userClaim, err := u.auth.ParseTokenToClaim(jwtToken)
	if err != nil {
		return "", err
	}
	// if the tokentype isn't refreshToken then it is invalid token type
	if userClaim.TokenType != domainInterface.RefreshToken {
		return "", fmt.Errorf("invalid token type")
	}
	//? Even thoug the current User claim has the tokenType == refreshToken inside genereateToken it will be changed
	accessTokenString, err := u.auth.GenerateToken(userClaim, domainInterface.AccessToken)
	if err != nil {
		return "", err
	}
	return accessTokenString, nil
}



func (u *UserUseCase) SendResetOTP(ctx context.Context, email string) error {
	user, err := u.userCollection.FindByEmail(ctx, email)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	otp := infrastracture.GenerateOTP()
	if err := u.userCollection.UpdateResetOTP(ctx, email, otp); err != nil {
		return err
	}

	return infrastracture.SendOTP(email, otp)
}

func (u *UserUseCase) ResetPassword(ctx context.Context, email, otp, newPassword string) error {
	err := u.userCollection.VerifyResetOTP(ctx, email, otp)
	if err != nil {
		return err
	}

	hashedPassword, err := infrastracture.HashPassword(newPassword)
	if err != nil {
		return err
	}

	return u.userCollection.UpdatePasswordByEmail(ctx, email, hashedPassword)
}




func NewUserUseCase(AUTH domainInterface.IAuthentication) domainInterface.IUserUseCase { //! Don't forget to pass the interfaces of other collections defined on the top
	return &UserUseCase{
		auth: AUTH,
	}
}
