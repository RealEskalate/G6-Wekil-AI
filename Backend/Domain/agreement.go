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
	ID                  primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	IntakeID            primitive.ObjectID `json:"intake_id" bson:"intake_id,omitempty"`
	AgreementType       string             `json:"agreement_type" bson:"agreement_type"`
	AgreementTitle      string             `json:"agreement_title" bson:"agreement_title,omitempty"`
	PDFURL              string             `json:"pdf_url" bson:"pdf_url,omitempty"`
	CreatorID           primitive.ObjectID `json:"creator_id" bson:"creator_id"`
	AcceptorID          primitive.ObjectID `json:"acceptor_id" bson:"acceptor_id"`
	CreatorSigned       bool               `json:"creator_signed" bson:"creator_signed,omitempty"`
	AcceptorSigned      bool               `json:"acceptor_signed" bson:"acceptor_signed,omitempty"`
	Status              string             `json:"status" bson:"status,omitempty"`
	CreatedAt           time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt           time.Time          `json:"updated_at" bson:"updated_at"`
	IsDeletedByCreator  bool               `bson:"is_deleted_by_creator" json:"is_deleted_by_creator"`
	IsDeletedByAcceptor bool               `bson:"is_deleted_by_acceptor" json:"is_deleted_by_acceptor"`
	DeletedAt           time.Time          `json:"deleted_at" bson:"deleted_at"`
	// IsDeleted           bool               `json:"is_deleted,omitempty" bson:"is_deleted,omitempty"` //? I don't know for sure if we need this one anymore. since we can achive the same logic by using IsDeletedByCreator && IsDeletedByAcceptor
}

// ? Blow this the data_modles are going to be helper of the agreement concept
type SignitureRequest struct {
	AgreementID    string `json:"agreement_id"`
	DeclineRequest bool   `json:"decline_request"`
	SignRequest    bool   `json:"sign_request"`
}

type GetAgreementID struct {
	AgreementID string `json:"agreement_id"`
}
type AgreementFilter struct {
	AgreementType       string `json:"agreement_type"`
	AgreementStatus     string `json:"agreement_status"`
	AgreementPageNumber int    `json:"agreement_page_number"`
}

type PendingAgreement struct {
	AgreementID   primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	CreatorID     primitive.ObjectID `json:"creator_id" bson:"creator_id"`
	AcceptorEmail string             `json:"email" bson:"email"`
}

// Party represents a person or entity involved in an agreement.
type PartyDTO struct {
	Name  string `json:"name" bson:"name"`
	Email string `json:"email" bson:"email"`
	Phone string `json:"phone,omitempty" bson:"phone,omitempty"`
}

// AgreementRequestDTO holds the metadata for an agreement.
type AgreementRequestDTO struct {
	AgreementType  string   `json:"agreement_type" bson:"agreement_type"`
	AgreementTitle string   `json:"agreement_title" bson:"agreement_title,omitempty"`
	PDFURL         string   `json:"pdf_url" bson:"pdf_url,omitempty"`
	CreatorSigned  bool     `json:"creator_signed" bson:"creator_signed,omitempty"`
	Status         string   `json:"status" bson:"status,omitempty"`
	PartyA         PartyDTO `json:"party_a" bson:"party_a,omitempty"`
	PartyB         PartyDTO `json:"party_b" bson:"party_b,omitempty"`
}

// AgreementSaveRequest combines the agreement metadata and the draft text for saving.
type AgreementRequest struct {
	AgrementInfo *AgreementRequestDTO `json:"agreement"`
	DraftText    string               `json:"draft_text"`
	Language     string               `json:"language"`
}
type JustForSaveSake struct {
	CreatorParty     *Party
	AgreementReqeust *AgreementRequest
	AcceptorEmail    string
}
