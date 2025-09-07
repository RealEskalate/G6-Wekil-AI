package usecases

import (
	"context"
	"log"
	"net/http"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
)

// usecases/user_usecase.go
type OAuthUsecase struct {
	userRepo    domainInterface.IIndividualRepository
	authService domainInterface.IAuthentication
}

func NewOAuthUsecase(ur domainInterface.IIndividualRepository, as domainInterface.IAuthentication) domainInterface.IOAuthUsecase {
	return &OAuthUsecase{
		userRepo:    ur,
		authService: as,
	}
}

func (uc *OAuthUsecase) HandleOAuthLogin(req *http.Request, res http.ResponseWriter) (*domain.Individual,string,string, error) {
	userData, err := uc.authService.OAuthLogin(req, res)
	log.Printf("OAuth user**************************: %+v", userData)

	if err != nil {
		return nil, "","",err
	}

	existingUser, _ := uc.userRepo.FindByEmail(context.Background(),userData.Email)
	var user *domain.Individual
	if existingUser != nil {
		// Login: use existing user
		user = existingUser
	} else {
		// Signup: create new user
		userData.IsVerified = true
		user, err = uc.userRepo.CreateIndividual(context.Background(), userData)
		if err != nil {
			return nil, "", "", err
		}
	}
	accessclaims := &domain.UserClaims{
		UserID: user.ID.Hex(),
		UserName: user.FirstName + " " + user.MiddleName,
		Email: user.Email,
		IsVerified: true,
		AccountType: domain.User,
		TokenType: domainInterface.AccessToken,
	}

	accessToken,err := uc.authService.GenerateToken(accessclaims,domainInterface.AccessToken)
	if err != nil{
		return nil,"","",err
	}

	refreshclaims := &domain.UserClaims{
		UserID: user.ID.Hex(),
		UserName: user.FirstName + " " + user.MiddleName,
		Email: user.Email,
		IsVerified: true,
		AccountType: domain.User,
		TokenType: domainInterface.RefreshToken,
	}
	refreshToken ,err := uc.authService.GenerateToken(refreshclaims,domainInterface.RefreshToken)
	if err != nil{
		return nil ,"","",err
	}
	updateUser := bson.M{
    "refresh_token": refreshToken,
	}
	user.RefreshToken = refreshToken
	err = uc.userRepo.UpdateIndividual(context.Background(),user.ID,updateUser)
	if err != nil{
		return nil ,"","",err
	}
	return user,accessToken,refreshToken, nil
}
