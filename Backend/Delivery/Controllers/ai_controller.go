package controllers

import (
	"context"
	"net/http"
	"wekil_ai/Domain"
	"wekil_ai/Usecases"

	"github.com/gin-gonic/gin"
)

type AIController struct {
	aiUsecase *usecases.AIUsecase
}

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
        "agreement_type": result.AgreementType, // include the new field
        "intake": result,
    })
}

func (c *AIController) Classify(ctx *gin.Context) {
	var req struct {
		Text     string `json:"text" binding:"required"`
		Language string `json:"language" binding:"required"`
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
