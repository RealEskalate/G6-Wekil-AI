package oauth

import (
	"wekil_ai/config"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	key    = "randomString"
	MaxAge = 86400 * 30
	IsProd = false
)

func InitOAuth() {
	clientID := config.CLIENT_ID
	clientSecret := config.CLIENT_SECRET
	clientCallbackURL := config.CLIENT_CALLBACK_URL
	store := cookie.NewStore([]byte("randomString"))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   86400 * 30,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	})
	gothic.Store = store

	goth.UseProviders(
		google.New(clientID, clientSecret, clientCallbackURL),
	)
}
