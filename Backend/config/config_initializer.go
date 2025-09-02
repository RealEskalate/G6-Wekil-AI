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
	SENDGRID_API_KEY         string
	SigningKey               string
	SENDER_EMAIL             string
	MONGODB                  string
	GEMINI_API_KEY           string
	CLIENT_ID                string
	CLIENT_SECRET            string
	CLIENT_CALLBACK_URL      string
)

func InitEnv() {
	// Try to load .env (for local dev), but don't fail if not found
	_ = godotenv.Load()

	MONGODB_URI = getEnv("MONGODB_URI")
	JWT_ACCESS_TOKEN_SECRET = getEnv("JWT_ACCESS_TOKEN_SECRET")
	JWT_REFRESH_TOKEN_SECRET = getEnv("JWT_REFRESH_TOKEN_SECRET")
	SENDGRID_API_KEY = getEnv("SENDGRID_API_KEY")
	SigningKey = getEnv("SigningKey")
	SENDER_EMAIL = getEnv("SENDER_EMAIL")
	GEMINI_API_KEY = getEnv("GEMINI_API_KEY")
	MONGODB = getEnv("MONGODB")
	CLIENT_ID = getEnv("CLIENT_ID")
	CLIENT_SECRET = getEnv("CLIENT_SECRET")
	CLIENT_CALLBACK_URL = getEnv("CLIENT_CALLBACK_URL")

	// Render provides PORT automatically
	PORT = os.Getenv("PORT")
	if PORT == "" {
		PORT = "8080" // fallback for local dev
	}
}

func getEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Environment variable %s is not set", key)
	}
	return val
}
