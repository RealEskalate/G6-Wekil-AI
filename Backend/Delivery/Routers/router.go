package routers

import (
	domain "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"
	"wekil_ai/config"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Router(uc domain.IUserController, ai domain.IAIController, ag domain.IAgreementController) {
	mainRouter := gin.Default()
	// Allow CORS from all origins
	mainRouter.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))
	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	authMiddleware := infrastracture.NewAuthMiddleware(auth)

	mainRouter.POST("/api/auth/refresh", uc.RefreshTokenHandler)
	mainRouter.POST("/api/auth/verify-otp", uc.VerfiyOTPRequest)
	mainRouter.POST("/api/auth/resend-otp", uc.ResendOTPHandler)
	mainRouter.POST("/api/auth/forgot-password", uc.SendResetOTP)
	mainRouter.POST("/api/auth/change-password", authMiddleware.JWTAuthMiddleware(), uc.ChangePasswordHandler)
	mainRouter.POST("/api/auth/reset-password", uc.ResetPassword)

	mainRouter.POST("/api/auth/register", uc.RegisterIndividualOnly)
	mainRouter.POST("/api/auth/login", uc.HandleLogin)
	mainRouter.POST("/api/auth/logout", authMiddleware.JWTAuthMiddleware(), uc.Logout)

	mainRouter.PUT("/api/users/profile", authMiddleware.JWTAuthMiddleware(), uc.UpdateProfile)
	mainRouter.GET("/api/users/profile", authMiddleware.JWTAuthMiddleware(), uc.GetProfile)
	mainRouter.GET("/api/users/notification", authMiddleware.JWTAuthMiddleware(), uc.HandleNotifications)
	mainRouter.GET("/auth/:provider", uc.SignInWithProvider)
	mainRouter.GET("/auth/:provider/callback", uc.CallbackHandler)
	mainRouter.POST("/auth/nextjs", uc.GoogleAuthHandler)
	mainRouter.GET("/success", uc.Success)

	aiRoutes := mainRouter.Group("/ai")
	// aiRoutes.Use(authMiddleware.JWTAuthMiddleware())
	{
		aiRoutes.POST("/classify", ai.Classify)
		aiRoutes.POST("/extract", ai.Extract)
		aiRoutes.POST("/draft", ai.Draft)
		aiRoutes.POST("/draft-from-prompt", ai.DraftFromPrompt)
		aiRoutes.POST("/final-preview", ai.FinalPreview)
	}

	adminRoutes := mainRouter.Group("api/admin")

	adminRoutes.Use(authMiddleware.JWTAuthMiddleware())
	{
		adminRoutes.GET("/users", uc.GetAllUsers)
		// adminRoutes.GET("/agreements", uc.GetAllAgreements)

		// adminRoutes.GET("/users/:id", uc.GetUserByID)
		// adminRoutes.GET("/agreements/:id", uc.GetAgreement)
	}

	agreementRoutes := mainRouter.Group("/agreement")				
	agreementRoutes.Use(authMiddleware.JWTAuthMiddleware())
	{
		agreementRoutes.POST("/create", ag.CreateAgreement) //TODO: DELETE this one since it's not accepting DRAFT as the saving is.
		agreementRoutes.POST("/handle-signature", ag.SignitureHandling)
		agreementRoutes.DELETE("/delete", ag.DeleteAgreement)
		agreementRoutes.POST("/duplicate", ag.DuplicateAgreement)
		agreementRoutes.POST("/save", authMiddleware.JWTAuthMiddleware(), ag.SaveAgreement) //? ag.SaveAgreement is used for both saving and sending. (if the status is pending then it should both (save and send) if it's draft then it will ONLY save it)
		agreementRoutes.POST("/send", authMiddleware.JWTAuthMiddleware(), ag.SaveAgreement) //? ag.SaveAgreement is used for both saving and sending. (if the status is pending then it should both (save and send) if it's draft then it will ONLY save it)

		agreementRoutes.POST("/", ag.GetAgreementByID)
		agreementRoutes.GET("/:agreement_id", ag.GetAgreementByID_GET)
		agreementRoutes.GET("/filter", ag.GetAgreementByFilter)
		agreementRoutes.GET("/userID", ag.GetAgreementByUserID)
		agreementRoutes.POST("/sign", ag.SignitureHandling)
		// agreementRoutes.POST("/decline", ag)
	}
	mainRouter.Run()

}
