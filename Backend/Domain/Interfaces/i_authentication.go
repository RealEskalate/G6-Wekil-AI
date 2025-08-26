package domain

import (
	domain "backend/Domain"
)

const (
	AccessToken  = "access_token"
	RefreshToken = "refresh_token"
)

type IAuthentication interface {
	ParseTokenToClaim(token string) (*domain.UserClaims, error)
	GenerateToken(claims *domain.UserClaims, tokenType string) (string, error)
}
