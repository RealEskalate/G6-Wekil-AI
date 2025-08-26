package domain

import "github.com/gin-gonic/gin"

type IUserController interface {
	RefreshTokenHandler(ctx *gin.Context)
	VerfiyOTPRequest(ctx *gin.Context)
	RegisterIndividualOnly(ctx *gin.Context)
	SendResetOTP(ctx *gin.Context)
	ResetPassword(ctx *gin.Context)
	HandleLogin(ctx *gin.Context) 
	Logout(ctx *gin.Context)
	UpdateProfile(ctx *gin.Context)
	GetProfile(ctx *gin.Context)
}
