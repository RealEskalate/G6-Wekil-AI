package controllers

import (
	"context"
	"net/http"
	"strconv"
	domain "wekil_ai/Domain"
	domainInter "wekil_ai/Domain/Interfaces"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AgreementController struct {
	AgreementUseCase domainInter.IAgreementUseCase
	AIInteraction    domainInter.IAIInteraction
}

// CreateAgreementRequest represents the expected JSON payload for creating an agreement.
type CreateAgreementRequest struct {
	Intake        *domain.Intake     `json:"intake"`
	Status        string             `json:"status"`
	PDFURL        string             `json:"pdf_url"`
	CreatorID     primitive.ObjectID `json:"creator_id"`
	AcceptorEmail string             `json:"acceptor_email"`
	CreatorSigned bool               `json:"creator_signed"`
}

// DuplicateAgreementRequest represents the expected JSON payload for duplicating an agreement.
type DuplicateAgreementRequest struct {
	OriginalAgreementID string `json:"original_agreement_id"`
	NewAcceptorEmail    string `json:"new_acceptor_email"`
	CallerID            string `json:"caller_id"`
}

// GetAgreementByFilter implements domain.IAgreementController.
// ?
func (a *AgreementController) GetAgreementByFilter(ctx *gin.Context) {
	pageNumber, err := strconv.Atoi(ctx.Query("page"))
	if err != nil {
		ctx.AbortWithStatusJSON(
			http.StatusBadRequest,
			gin.H{
				"success": false,
				"data": gin.H{
					"message": "Invalid request payload, | invalid page number",
				},
			},
		)
		return
	}
	userId := ctx.GetString("user_id")
	userPrimitiveID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format) / unautorized user access",
			},
		})
		return
	}

	agreementFilter := domain.AgreementFilter{
		AgreementType:       ctx.Query("type"),
		AgreementStatus:     ctx.Query("status"),
		AgreementPageNumber: pageNumber,
	}
	resList, err := a.AgreementUseCase.GetAgreementsByUserIDAndFilter(userPrimitiveID, agreementFilter.AgreementPageNumber, &agreementFilter)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"success": false,
			"data": gin.H{
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resList,
	},
	)

}

// CreateAgreement implements domain.IAgreementController.
func (a *AgreementController) CreateAgreement(ctx *gin.Context) {
	var req CreateAgreementRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		// log.Printf("Error binding request body: %v", err)
		return
	}

	userIDValue, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	creatorID, ok := userIDValue.(primitive.ObjectID) // Assuming you use MongoDB ObjectID
	if !ok || creatorID.IsZero() {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
		return
	}

	// Validate other required fields
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
	var getID domain.GetAgreementID
	userId := ctx.GetString("user_id")
	if err := ctx.ShouldBindJSON(&getID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userPrimitiveID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format) / unautorized user access",
			},
		})
		return
	}
	agreementID, err := primitive.ObjectIDFromHex(getID.AgreementID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format)",
			},
		})
		return
	}

	if err := a.AgreementUseCase.SoftDeleteAgreement(agreementID, userPrimitiveID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Agreement deleted successfully.",
		},
	})
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

	var getID domain.GetAgreementID
	userId := ctx.GetString("user_id")
	if err := ctx.ShouldBindJSON(&getID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userPrimitiveID, err := primitive.ObjectIDFromHex(userId)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format) / Unauthorized User",
			},
		})
		return
	}
	agreementID, err := primitive.ObjectIDFromHex(getID.AgreementID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format) / invalid agreement ID",
			},
		})
		return
	}
	res, err := a.AgreementUseCase.GetAgreementByID(agreementID, userPrimitiveID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(
		http.StatusOK,
		gin.H{
			"success": true,
			"data":    res,
		},
	)
}

// GetAgreementByUserID implements domain.IAgreementController.
// ? this one is only for pagination purpose
func (a *AgreementController) GetAgreementByUserID(ctx *gin.Context) {
	userId := ctx.GetString("user_id")
	var agreementFilter domain.AgreementFilter
	if err := ctx.ShouldBindJSON(&agreementFilter); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userPrimitiveID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format) / Unauthorized User",
			},
		})
		return
	}

	listAgr, err := a.AgreementUseCase.GetAgreementsByUserID(userPrimitiveID, agreementFilter.AgreementPageNumber)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"success": false,
			"data": gin.H{
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"succes": true,
		"data":   listAgr,
	})

}

// SaveAgreement implements domain.IAgreementController.
func (a *AgreementController) SaveAgreement(ctx *gin.Context) {
	var aR domain.AgreementRequest
	if err := ctx.ShouldBindJSON(&aR); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userId := ctx.GetString("user_id")
	ownerEmail := ctx.GetString("email")
	userID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		ctx.AbortWithStatusJSON(400, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unautorized user",
			},
		})
		return
	}
	// check the complexity
	res, err := a.AIInteraction.ClassifyDeal(context.Background(), aR.DraftText)
	if err != nil || res.Category != "basic" {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"message": "your agreement is complex",
			},
		})
		return
	}

	// create the intake form the draft
	intake, err := a.AIInteraction.GenerateIntake(context.Background(), aR.DraftText, domain.EnglishLang)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unable to create an Intake on your Draft",
			},
		})
		return
	}
	// manual selection on the email of party b
	email_to_send := ""
	if ownerEmail == aR.AgrementInfo.PartyA.Email {
		email_to_send = aR.AgrementInfo.PartyB.Email
	} else {
		email_to_send = aR.AgrementInfo.PartyA.Email
	}

	// pass the intake to the CreateAgreement
	agreement, err := a.AgreementUseCase.CreateAgreement(intake, aR.AgrementInfo.Status, aR.AgrementInfo.PDFURL, userID, email_to_send, aR.AgrementInfo.CreatorSigned)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unable to create an Agreement",
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":      "Agreement draft saved successfully.",
			"agreement_id": agreement.ID.Hex(),
		},
	})
}

// SendAgreement implements domain.IAgreementController.
func (a *AgreementController) SendAgreement(ctx *gin.Context) {
	panic("unimplemented")
}

// SignitureHandling implements domain.IAgreementController.
func (a *AgreementController) SignitureHandling(ctx *gin.Context) {
	var signRequest domain.SignitureRequest
	// fetching the signRequest from the clinet
	if err := ctx.ShouldBindJSON(&signRequest); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	// changing the string to primitive object id both ⬇️
	agrementID, err := primitive.ObjectIDFromHex(signRequest.AgreementID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format)",
			},
		})
		return
	}
	userId := ctx.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unautorized user",
			},
		})
		return
	}
	if signRequest.DeclineRequest == signRequest.SignRequest {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Validation Error: only one of `decline_request` or `sign_request` must be enabled.",
			},
		})
		return
	}
	if err := a.AgreementUseCase.SignAgreement(agrementID, userID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotModified, gin.H{
			"success": false,
			"data": gin.H{
				"message": err.Error(),
			},
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Agreement signed successfully.",
		},
	})
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
