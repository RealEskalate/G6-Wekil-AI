package domain

import "github.com/gin-gonic/gin"

type IUserController interface {
	RefreshTokenHandler(ctx *gin.Context)
	VerfiyOTPRequest(ctx *gin.Context)
	RegisterIndividualOnly(ctx *gin.Context)
	SendResetOTP(ctx *gin.Context)
	ResetPassword(ctx *gin.Context)
	HandleLogin(ctx *gin.Context) 
	SignInWithProvider(c *gin.Context) 
	CallbackHandler(c *gin.Context)
	Success(c *gin.Context)
}
