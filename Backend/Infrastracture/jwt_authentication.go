package infrastracture

import (
	"fmt"
	"log"
	"net/http"
	"time"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"github.com/golang-jwt/jwt/v5"
	"github.com/markbates/goth/gothic"
)

const (
	AccessToken  = domainInterface.AccessToken
	RefreshToken = domainInterface.RefreshToken
)

type JWTAuthentication struct {
	signingKey []byte
}

// GenerateToken creates a new signed token with the given claims and type.
// It sets the correct expiration time based on the tokenType.
func (j *JWTAuthentication) GenerateToken(claims *domain.UserClaims, tokenType string) (string, error) {
	// Set the token type and expiration time on the claims.
	claims.TokenType = tokenType
	switch tokenType {
	case AccessToken:
		// Access tokens have a short expiration time (e.g., 15 minutes).
		claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(15 * time.Minute))
	case RefreshToken:
		// Refresh tokens have a longer expiration time (e.g., 7 days).
		claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour))
	default:
		return "", fmt.Errorf("invalid token type provided: %s", tokenType)
	}

	// Set the IssuedAt time.
	claims.IssuedAt = jwt.NewNumericDate(time.Now())

	// Create a new token object with the HMAC SHA-256 signing method and the claims.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token to get the complete encoded token as a string.
	tokenString, err := token.SignedString(j.signingKey)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// ParseTokenToClaim parses a raw token string and validates it against the signing key.
// It returns the claims if the token is valid, otherwise an error.
func (j *JWTAuthentication) ParseTokenToClaim(tokenString string) (*domain.UserClaims, error) {
	// Prepare an empty struct to hold the parsed claims.
	claims := &domain.UserClaims{}

	// The key function provides the secret key to verify the token's signature.
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return j.signingKey, nil
	}

	// Parse the token string and validate it.
	parsedToken, err := jwt.ParseWithClaims(tokenString, claims, keyFunc)
	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	// Check if the parsed token is valid. This automatically performs standard
	// validations like checking the expiration time.
	if !parsedToken.Valid {
		return nil, fmt.Errorf("token is invalid")
	}

	// Return the claims if the token is valid.
	return claims, nil
}

func (o *JWTAuthentication) OAuthLogin(req *http.Request, res http.ResponseWriter) (*domain.Individual, error) {
	user, err := gothic.CompleteUserAuth(res, req)
	log.Print("+++++++_______++++++++++", user)
	if err != nil {
		return nil, err
	}
	// name := user.Name
	// firstname , middlename := strings.Split(name, "")
	return &domain.Individual{
		Email: user.Email,
		FirstName: user.FirstName,
		LastName: user.LastName,
	}, nil
}

// NewJWTAuthentication creates a new JWT authentication service instance.
// The signing key should be a strong, secret key.
func NewJWTAuthentication(signingKey string) domainInterface.IAuthentication {
	return &JWTAuthentication{
		signingKey: []byte(signingKey),
	}
}
