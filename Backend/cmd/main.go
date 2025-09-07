package main

import (
	"log"
	controllers "wekil_ai/Delivery/Controllers"
	oauth "wekil_ai/Delivery/Oauth"
	routers "wekil_ai/Delivery/Routers"
	infrastracture "wekil_ai/Infrastracture"
	ai_interaction "wekil_ai/Infrastracture/ai_interaction"
	repository "wekil_ai/Repositories"
	usecases "wekil_ai/Usecases"
	"wekil_ai/config"
)

func main() {

	config.InitEnv()
	mongoClient, err := repository.Connect()
	if err != nil {
		log.Fatal("❌Failed to connect:", err)
	}
	apiKey := config.GEMINI_API_KEY
	log.Println("🤖", apiKey)
	if apiKey == "" {
		log.Fatal("❌ GEMINI_API_KEY not set")
	}
	defer mongoClient.Disconnect()
	oauth.InitOAuth()
	password_service := infrastracture.NewPasswordService()
	userRepo := repository.NewUserRepository(mongoClient.Client, config.MONGODB, "user")
	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	unverifiedUserRepo := repository.NewUnverifiedUserRepository(mongoClient.Client)
	sweetNotificationRepo := repository.NewNotification_Repository(mongoClient.Client)
	generalEmailService := infrastracture.NewGeneralEmailService()
	userUsecase := usecases.NewUserUseCase(auth, userRepo, password_service, unverifiedUserRepo, sweetNotificationRepo, generalEmailService)

	aiInfra, err := ai_interaction.NewAIInteraction()
	if err != nil {
		log.Fatal(err)
	}

	aiUsecase := usecases.NewAIUsecase(aiInfra)

	aiController := controllers.NewAIController(aiUsecase)

	oAuthusecase := usecases.NewOAuthUsecase(userRepo, auth)
	userController := controllers.NewUserController(userUsecase, oAuthusecase)

	pendingRepo := repository.NewPendingAgreementRepository(mongoClient.Client, config.MONGODB, "pending")
	intakeRepo := repository.NewIntakeRepository(mongoClient.Client, config.MONGODB, "intake")
	agreementRepo := repository.NewAgreementRepository(mongoClient.Client, config.MONGODB, "agreement")
	agreementUsecase := usecases.NewAgreementUseCase(intakeRepo, agreementRepo, pendingRepo, aiInfra, sweetNotificationRepo, generalEmailService)
	agreementController := controllers.NewAgreementController(agreementUsecase, aiInfra)
	routers.Router(userController, aiController, agreementController)
}