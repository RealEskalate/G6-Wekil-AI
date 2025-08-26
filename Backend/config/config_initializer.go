package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

var (
MONGODB_URI              string
PORT                     string
JWT_ACCESS_TOKEN_SECRET  string
JWT_REFRESH_TOKEN_SECRET string
SENDGRID_API_KEY		string
SigningKey				string
SENDER_EMAIL			string
)

func InitEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("can not load .env file")
	}
	MONGODB_URI = getEnv("MONGODB_URI")
	JWT_ACCESS_TOKEN_SECRET = getEnv("JWT_ACCESS_TOKEN_SECRET")
	JWT_REFRESH_TOKEN_SECRET = getEnv("JWT_REFRESH_TOKEN_SECRET")
	SENDGRID_API_KEY = getEnv("SENDGRID_API_KEY")
	
	SigningKey  = getEnv("SigningKey")
	SENDER_EMAIL = getEnv("SENDER_EMAIL")
	
}

func getEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Environment variable %s is not set", key)
	}
	return val
}
