package domain

import "github.com/gin-gonic/gin"

// IAIController defines the contract for the AI-related API endpoints.
// Any concrete implementation of this interface must provide these methods.
type IAIController interface {
	Extract(ctx *gin.Context)
	Classify(ctx *gin.Context)
	Draft(ctx *gin.Context)
	DraftFromPrompt(ctx *gin.Context)
	FinalPreview(ctx *gin.Context)
}
