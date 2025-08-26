package main

import (
	"log"
	controllers "wekil_ai/Delivery/Controllers"
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

	password_service := infrastracture.NewPasswordService()
	userRepo := repository.NewUserRepository(mongoClient.Client,config.MONGODB_URI,"user")
	auth := infrastracture.NewJWTAuthentication(config.SigningKey)
	unverifiedUserRepo := repository.NewUnverifiedUserRepository(mongoClient.Client)
	userUsecase := usecases.NewUserUseCase(auth,userRepo,password_service,unverifiedUserRepo)
	userController := controllers.NewUserController(userUsecase)

	routers.Router(userController)
}
