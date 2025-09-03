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

// CreateAgreement implements domain.IAgreementController.
func (a *AgreementController) CreateAgreement(ctx *gin.Context) {
	panic("unimplemented")
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
			"message": "Agreement signed successfully.",
		},
	})
}

// DuplicateAgreement implements domain.IAgreementController.
func (a *AgreementController) DuplicateAgreement(ctx *gin.Context) {
	panic("unimplemented")
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
