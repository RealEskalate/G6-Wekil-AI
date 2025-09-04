package domain

import "github.com/gin-gonic/gin"

type IAgreementController interface {
	CreateAgreement(ctx *gin.Context)
	DeleteAgreement(ctx *gin.Context)
	DuplicateAgreement(ctx *gin.Context)
	GetAgreementByID(ctx *gin.Context)
	// this is where pagination will be passed
	GetAgreementByUserID(ctx *gin.Context)
	SaveAgreement(ctx *gin.Context)
	UpdateAgreement(ctx *gin.Context)
	SendAgreement(ctx *gin.Context)
	// used for both accepting and declining an agreement //? I don't want to assign two different end-points for simmilar interaction
	SignitureHandling(ctx *gin.Context)
	GetAgreementByFilter(ctx *gin.Context)
	
}
