package main

import (
	"log"
	controllers "wekil_ai/Delivery/Controllers"
	oauth "wekil_ai/Delivery/Oauth"
	routers "wekil_ai/Delivery/Routers"
	infrastracture "wekil_ai/Infrastracture"
	ai_interaction "wekil_ai/Infrastracture/ai_interaction"
	"wekil_ai/Repositories"
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
	if apiKey == "" {
		log.Fatal("❌ GEMINI_API_KEY not set")
	}
	defer mongoClient.Disconnect()
	oauth.InitOAuth()
	password_service := infrastracture.NewPasswordService()
	userRepo := repository.NewUserRepository(mongoClient.Client,config.MONGODB,"user")
	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	unverifiedUserRepo := repository.NewUnverifiedUserRepository(mongoClient.Client)
	NotifationRepo := repository.NewNotificationRepository(mongoClient.Client)
	otpService := infrastracture.NewOTPService()
	userUsecase := usecases.NewUserUseCase(auth,userRepo,password_service,unverifiedUserRepo,NotifationRepo,otpService)


	aiInfra, err := ai_interaction.NewAIInteraction(apiKey)
	if err != nil {
		log.Fatal(err)
	}

	aiUsecase := usecases.NewAIUsecase(aiInfra)

	aiController := controllers.NewAIController(aiUsecase)

	oAuthusecase := usecases.NewOAuthUsecase(userRepo,auth)
	userController := controllers.NewUserController(userUsecase,oAuthusecase)
  routers.Router(userController, aiController)
}
