package controllers

import (
	"net/http"
	domain "wekil_ai/Domain"
	domainInter "wekil_ai/Domain/Interfaces"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AgreementController struct {
	AgreementUseCase domainInter.IAgreementUseCase
}

// CreateAgreementRequest represents the expected JSON payload for creating an agreement.
type CreateAgreementRequest struct {
	Intake          *domain.Intake     `json:"intake"`
	Status          string             `json:"status"`
	PDFURL          string             `json:"pdf_url"`
	CreatorID       primitive.ObjectID `json:"creator_id"`
	AcceptorEmail   string             `json:"acceptor_email"`
	CreatorSigned   bool               `json:"creator_signed"`
}

// DuplicateAgreementRequest represents the expected JSON payload for duplicating an agreement.
type DuplicateAgreementRequest struct {
	OriginalAgreementID string `json:"original_agreement_id"`
	NewAcceptorEmail    string `json:"new_acceptor_email"`
	CallerID            string `json:"caller_id"`
}

// CreateAgreement implements domain.IAgreementController.
func (a *AgreementController) CreateAgreement(ctx *gin.Context) {
	var req CreateAgreementRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		// log.Printf("Error binding request body: %v", err)
		return
	}

	// Manual validation for ObjectId
	if req.CreatorID.IsZero() {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing or invalid creator_id"})
		return
	}
	if req.Intake == nil || req.Status == "" || req.PDFURL == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	newAgreement, err := a.AgreementUseCase.CreateAgreement(
		req.Intake,
		req.Status,
		req.PDFURL,
		req.CreatorID,
		req.AcceptorEmail,
		req.CreatorSigned,
	)
	if err != nil {
		// Map use case errors to appropriate HTTP status codes
		if err.Error() == "invalid agreement status" || err.Error() == "empty acceptor email found" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			// log.Printf("Error creating agreement: %v", err)
		}
		return
	}

	ctx.JSON(http.StatusCreated, newAgreement)
}

// DeleteAgreement implements domain.IAgreementController.
func (a *AgreementController) DeleteAgreement(ctx *gin.Context) {
	panic("unimplemented")
}

// DuplicateAgreement implements domain.IAgreementController.
func (a *AgreementController) DuplicateAgreement(ctx *gin.Context) {
	var req DuplicateAgreementRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		// log.Printf("Error binding request body: %v", err)
		return
	}

	// Validate and parse ObjectIDs
	originalAgreementID, err := primitive.ObjectIDFromHex(req.OriginalAgreementID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid original_agreement_id format"})
		return
	}
	callerID, err := primitive.ObjectIDFromHex(req.CallerID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid caller_id format"})
		return
	}

	// Call the use case to get the new draft and intake
	newIntake, newDraft, err := a.AgreementUseCase.DuplicateAgreement(originalAgreementID, req.NewAcceptorEmail, callerID)
	if err != nil {
		// Handle specific use case errors
		if err.Error() == "unauthorized access: only the original parties can duplicate this agreement" {
			ctx.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to duplicate agreement"})
			// log.Printf("Error duplicating agreement: %v", err)
		}
		return
	}

	// Return the new intake and draft to the frontend for PDF generation
	ctx.JSON(http.StatusOK, gin.H{
		"new_intake": newIntake,
		"new_draft":  newDraft,
	})
}

// GetAgreementByID implements domain.IAgreementController.
func (a *AgreementController) GetAgreementByID(ctx *gin.Context) {
	panic("unimplemented")
}

// GetAgreementByUserID implements domain.IAgreementController.
func (a *AgreementController) GetAgreementByUserID(ctx *gin.Context) {
	panic("unimplemented")
}

// SaveAgreement implements domain.IAgreementController.
func (a *AgreementController) SaveAgreement(ctx *gin.Context) {
	panic("unimplemented")
}

// SendAgreement implements domain.IAgreementController.
func (a *AgreementController) SendAgreement(ctx *gin.Context) {
	panic("unimplemented")
}

// SignitureHandling implements domain.IAgreementController.
func (a *AgreementController) SignitureHandling(ctx *gin.Context) {
	panic("unimplemented")
}

// UpdateAgreement implements domain.IAgreementController.
func (a *AgreementController) UpdateAgreement(ctx *gin.Context) {
	panic("unimplemented")
}

func NewAgreementController(agreementUseCase domainInter.IAgreementUseCase) domainInter.IAgreementController {
	return &AgreementController{
		AgreementUseCase: agreementUseCase,
	}
}
