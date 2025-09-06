package usecases

import (
	"context"
	"errors"
	"fmt"
	"time"

	converter "wekil_ai/Delivery/Converter"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserUseCase struct {
	userCollection           domainInterface.IIndividualRepository
	unverifiedUserCollection domainInterface.IOTPRepository
	auth                     domainInterface.IAuthentication
	userValidation           domainInterface.IUserValidation
	NotificationCollection   domainInterface.INotification_
	OTPSevice                domainInterface.IOTPService
}

// StoreUserInMainColl implements domain.IUserUseCase.
func (u *UserUseCase) StoreUserInMainColl(user *domain.UnverifiedUserDTO) (*domain.Individual, error) {
	ind := converter.ToIndividual(user)
	ind.ID = primitive.NilObjectID // making it intentionaly not to store the id of OTP DB in the main
	return u.userCollection.CreateIndividual(context.Background(), ind)
}

// StoreUserInOTPColl implements domain.IUserUseCase.
func (u *UserUseCase) StoreUserInOTPColl(ctx context.Context,user *domain.UnverifiedUserDTO) error {
	// 1. Check if user is already verified
	_, errVerified := u.userCollection.FindByEmail(context.Background(), user.Email)
	if errVerified == nil {
		return fmt.Errorf("USER_EXISTS: user with email %s is already registered", user.Email)
	}

	// 2. Check if user is already unverified
	existing, errUnverified := u.unverifiedUserCollection.GetByEmail(context.Background(), user.Email)
	if errUnverified == nil {
		// User is still in unverified collection
		if time.Now().After(existing.ExpiresAt) {
			// OTP expired → delete old one, allow new registration
			_ = u.unverifiedUserCollection.DeleteByID(context.Background(), existing.ID.Hex())
			return u.unverifiedUserCollection.CreateUnverifiedUser(context.Background(), user)
		}
		return fmt.Errorf("USER_UNVERIFIED: user with email %s is already in registration process, check your email for OTP", user.Email)
	}

	
	// Hash password
	user.Password = u.userValidation.Hashpassword(user.Password)

	// Generate OTP
	otp := u.OTPSevice.GenerateOTP()
	user.OTP = otp
	user.ExpiresAt = time.Now().Add(2 * time.Minute) // OTP valid 3 min
	user.AccountType = domain.User

	// Send OTP via email
	u.OTPSevice.SendOTP(user.Email, otp)

	// 3. If not found at all → new user
	return u.unverifiedUserCollection.CreateUnverifiedUser(context.Background(), user)
}

func (u *UserUseCase) ResendOTP(ctx context.Context, email string) error {
	// Check if user is already verified
	_, errVerified := u.userCollection.FindByEmail(ctx, email)
	if errVerified == nil {
		return fmt.Errorf("USER_EXISTS: user with email %s is already registered", email)
	}

	// Check if user is in unverified collection
	user, errUnverified := u.unverifiedUserCollection.GetByEmail(ctx, email)
	if errUnverified != nil {
		return fmt.Errorf("USER_NOT_FOUND: user with email %s is not in registration process", email)
	}

	// Check if OTP is expired
	if time.Now().After(user.ExpiresAt) {
		// OTP expired → generate a new one
		user.OTP = u.OTPSevice.GenerateOTP()
		user.ExpiresAt = time.Now().Add(2 * time.Minute) // Reset expiry time
		err := u.unverifiedUserCollection.UpdateUnverifiedUser(ctx, user)
		if err != nil {
			return fmt.Errorf("FAILED_TO_UPDATE_OTP: %v", err)
		}
	} else {
		return fmt.Errorf("OTP_STILL_VALID: please wait until the current OTP expires")
	}

	// Resend OTP
	return u.OTPSevice.SendOTP(email, user.OTP)
}


// ValidOTPRequest implements domain.IUserUseCase.
func (u *UserUseCase) ValidOTPRequest(emailOtp *domain.EmailOTP) (*domain.UnverifiedUserDTO, error) {
	user, err := u.unverifiedUserCollection.GetByEmail(context.Background(), emailOtp.Email)
	if err != nil {
		// No user found → probably expired (1 day cleanup)
		return nil, fmt.Errorf("REGISTRATION_EXPIRED: registration expired, please register again")
	}

	// 1. Check OTP expiry (2 min)
	if time.Now().After(user.ExpiresAt) {
		return nil, fmt.Errorf("OTP_EXPIRED: your OTP has expired, request a new one")
	}

	// 2. Check OTP match
	if user.OTP != emailOtp.OTP {
		return nil, fmt.Errorf("OTP_INVALID: the OTP you entered is incorrect")
	}

	// 3. OTP is valid → delete from unverified collection
	_ = u.unverifiedUserCollection.DeleteByID(context.Background(), user.ID.Hex())

	return user, nil
}


// ReSendAccessToken implements domain.IUserUseCase.
func (u *UserUseCase) ReSendAccessToken(jwtToken string) (string, string, error) {
	userClaim, err := u.auth.ParseTokenToClaim(jwtToken)
	if err != nil {
		return "", "", err
	}
	// if the tokentype isn't refreshToken then it is invalid token type
	if userClaim.TokenType != domainInterface.RefreshToken {
		return "", "", fmt.Errorf("invalid token type")
	}
	
	//? Even thoug the current User claim has the tokenType == refreshToken inside genereateToken it will be changed
	accessTokenString, err := u.auth.GenerateToken(userClaim, domainInterface.AccessToken)
	if err != nil {
		return "", "", err
	}
	return accessTokenString, userClaim.AccountType, nil
}

func (u *UserUseCase) SendResetOTP(ctx context.Context, email string) error {
	user, err := u.userCollection.FindByEmail(ctx, email)
	if err != nil || user == nil {
		return errors.New("user not found")
	}

	otp := u.OTPSevice.GenerateOTP()
	if err := u.userCollection.UpdateResetOTP(ctx, email, otp); err != nil {
		return err
	}

	return u.OTPSevice.SendOTP(email, otp)
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



func (a *UserUseCase) Login(email, password string) (string,string, string,error) {
	user, err := a.userCollection.FindByEmail(context.Background(),email)
	if err != nil {
		return "", "", "", errors.New("user not found")
	}

	err = a.userValidation.ComparePassword(user.PasswordHash, password)
	if err != nil {
		return "", "", "", errors.New("invalid password")
	}
	accessClaims := &domain.UserClaims{
		UserID:      user.ID.Hex(),
		UserName: user.FirstName + " " + user.MiddleName,
		Email:       user.Email,
		IsVerified:  true,
		AccountType: user.AccountType,
		TokenType:   domainInterface.AccessToken,
	}
	accessToken, err := a.auth.GenerateToken(accessClaims, domainInterface.AccessToken)
	if err != nil {
		panic(err)
	}
	refreshClaims := &domain.UserClaims{
		UserID:      user.ID.Hex(),
		UserName: user.FirstName + " " + user.MiddleName,
		Email:       user.Email,
		IsVerified:  true,
		TokenType:   domainInterface.AccessToken,
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
	err = a.userCollection.UpdateIndividual(context.Background(), user.ID, updateUser)
	if err != nil {
		return "", "", "", err
	}

	return accessToken, refreshToken, user.AccountType, nil
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

	if updateReq.FirstName != nil && *updateReq.FirstName != "" {
		updateData["first_name"] = *updateReq.FirstName
	}
	if updateReq.LastName != nil && *updateReq.LastName != "" {
		updateData["last_name"] = *updateReq.LastName
	}
	if updateReq.MiddleName != nil && *updateReq.MiddleName != "" {
		updateData["middle_name"] = *updateReq.MiddleName
	}
	if updateReq.Address != nil && *updateReq.Address != "" {
		updateData["address"] = *updateReq.Address
	}
	if updateReq.Telephone != nil {
		updateData["telephone"] = updateReq.Telephone
	}
	if updateReq.Signature != nil && *updateReq.Signature != "" {
		updateData["signature"] = *updateReq.Signature
	}
	if updateReq.ProfileImage != nil && *updateReq.ProfileImage != "" {
		updateData["profile_image"] = *updateReq.ProfileImage
	}

	if len(updateData) == 0 {
		return errors.New("no valid fields to update")
	}

	return u.userCollection.UpdateProfile(ctx, email, updateData)
}

func (u *UserUseCase) GetNotifications(userID string, page, limit int64) ([]*domain.Notification_, error) {
	notify, err := u.NotificationCollection.FindByReceiverID_(context.Background(), userID, page, limit)
	if err != nil {
		return nil, err
	}
	if len(notify) == 0 {
		return nil, errors.New("no notifications found")
	}
	return notify, nil
}

func (u *UserUseCase) ChangePassword(ctx context.Context, email, oldPassword, newPassword string) error {
	user, err := u.userCollection.FindByEmail(ctx, email)
	if err != nil {
		return errors.New("user not found")
	}

	err = u.userValidation.ComparePassword(user.PasswordHash, oldPassword)
	if err != nil {
		return errors.New("incorrect old password")
	}

	hashedPassword, err := infrastracture.HashPassword(newPassword)
	if err != nil {
		return err
	}

	return u.userCollection.UpdatePasswordByEmail(ctx, email, hashedPassword)
}


func (u *UserUseCase) GetAllUsers(ctx context.Context, page, limit int64, sort string) ([]domain.Individual, int64, error) {
	users, totalUsers, err := u.userCollection.FindAll(ctx, page, limit, sort)
	if err != nil {
		return nil, 0, err
	}
	return users, totalUsers, nil
}



// OAuthLogin handles Google login/signup and token generation
func (uc *UserUseCase) GoogleNextJS(ctx context.Context, profile domain.GoogleProfile) (*domain.Individual, string, string, error) {
	// 1. Check if user exists
	existingUser, _ := uc.userCollection.FindByEmail(ctx, profile.Email)
	var user *domain.Individual
	if existingUser != nil {
		user = existingUser
	} else {
		// 2. Create new user
		userData := &domain.Individual{
			Email:       profile.Email,
			FirstName:    profile.GivenName,
			MiddleName: profile.FamilyName,
			ProfileImage:  profile.Picture,
			IsVerified:  true,
			AccountType: domain.User,
		}
		newUser, err := uc.userCollection.CreateIndividual(ctx, userData)
		if err != nil {
			return nil, "", "", err
		}
		user = newUser
	}

	// 3. Generate access token
	accessClaims := &domain.UserClaims{
		UserID:      user.ID.Hex(),
		UserName: user.FirstName + " " + user.MiddleName,
		Email:       user.Email,
		IsVerified:  user.IsVerified,
		AccountType: user.AccountType,
		TokenType:   domainInterface.AccessToken,
	}
	accessToken, err := uc.auth.GenerateToken(accessClaims, domainInterface.AccessToken)
	if err != nil {
		return nil, "", "", err
	}

	// 4. Generate refresh token
	refreshClaims := &domain.UserClaims{
		UserID:      user.ID.Hex(),
		UserName: user.FirstName + " " + user.MiddleName,
		Email:       user.Email,
		IsVerified:  user.IsVerified,
		AccountType: user.AccountType,
		TokenType:   domainInterface.RefreshToken,
	}
	refreshToken, err := uc.auth.GenerateToken(refreshClaims, domainInterface.RefreshToken)
	if err != nil {
		return nil, "", "", err
	}

	// 5. Update user with refresh token
	update := bson.M{"refresh_token": refreshToken}
	user.RefreshToken = refreshToken
	if err := uc.userCollection.UpdateIndividual(ctx, user.ID, update); err != nil {
		return nil, "", "", err
	}

	return user, accessToken, refreshToken, nil
}

func NewUserUseCase(AUTH domainInterface.IAuthentication, UserColl domainInterface.IIndividualRepository,userValid domainInterface.IUserValidation, unverifiedUserColl domainInterface.IOTPRepository, notify domainInterface.INotification_,OtpService domainInterface.IOTPService) domainInterface.IUserUseCase { //! Don't forget to pass the interfaces of other collections defined on the top
	return &UserUseCase{
		auth:                     AUTH,
		userCollection:           UserColl,
		userValidation:           userValid,
		unverifiedUserCollection: unverifiedUserColl,
		NotificationCollection:   notify,
		OTPSevice:                OtpService,
	}
}