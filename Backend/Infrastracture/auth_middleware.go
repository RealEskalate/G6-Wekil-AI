package infrastracture

import (
	"log"
	"net/http"
	"strings"

	domainInterface "wekil_ai/Domain/Interfaces"

	"github.com/gin-gonic/gin"
)

type AuthMiddleware struct {
	jwtAuth domainInterface.IAuthentication
}

func NewAuthMiddleware(jwtAuth domainInterface.IAuthentication) *AuthMiddleware {
	return &AuthMiddleware{
		jwtAuth: jwtAuth,
	}
}

func (a *AuthMiddleware) JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing or invalid"})
			c.Abort()
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse the token
		claims, err := a.jwtAuth.ParseTokenToClaim(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}
		log.Println("------------------------")
		log.Printf("%+v\n", *claims)
		log.Println()
		log.Println("------------------------")
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("account_type", claims.AccountType)
		c.Set("is_verified", claims.IsVerified)

		c.Next()
	}
}

func RoleMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("account_type")
		if !exists || role != requiredRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient privileges"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func VerifiedMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		verified, exists := c.Get("is_verified")
		if !exists || verified != true {
			c.JSON(http.StatusForbidden, gin.H{"error": "Account not verified"})
			c.Abort()
			return
		}
		c.Next()
	}
}
