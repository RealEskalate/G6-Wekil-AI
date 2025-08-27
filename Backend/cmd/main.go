package main

import (
	"log"
	controllers "wekil_ai/Delivery/Controllers"
	oauth "wekil_ai/Delivery/Oauth"
	routers "wekil_ai/Delivery/Routers"
	infrastracture "wekil_ai/Infrastracture"
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
	defer mongoClient.Disconnect()
	oauth.InitOAuth()
	password_service := infrastracture.NewPasswordService()
	userRepo := repository.NewUserRepository(mongoClient.Client,config.MONGODB,"user")
	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	unverifiedUserRepo := repository.NewUnverifiedUserRepository(mongoClient.Client)
	userUsecase := usecases.NewUserUseCase(auth,userRepo,password_service,unverifiedUserRepo)
	oAuthusecase := usecases.NewOAuthUsecase(userRepo,auth)
	userController := controllers.NewUserController(userUsecase,oAuthusecase)

	routers.Router(userController)
}
