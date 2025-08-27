package routers

import (
	controllers "wekil_ai/Delivery/Controllers"
	domain "wekil_ai/Domain/Interfaces"

	"github.com/gin-gonic/gin"
)

func Router(uc domain.IUserController, ai *controllers.AIController) {
	mainRouter := gin.Default()

	mainRouter.POST("/api/auth/refresh", uc.RefreshTokenHandler)
	mainRouter.POST("/api/auth/verify-otp", uc.VerfiyOTPRequest)
	mainRouter.POST("/api/auth/register/individual", uc.RegisterIndividualOnly)

	aiRoutes := mainRouter.Group("/ai")
	{
		aiRoutes.POST("/classify", ai.Classify)
		aiRoutes.POST("/extract", ai.Extract)
		aiRoutes.POST("/draft", ai.Draft)
	}
	mainRouter.Run()
}
