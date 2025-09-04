package domain

import (
	domain "wekil_ai/Domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type IAgreementUseCase interface {
	CreateAgreement(intake *domain.Intake, agreementStatus string, pdfURL string, creatorID primitive.ObjectID, acceptorEmail string, creatorSigned bool) (*domain.Agreement, error)
	//* we can send the agreement in the CreateAgreement() if the agreementStatus is PENDING
	SendAgreement(receiverEmail string, agreement *domain.Agreement) error // it will be saved on pending database
	SoftDeleteAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID) error
	UpdateAgreement(agreementID primitive.ObjectID, newAgreement *domain.Agreement) (*domain.Agreement, error)
	SignAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID) error    //? for the time being, only making the boolean TRUE or FALSE for both side
	DeclineAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID) error // change the status to DECLINED	
	GetAgreementByID(agreementID primitive.ObjectID, userID primitive.ObjectID) (*domain.Agreement, error)
	GetAgreementsByUserID(userID primitive.ObjectID, pageNumber int) ([]*domain.Agreement, error) // pagination
	GetAgreementsByUserIDAndFilter(userID primitive.ObjectID, pageNumber int, filter *domain.AgreementFilter) ([]*domain.Agreement, error) // pagination
	DuplicateAgreement(originalAgreementID primitive.ObjectID, newAcceptorEmail string, callerID primitive.ObjectID) (*domain.Intake, *domain.Draft, error)
}
