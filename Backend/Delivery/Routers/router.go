package routers

import (
	domain "wekil_ai/Domain/Interfaces"

	"github.com/gin-gonic/gin"
)

func Router(uc domain.IUserController) {
	mainRouter := gin.Default()

	mainRouter.POST("/api/auth/refresh", uc.RefreshTokenHandler)
	mainRouter.POST("/api/auth/verify-otp", uc.VerfiyOTPRequest)
	mainRouter.POST("/api/auth/register/individual", uc.RegisterIndividualOnly)

	mainRouter.GET("/auth/:provider",uc.SignInWithProvider )
	mainRouter.GET("/auth/:provider/callback",uc.CallbackHandler )
	mainRouter.GET("/success", uc.Success)

	mainRouter.Run()
}
