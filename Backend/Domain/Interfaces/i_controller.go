package domain

import "github.com/gin-gonic/gin"

type IUserController interface {
	RefreshTokenHandler(ctx *gin.Context)
	VerfiyOTPRequest(ctx *gin.Context)
	RegisterIndividualOnly(ctx *gin.Context)
	SendResetOTP(ctx *gin.Context)
	ResetPassword(ctx *gin.Context)
}
