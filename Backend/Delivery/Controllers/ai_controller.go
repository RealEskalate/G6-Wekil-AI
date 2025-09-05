package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"wekil_ai/Domain"
	infrastracture "wekil_ai/Infrastracture"
	"wekil_ai/Usecases"

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
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(),infrastracture.InternalServerError))
		return
	}
	ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Classification success", result))
}

// POST /ai/draft
func (c *AIController) Draft(ctx *gin.Context) {
	var req struct {
		Draft    string `json:"draft" binding:"required"`
		Language string `json:"language" binding:"required"`
	}

	// Validate request
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, infrastracture.NewErrorResponse(err.Error(), infrastracture.ValidationError))
		return
	}

	// Step 1: Try to parse the draft into a structured Draft
	var parsedDraft domain.Draft
	err := json.Unmarshal([]byte(req.Draft), &parsedDraft)
	if err != nil || parsedDraft.Title == "" {
		// Step 2: If it’s not valid JSON → treat it as raw text
		// First Extract → then Draft
		intake, err := c.aiUsecase.Extract(context.Background(), req.Draft, req.Language)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
			return
		}

		// Build a human-readable string from intake
		intakeSummary, _ := json.Marshal(intake)

		result, err := c.aiUsecase.Draft(context.Background(), string(intakeSummary), req.Language)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
			return
		}

		ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Draft generated successfully from raw text", result))
		return
	}

	// Step 3: If it’s already structured JSON → just Draft
	result, err := c.aiUsecase.Draft(context.Background(), req.Draft, req.Language)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}

	ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Draft generated successfully", result))
}

// POST /ai/draft-from-prompt
func (c *AIController) DraftFromPrompt(ctx *gin.Context) {
	var req struct {
		Draft      string `json:"draft" binding:"required"`
		PromptText string `json:"prompt" binding:"required"`
		Language   string `json:"language" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, infrastracture.NewErrorResponse(err.Error(), infrastracture.ValidationError))
		return
	}

	var draft domain.Draft
	err := json.Unmarshal([]byte(req.Draft), &draft)
	if err != nil || draft.Title == "" {
		// Not valid structured draft → Extract intake first
		intake, err := c.aiUsecase.Extract(context.Background(), req.Draft, req.Language)
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
		sectionText := req.Draft
		if intakeSummary, err := json.Marshal(intake); err == nil {
			sectionText += "\n\nIntake Summary: " + string(intakeSummary)
		}

		draft = domain.Draft{
			Title: intake.AgreementType,
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

	newDraft, err := c.aiUsecase.DraftFromPrompt(
		context.Background(),
		&draft,
		req.PromptText,
		req.Language,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, infrastracture.NewErrorResponse(err.Error(), infrastracture.InternalServerError))
		return
	}

	ctx.JSON(http.StatusOK, infrastracture.NewSuccessResponse("Draft updated from prompt successfully", newDraft))
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
