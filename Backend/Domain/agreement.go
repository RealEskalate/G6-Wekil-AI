package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	SIGNED_STATUS   = "SIGNED"
	DRAFT_STATUS    = "DRAFT"
	PENDING_STATUS  = "PENDING"
	REJECTED_STATUS = "REJECTED"
)

// Agreement represents a digital agreement record.
type Agreement struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	IntakeID   primitive.ObjectID `json:"intake_id,omitempty" bson:"intake_id,omitempty"`
	PDFURL     string             `json:"pdf_url,omitempty" bson:"pdf_url,omitempty"`
	CreatorID  primitive.ObjectID `json:"creator_id" bson:"creator_id"`
	AcceptorID primitive.ObjectID `json:"acceptor_id" bson:"acceptor_id"`
	Status     string             `json:"status,omitempty" bson:"status,omitempty"`
	CreatedAt  time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt  time.Time          `json:"updated_at" bson:"updated_at"`
	IsDeleted  bool               `json:"is_deleted,omitempty" bson:"is_deleted,omitempty"`
	DeletedAt  time.Time          `json:"deleted_at" bson:"deleted_at"`
}

type PendingAgreement struct {
	AgreementID   primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	CreatoryID    primitive.ObjectID `json:"creator_id" bson:"creator_id"`
	AcceptorEmail string             `json:"email" bson:"email"`
}
