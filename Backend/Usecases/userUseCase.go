package usecases

import (
	"context"
	"errors"
	"fmt"
	
	converter "wekil_ai/Delivery/Converter"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserUseCase struct {
	userCollection    domainInterface.IIndividualRepository
	unverifiedUserCollection domainInterface.IOTPRepository
	auth              domainInterface.IAuthentication
	userValidation	  domainInterface.IUserValidation
	NotificationCollection domainInterface.INotification

}

// StoreUserInMainColl implements domain.IUserUseCase.
func (u *UserUseCase) StoreUserInMainColl(user *domain.UnverifiedUserDTO) (*domain.Individual, error) {
	ind := converter.ToIndividual(user)
	ind.ID = primitive.NilObjectID // making it intentionaly not to store the id of OTP DB in the main
	return u.userCollection.CreateIndividual(context.Background(), ind)

}

// StoreUserInOTPColl implements domain.IUserUseCase.
func (u *UserUseCase) StoreUserInOTPColl(user *domain.UnverifiedUserDTO) ( error) {
	_, errUnverified := u.unverifiedUserCollection.GetByEmail(context.Background(), user.Email)
	_,errVerified := u.userCollection.FindByEmail(context.Background(),user.Email)
	
	if errVerified == nil {
   
    return fmt.Errorf("user with email %s is already registered", user.Email)
	}

	if errUnverified != nil && errUnverified.Error() == "user does not exist" {
		
		return u.unverifiedUserCollection.CreateUnverifiedUser(context.Background(), user)
	}

	
	return fmt.Errorf("user with email %s is already in registration process please verify your email", user.Email)
}

// ValidOTPRequest implements domain.IUserUseCase.
func (u *UserUseCase) ValidOTPRequest(emailOtp *domain.EmailOTP) (*domain.UnverifiedUserDTO, error) {
	user, err := u.unverifiedUserCollection.GetByEmail(context.Background(), emailOtp.Email)

	if err != nil {
		return nil, err
	}

	if user.OTP != emailOtp.OTP {
		return nil, fmt.Errorf("incorrect OTP")
	}
	// if the otp is a match it should be deleted from the otp db
	u.unverifiedUserCollection.DeleteByID(context.Background(), user.ID.Hex()) // it shouldn't return an error because of this
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




func (a *UserUseCase) Login(email, password string) (string,string, error) {
	user, err := a.userCollection.FindByEmail(context.Background(),email)
	if err != nil {
		return "", "", errors.New("user not found")
	}

	err = a.userValidation.ComparePassword(user.PasswordHash, password)
	if err != nil {
		return "", "", errors.New("invalid password")
	}
	accessClaims := &domain.UserClaims{
		UserID: user.ID.String(),
		Email: user.Email,
		IsVerified: true,
		AccountType:user.AccountType,
		TokenType: domainInterface.AccessToken,

	}
	accessToken, err := a.auth.GenerateToken(accessClaims, domainInterface.AccessToken)
    if err != nil {
        panic(err)
    }
	refreshClaims := &domain.UserClaims{
		UserID: user.ID.String(),
		Email: user.Email,
		IsVerified: true,
		AccountType:user.AccountType,
		TokenType: domainInterface.AccessToken,

	}
    // Generate Refresh Token
    refreshToken, err := a.auth.GenerateToken(refreshClaims, domainInterface.RefreshToken)
    if err != nil {
        panic(err)
    }
	updateUser := bson.M{
    "refresh_token": refreshToken,
	}
	user.RefreshToken = refreshToken
	err = a.userCollection.UpdateIndividual(context.Background(),user.ID,updateUser)
	if err != nil {
		return "", "", err
	}
	
	return accessToken,refreshToken, nil
}

func (uuc *UserUseCase) Logout(ctx context.Context, userID string) error {
    return uuc.userCollection.DeleteRefreshToken(ctx, userID)
}

func (u *UserUseCase) GetProfile(ctx context.Context, email string) (*domain.Individual, error) {
	
	user, err := u.userCollection.FindByEmail(ctx, email)
	if err != nil {
		return nil, errors.New("user not found")
	}

	return user, nil
}


func (u *UserUseCase) UpdateProfile(ctx context.Context, email string, updateReq *domain.UpdateProfileRequestDTO) error {
	

	updateData := bson.M{}

	if updateReq.FirstName != nil {
		updateData["first_name"] = *updateReq.FirstName
	}
	if updateReq.LastName != nil {
		updateData["last_name"] = *updateReq.LastName
	}
	if updateReq.MiddleName != nil {
		updateData["middle_name"] = *updateReq.MiddleName
	}
	if updateReq.Address != nil {
		updateData["address"] = *updateReq.Address
	}
	if updateReq.Telephone != "" {
		updateData["telephone"] = updateReq.Telephone
	}
	if updateReq.Signature != nil {
		updateData["signature"] = *updateReq.Signature
	}
	if updateReq.ProfileImage != nil {
		updateData["profile_image"] = *updateReq.ProfileImage
	}
	return u.userCollection.UpdateProfile(ctx, email, updateData)
}

func (u *UserUseCase) GetNotification(userID string)( *domain.Notification,error){
	
	fmt.Print("!#$%$$$$$$$$$$$$$$$$$$$", userID)
	notify, err := u.NotificationCollection.FindByID(context.Background(),userID)
	if err != nil {
		return nil , err
	}
	return notify, nil
}
func NewUserUseCase(AUTH domainInterface.IAuthentication, UserColl domainInterface.IIndividualRepository,userValid domainInterface.IUserValidation, unverifiedUserColl domainInterface.IOTPRepository, notify domainInterface.INotification) domainInterface.IUserUseCase { //! Don't forget to pass the interfaces of other collections defined on the top
	return &UserUseCase{
		auth: AUTH,
		userCollection: UserColl,
		userValidation: userValid,
		unverifiedUserCollection: unverifiedUserColl,
		NotificationCollection: notify,
	}
}
