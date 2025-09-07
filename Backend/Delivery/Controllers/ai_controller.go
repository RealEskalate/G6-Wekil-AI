package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	domain "wekil_ai/Domain"
	infrastracture "wekil_ai/Infrastracture"
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

	// Request validation error
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, infrastracture.NewErrorResponse(err.Error(), infrastracture.ValidationError))
		return
	}
	// Call to usecase/service
	result, err := c.aiUsecase.Extract(context.Background(), req.Text, req.Language)

	// Internal server error from usecase
	if err != nil {

		if err.Error() == "some service is down" {
			ctx.JSON(http.StatusServiceUnavailable, infrastracture.NewErrorResponse(err.Error(), infrastracture.ServiceUnavailable))
			return
		}

		// Generic internal error
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}

	// Success response
	ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Extraction successful", result))
}

// POST /ai/classify
func (c *AIController) Classify(ctx *gin.Context) {
	var req struct {
		Text string `json:"text" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, infrastracture.NewErrorResponse(err.Error(), infrastracture.ValidationError))
		return
	}
	result, err := c.aiUsecase.Classify(context.Background(), req.Text)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}
	ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Classification success", result))
}

type DraftRequest struct {
	Draft    domain.Intake `json:"draft" binding:"required"`
	Language string        `json:"language" binding:"required"`
}

// POST /ai/draft
func (c *AIController) Draft(ctx *gin.Context) {
	var req DraftRequest

	// Bind JSON once
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, infrastracture.NewErrorResponse(err.Error(), infrastracture.ValidationError))
		return
	}

	result, err := c.aiUsecase.Draft(context.Background(), &req.Draft, req.Language)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}

	ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Classification success", result))
}

// POST /ai/draft-from-prompt
func (c *AIController) DraftFromPrompt(ctx *gin.Context) {
	var req struct {
		Draft      string `json:"draft" binding:"required"`
		PromptText string `json:"prompt" binding:"required"`
		Language   string `json:"language" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": "",
			"data": gin.H{
				"message": "Invalid request data",
				"error":   err.Error(),
			},
		})
		return
	}

	//? the newly injected ai interaction
	newDraft, err := c.aiUsecase.GenerateDraftFromPromptString(context.Background(), req.Draft, req.PromptText, req.Language)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": "",
			"data": gin.H{
				"message": "Failed to generate draft",
				"error":   err.Error(),
			},
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Draft updated from prompt successfully",
			"draft":   newDraft,
		},
	})
}

func (c *AIController) FinalPreview(ctx *gin.Context) {
	var req struct {
		Draft   string         `json:"draft" binding:"required"`
		Parties []domain.Party `json:"parties" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, infrastracture.NewErrorResponse(err.Error(), infrastracture.ValidationError))
		return
	}

	var draft domain.Draft
	if err := json.Unmarshal([]byte(req.Draft), &draft); err != nil || draft.Title == "" || len(draft.Sections) == 0 {
		// Not valid structured draft → Extract intake first
		intake, err := c.aiUsecase.Extract(context.Background(), req.Draft, "English")
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
			return
		}

		// Safe fallback for title
		title := intake.AgreementType
		if title == "" {
			title = "Draft Agreement"
		}

		// Build a minimal base draft with at least one section
		draft = domain.Draft{
			Title: title,
			Sections: []domain.Section{
				{
					Heading: "Summary",
					Text:    req.Draft,
				},
			},
			Signatures: domain.Signatures{
				PartyA: "<<Signature A>>",
				PartyB: "<<Signature B>>",
				Place:  "<<Place>>",
				Date:   "<<Date>>",
			},
		}
	}

	// Generate final preview
	finalDraft, err := c.aiUsecase.FinalPreview(context.Background(), &draft, req.Parties)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}

	// Build text for classification safely
	var draftText strings.Builder
	if finalDraft.Title != "" {
		draftText.WriteString(finalDraft.Title)
		draftText.WriteString("\n")
	}
	for _, section := range finalDraft.Sections {
		if section.Heading != "" {
			draftText.WriteString(strings.TrimSpace(section.Heading))
			draftText.WriteString(" ")
		}
		draftText.WriteString(strings.TrimSpace(section.Text))
		draftText.WriteString("\n")
	}

	// Classify the draft
	classification, err := c.aiUsecase.Classify(context.Background(), draftText.String())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}

	// Return structured response
	response := struct {
		Success bool `json:"success"`
		Data    struct {
			Message        string                   `json:"message"`
			Classification *domain.ClassifierResult `json:"classification"`
		} `json:"data"`
	}{
		Success: true,
		Data: struct {
			Message        string                   `json:"message"`
			Classification *domain.ClassifierResult `json:"classification"`
		}{
			Message:        "Final draft classified successfully.",
			Classification: classification,
		},
	}

	ctx.JSON(http.StatusOK, response)
}
