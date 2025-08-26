package controllers

import (
	"fmt"
	"net/http"

	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	userUseCase domainInterface.IUserUseCase
}

// RegisterIndividual implements domain.IUserController.
func (u *UserController) RegisterIndividualOnly(ctx *gin.Context) {
	var unverifiedUser domain.UnverifiedUserDTO
	if err := ctx.ShouldBindJSON(&unverifiedUser); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"error": err.Error(),
			},
		})
		return
	}
	_, err := u.userUseCase.StoreUserInOTPColl(&unverifiedUser)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"error": err.Error(),
			},
		})
		return
	}
	// send the otp using email
	ctx.IndentedJSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Otp has been sent. Please verify your email.",
		},
	})
}

// VerfiyOTPRequest implements domain.IUserController.
func (u *UserController) VerfiyOTPRequest(ctx *gin.Context) {
	var emailOTP domain.EmailOTP
	if err := ctx.ShouldBindJSON(&emailOTP); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"error": err.Error(),
			},
		})
		return
	}
	userInfo, err := u.userUseCase.ValidOTPRequest(&emailOTP)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{ // Changed to StatusBadRequest for invalid requests
			"success": false,
			"data": gin.H{
				"error": err.Error(),
			},
		})
		return
	}
	_, err = u.userUseCase.StoreUserInMainColl(userInfo)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"error": err.Error(),
			},
		})
		return
	}
	ctx.IndentedJSON(http.StatusAccepted, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Email successfully verified.",
		},
	})
}

// RefreshTokenHandler implements domain.IController.
func (u *UserController) RefreshTokenHandler(ctx *gin.Context) {
	// get refresh token from cookie
	refreshToken, err := ctx.Cookie("WEKIL-API-REFRESH-TOKEN") //! don't forget to make the string in the cookie to a const
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Refresh token cookie not found"})
		return
	}
	// validate refresh token and if the refresh token is valid then
	accessToken, err := u.userUseCase.ReSendAccessToken(refreshToken)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	// send the access token to the user and send accepted status
	ctx.Header("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	ctx.IndentedJSON(http.StatusOK, gin.H{"message": "Login successful. Tokens sent in header and cookie."})

}

func (uc *UserController) HandleLogin(ctx *gin.Context) {

	var user *domain.Individual
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Invalid request payload",
		})
		return
	}
	if user.Email == "" || user.PasswordHash == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
		return
	}
	accessToken,refreshToken, err := uc.userUseCase.Login(user.Email, user.PasswordHash)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	tokens := map[string]string{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}
	ctx.JSON(200, gin.H{"message": "User logged in successfully", "token": tokens})

}

func NewUserController(userUseCase_ domainInterface.IUserUseCase) domainInterface.IUserController {
	return &UserController{
		userUseCase: userUseCase_,
	}
}
