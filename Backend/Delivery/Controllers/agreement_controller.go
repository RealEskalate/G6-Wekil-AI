package controllers

import (
	"github.com/gin-gonic/gin"
	domainInter "wekil_ai/Domain/Interfaces"
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
	panic("unimplemented")
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
