package controllers

import (
	"context"
	"fmt"
	"log"
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
	Draft         *domain.Draft      `json:"draft"`
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
	log.Println("☑️", ctx.Query("page"))
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
	userStringID := ctx.GetString("user_id")
	userPrimitiveID, err := primitive.ObjectIDFromHex(userStringID)
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
	log.Printf("❓ => %#v\n", agreementFilter)
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
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request body",
				"details": err.Error(),
			},
		})
		// log.Printf("Error binding request body: %v", err)
		return
	}

	userIDValue := ctx.GetString("user_id")
	if userIDValue == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"data":    gin.H{"message": "User not authenticated"},
		})
		return
	}

	creatorID_, err := primitive.ObjectIDFromHex(userIDValue)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"data":    gin.H{"message": "Invalid user ID"},
		})
		return
	}
	req.CreatorID = creatorID_ // ASSIGN THE USER IT'S ID
	newIntakeFromDraft, err := a.AIInteraction.GenerateIntake(context.Background(), req.Draft.String(), domain.EnglishLang)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    gin.H{"message": "Missing required fields"},
		})
		return
	}
	// Validate other required fields
	log.Println("‼️\n", req)
	if newIntakeFromDraft == nil || req.Status == "" || req.PDFURL == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    gin.H{"message": "Missing required fields"},
		})
		return
	}

	newAgreement, err := a.AgreementUseCase.CreateAgreement(
		newIntakeFromDraft,
		req.Status,
		req.PDFURL,
		req.CreatorID,
		req.AcceptorEmail,
		req.CreatorSigned,
	)
	if err != nil {
		msg := "Internal server error"
		status := http.StatusInternalServerError
		if err.Error() == "invalid agreement status" || err.Error() == "empty acceptor email found" {
			msg = err.Error()
			status = http.StatusBadRequest
		}
		ctx.JSON(status, gin.H{
			"success": false,
			"data":    gin.H{"message": msg},
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"message":       "Agreement created successfully",
			"new_agreement": newAgreement,
		},
	})
}

// DeleteAgreement implements domain.IAgreementController.
func (a *AgreementController) DeleteAgreement(ctx *gin.Context) {
	var getID domain.GetAgreementID
	userStringID := ctx.GetString("user_id")
	if err := ctx.ShouldBindJSON(&getID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userPrimitiveID, err := primitive.ObjectIDFromHex(userStringID)
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
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request body",
				"details": err.Error(),
			},
		})
		// log.Printf("Error binding request body: %v", err)
		return
	}

	// Validate and parse ObjectIDs
	originalAgreementID, err := primitive.ObjectIDFromHex(req.OriginalAgreementID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data":    gin.H{"message": "Invalid original_agreement_id format"},
		})
		return
	}
	userIDValue, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"data":    gin.H{"message": "User not authenticated"},
		})
		return
	}
	callerID, ok := userIDValue.(primitive.ObjectID)
	if !ok || callerID.IsZero() {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"data":    gin.H{"message": "Invalid user ID"},
		})
		return
	}

	// Call the use case to get the new draft and intake
	newIntake, newDraft, err := a.AgreementUseCase.DuplicateAgreement(originalAgreementID, req.NewAcceptorEmail, callerID)
	if err != nil {
		msg := "Failed to duplicate agreement"
		status := http.StatusInternalServerError
		if err.Error() == "unauthorized access: only the original parties can duplicate this agreement" {
			msg = err.Error()
			status = http.StatusForbidden
		}
		ctx.JSON(status, gin.H{
			"success": false,
			"data":    gin.H{"message": msg},
		})
		return
	}

	// Return the new intake and draft to the frontend for PDF generation
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":    "Agreement duplicated successfully",
			"new_intake": newIntake,
			"new_draft":  newDraft,
		},
	})
}

// GetAgreementByID implements domain.IAgreementController.
func (a *AgreementController) GetAgreementByID(ctx *gin.Context) {

	var getID domain.GetAgreementID
	userStringID := ctx.GetString("user_id")
	if err := ctx.ShouldBindJSON(&getID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userPrimitiveID, err := primitive.ObjectIDFromHex(userStringID)
	log.Println("⚡", userPrimitiveID, err, "from userStringId", userStringID)
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
// ? with
func (a *AgreementController) GetAgreementByUserID(ctx *gin.Context) {
	userStringID := ctx.GetString("user_id")
	pageNumber, err := strconv.Atoi(ctx.Query("page"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload",
			},
		})
		return
	}
	userPrimitiveID, err := primitive.ObjectIDFromHex(userStringID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Invalid request payload (the ID wasn't correct format) / Unauthorized User",
			},
		})
		return
	}

	listAgr, err := a.AgreementUseCase.GetAgreementsByUserID(userPrimitiveID, pageNumber)
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
	log.Println("✅ in SaveAgreement")
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
	userStringID := ctx.GetString("user_id")
	ownerEmail := ctx.GetString("email")
	userID, err := primitive.ObjectIDFromHex(userStringID)
	log.Printf("%+v, %+v, %+v,\n", userStringID, ownerEmail, userID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
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
				"message": fmt.Sprintf("your agreement is complex | %s", res.Category),
				"error":   err.Error(),
			},
		})
		return
	}

	// create the intake form the draft
	intake, err := a.AIInteraction.GenerateIntake(context.Background(), aR.DraftText, aR.Language)
	log.Printf("✅ INTAKE RESULT \n%#v\n ERROR \n %#v\n", intake, err)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unable to create an Intake on your Draft",
			},
		})
		return
	}

	//?
	//? we need to generate a title for the agreement using the AI, but it have a risk of not generating the real title from the user draft
	theTitle, err := a.AIInteraction.TitleGenerateHelper(context.Background(), aR.DraftText, aR.Language)
	if err != nil {

		ctx.AbortWithStatusJSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unable to create Agreement Title",
				"error":   err.Error(),
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
	// direct injection of the title in the object
	aR.AgrementInfo.AgreementTitle = theTitle

	// pass the intake to the CreateAgreementSave
	passSave := &domain.JustForSaveSake{
		CreatorParty:     &domain.Party{Name: ctx.GetString("user_name"), ID: userID, Email: ownerEmail},
		AgreementReqeust: &aR,
		AcceptorEmail:    email_to_send,
	}
	agreement, err := a.AgreementUseCase.CreateAgreementSave(intake, passSave)
	log.Printf("✅ AGREEMENT RESULT \n%#v\n ERROR \n %#v\n", agreement, err)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"data": gin.H{
				"message": "Unable to create an Agreement",
			},
		})
		return
	}
	saved_ := ""
	if aR.AgrementInfo.Status == domain.PENDING_STATUS {
		saved_ = "and saved "
	}
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message":      fmt.Sprintf("Agreement draft saved %ssuccessfully.", saved_),
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
	userStringID := ctx.GetString("user_id")
	userID, err := primitive.ObjectIDFromHex(userStringID)
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

func NewAgreementController(agreementUseCase domainInter.IAgreementUseCase, aiInterface domainInter.IAIInteraction) domainInter.IAgreementController {
	return &AgreementController{
		AgreementUseCase: agreementUseCase,
		AIInteraction:    aiInterface,
	}
}
