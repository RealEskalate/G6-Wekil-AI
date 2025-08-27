package routers

import (
	controllers "wekil_ai/Delivery/Controllers"
	domain "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"
	"wekil_ai/config"

	"github.com/gin-gonic/gin"
)

func Router(uc domain.IUserController, ai *controllers.AIController) {
	mainRouter := gin.Default()

	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	authMiddleware := infrastracture.NewAuthMiddleware(auth)
	
	mainRouter.POST("/api/auth/refresh",uc.RefreshTokenHandler)
	mainRouter.POST("/api/auth/verify-otp",uc.VerfiyOTPRequest)
	mainRouter.POST("/api/auth/forgot-password", uc.SendResetOTP)
	mainRouter.POST("/api/auth/reset-password", uc.ResetPassword)
	
	mainRouter.POST("/api/auth/register",uc.RegisterIndividualOnly)
	mainRouter.POST("/api/auth/login",uc.HandleLogin)
	mainRouter.POST("/api/auth/logout",authMiddleware.JWTAuthMiddleware(),uc.Logout)

	mainRouter.PUT("/api/users/profile",authMiddleware.JWTAuthMiddleware(),uc.UpdateProfile)
	mainRouter.GET("/api/users/profile",authMiddleware.JWTAuthMiddleware(),uc.GetProfile)

  	mainRouter.GET("/auth/:provider",uc.SignInWithProvider )
	mainRouter.GET("/auth/:provider/callback",uc.CallbackHandler )
	mainRouter.GET("/success", uc.Success)
		

	aiRoutes := mainRouter.Group("/ai")
	{
		aiRoutes.POST("/classify", ai.Classify)
		aiRoutes.POST("/extract", ai.Extract)
		aiRoutes.POST("/draft", ai.Draft)
	}
	mainRouter.Run()
}

