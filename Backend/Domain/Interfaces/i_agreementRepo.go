package domain

import (
	"context"
	domain "wekil_ai/Domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type IAgreementRepo interface { //! don't forget to add a DeleteAgreement() for tihs, based on time stamp of the deletedAT
	SaveAgreement(ctx context.Context, agreement *domain.Agreement) (*domain.Agreement, error)
	GetAgreement(ctx context.Context, agreementID primitive.ObjectID) (*domain.Agreement, error)
	UpdateAgreement(ctx context.Context, agreementID primitive.ObjectID, agreement *domain.Agreement) (*domain.Agreement, error)
	GetAgreementsByPartyID(ctx context.Context, ownerID primitive.ObjectID, pageNumber int) ([]*domain.Agreement, error)
	GetAgreementsByFilterAndPartyID(ctx context.Context, ownerID primitive.ObjectID, pageNumber int, filter *domain.AgreementFilter) ([]*domain.Agreement, error)
}

type IPendingAgreementRepo interface {
	CreatePendingAgreement(ctx context.Context, pendAgree *domain.PendingAgreement) (*domain.PendingAgreement, error)
	GetPendingAgreement(ctx context.Context, pendAgreeID primitive.ObjectID) (*domain.PendingAgreement, error)
	DeletePendingAgreement(ctx context.Context, pendAgreeID primitive.ObjectID) error
}

type IIntakeRepo interface {
	StoreIntake(ctx context.Context, intake *domain.Intake) (*domain.Intake, error)
	DeleteIntake(ctx context.Context, intakeID primitive.ObjectID) error
	GetIntake(ctx context.Context, intakeID primitive.ObjectID) (*domain.Intake, error)
	UpdateIntake(ctx context.Context, intakeID primitive.ObjectID, intake *domain.Intake) (*domain.Intake, error)
}
