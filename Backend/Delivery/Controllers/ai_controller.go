package controllers

import (
	"context"
	"net/http"
	domain "wekil_ai/Domain"
	usecases "wekil_ai/Usecases"

	"github.com/gin-gonic/gin"
)

type AIController struct {
	aiUsecase *usecases.AIUsecase
}

// * This controller doesn't have an Interface like others ‼️‼️‼️
func NewAIController(aiUsecase *usecases.AIUsecase) *AIController {
	return &AIController{aiUsecase: aiUsecase}
}

// POST /ai/extract
func (c *AIController) Extract(ctx *gin.Context) {
	var req struct {
		Text     string `json:"text" binding:"required"`
		Language string `json:"language" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := c.aiUsecase.Extract(context.Background(), req.Text, req.Language)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"agreement_type": result.AgreementType,
		"intake":         result,
	})
}

// POST /ai/classify
func (c *AIController) Classify(ctx *gin.Context) {
	var req struct {
		Text string `json:"text" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := c.aiUsecase.Classify(context.Background(), req.Text)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, result)
}

// POST /ai/draft
func (c *AIController) Draft(ctx *gin.Context) {
	var intake domain.Intake
	lang := ctx.DefaultQuery("language", "English")

	if err := ctx.ShouldBindJSON(&intake); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result, err := c.aiUsecase.Draft(context.Background(), &intake, lang)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, result)
}

// POST /ai/draft-from-prompt
func (c *AIController) DraftFromPrompt(ctx *gin.Context) {
	var req struct {
		Draft      domain.Draft `json:"draft" binding:"required"`
		PromptText string       `json:"prompt" binding:"required"`
		Language   string       `json:"language" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newDraft, err := c.aiUsecase.DraftFromPrompt(
		context.Background(),
		&req.Draft,
		req.PromptText,
		req.Language,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newDraft)
}

// POST /ai/final-preview
func (c *AIController) FinalPreview(ctx *gin.Context) {
	var req struct {
		Draft   domain.Draft   `json:"draft" binding:"required"`
		Parties []domain.Party `json:"parties" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	finalDraft, err := c.aiUsecase.FinalPreview(context.Background(), &req.Draft, req.Parties)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, finalDraft)
}
