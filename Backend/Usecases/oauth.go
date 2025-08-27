package usecases

import (
	"context"
	"net/http"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
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

func (uc *OAuthUsecase) HandleOAuthLogin(req *http.Request, res http.ResponseWriter) (*domain.Individual, error) {
	userData, err := uc.authService.OAuthLogin(req, res)
	if err != nil {
		return nil, err
	}

	existingUser, _ := uc.userRepo.FindByEmail(context.Background(),userData.Email)
	if existingUser != nil {
		return existingUser, nil // Login
	}

	// Signup
	_,err = uc.userRepo.CreateIndividual(context.Background(),userData)
	if err != nil {
		return nil, err
	}
	return userData, nil
}
