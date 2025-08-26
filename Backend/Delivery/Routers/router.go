package routers

import (
	domain "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"
	"wekil_ai/config"

	"github.com/gin-gonic/gin"
)



func Router(uc domain.IUserController) { 

	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	authMiddleware := infrastracture.NewAuthMiddleware(auth)

	mainRouter := gin.Default()	
	
	mainRouter.POST("/api/auth/refresh",uc.RefreshTokenHandler)
	mainRouter.POST("/api/auth/verify-otp",uc.VerfiyOTPRequest)
	mainRouter.POST("/forgot-password", uc.SendResetOTP)
	mainRouter.POST("/reset-password", uc.ResetPassword)
	
	mainRouter.POST("/api/auth/register",uc.RegisterIndividualOnly)
	mainRouter.POST("/api/auth/login",uc.HandleLogin)
	mainRouter.POST("/api/auth/logout",authMiddleware.JWTAuthMiddleware(),uc.Logout)

	mainRouter.PUT("/api/auth/profile",authMiddleware.JWTAuthMiddleware(),uc.UpdateProfile)
	mainRouter.GET("/api/auth/profile",authMiddleware.JWTAuthMiddleware(),uc.GetProfile)

	
	mainRouter.Run()	
}

