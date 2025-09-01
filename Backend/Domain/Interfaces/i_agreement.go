package domain

import (
	"context"
	domain "wekil_ai/Domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type IAgreementRepo interface {
	SaveAgreement(ctx context.Context, agreement *domain.Agreement) (*domain.Agreement, error)
	GetAgreement(ctx context.Context, agreementID primitive.ObjectID) (*domain.Agreement, error)
	UpdateAgreement(ctx context.Context, agreementID primitive.ObjectID, agreement *domain.Agreement) (*domain.Agreement, error)
}

type IPendingAgreementRepo interface {
	CreatePendingAgreement(ctx context.Context, pendAgree *domain.PendingAgreement) (*domain.PendingAgreement, error)
	GetPendingAgreement(ctx context.Context, pendAgreeID primitive.ObjectID) (*domain.PendingAgreement, error)
	DeletePendingAgreement(ctx context.Context, pendAgreeID primitive.ObjectID) error
}
