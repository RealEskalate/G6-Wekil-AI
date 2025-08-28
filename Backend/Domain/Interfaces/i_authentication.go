package domain

import (
	"net/http"
	domain "wekil_ai/Domain"
)

const (
	AccessToken  = "access_token"
	RefreshToken = "refresh_token"
)

type IAuthentication interface {
	ParseTokenToClaim(token string) (*domain.UserClaims, error)
	GenerateToken(claims *domain.UserClaims, tokenType string) (string, error)
	OAuthLogin(req *http.Request, res http.ResponseWriter) (*domain.Individual, error)
}
