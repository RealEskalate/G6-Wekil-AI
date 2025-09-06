package domain

// These models are designed to correspond with the JSON outputs described in the prompts.

import (
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// --- Model A: Classifier Prompt ---

// ClassifierResult represents the JSON output for the classifier prompt.
// It categorizes a deal and provides reasons for the classification.
const (
	AmharicLang = "amharic"
	EnglishLang = "engish"
)

const (
	SALE    = "sale"
	SERVICE = "service"
	LOAN    = "loan"
	NDA     = "nda"
)

type ClassifierResult struct {
	Category string   `json:"category"`
	Reasons  []string `json:"reasons"`
}

// --- Model B: Intake Extraction Prompt ---

// Intake represents the data extracted from a basic agreement text.
// The fields are a union of all possible fields for 'Service', 'Sale', and 'Loan' agreements.
// The 'omitempty' tag ensures that fields that are not present for a specific agreement type
// are not included in the final JSON output.

// Intake represents the main agreement document.
type Intake struct {
	ID primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`

	// Common fields
	AgreementType string    `json:"agreement_type,omitempty" bson:"agreement_type,omitempty"` // "sale" | "service" | "loan" | "nda"
	Parties       []Party   `json:"parties" bson:"parties"`                                   // 0 disclosing party | 1 reciving party
	Location      string    `json:"location" bson:"location"`
	Currency      string    `json:"currency" bson:"currency"`
	TotalAmount   float64   `json:"total_amount,omitempty" bson:"total_amount,omitempty"`
	StartDate     time.Time `json:"start_date" bson:"start_date"`
	EndDate       time.Time `json:"end_date" bson:"end_date"`

	// Service-specific fields
	Services   string      `json:"services,omitempty" bson:"services,omitempty"`
	Milestones []Milestone `json:"milestones,omitempty" bson:"milestones,omitempty"`
	Revisions  int         `json:"revisions,omitempty" bson:"revisions,omitempty"`

	// Sale-specific fields
	Goods         []Goods `json:"goods,omitempty" bson:"goods,omitempty"`
	DeliveryTerms string  `json:"delivery_terms,omitempty" bson:"delivery_terms,omitempty"`

	// Loan-specific fields
	Principal      float64       `json:"principal,omitempty" bson:"principal,omitempty"`
	Installments   *Installment `json:"installments,omitempty" bson:"installments,omitempty"`
	LateFeePercent float64       `json:"late_fee_percent,omitempty" bson:"late_fee_percent,omitempty"`

	// NDA fields
	//! the below two should be deleted, but since they are creating  error in ai_usecase.go they are here for the time being
	DisclosingParty     *Party    `json:"disclosing_party,omitempty" bson:"disclosing_party,omitempty"` // The one spilling the beans.
	ReceivingParty      *Party    `json:"receiving_party,omitempty" bson:"receiving_party,omitempty"`   // The one promising to keep quiet.
	IsMutual            bool      `json:"is_mutual,omitempty" bson:"is_mutual,omitempty"`
	EffectiveDate       time.Time `json:"effective_date,omitempty" bson:"effective_date,omitempty"`
	ConfidentialityTerm int       `json:"confidentiality_term,omitempty" bson:"confidentiality_term,omitempty"`
	Purpose             string    `json:"purpose,omitempty" bson:"purpose,omitempty"`
}

// Party represents a party involved in the agreement.
type Party struct {
	ID    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name  string             `json:"name" bson:"name"`
	Phone string             `json:"phone" bson:"phone,omitempty"`
	Email string             `json:"email" bson:"email,omitempty"`
}

// Milestone represents a milestone in a service agreement.
type Milestone struct {
	Description string    `json:"description" bson:"description"`
	Date        time.Time `json:"date" bson:"date"`
}

// Goods represents an item in a sale agreement.
type Goods struct {
	Item      string  `json:"item" bson:"item"`
	Quantity  int     `json:"qty" bson:"qty"`
	UnitPrice float64 `json:"unit_price" bson:"unit_price"`
}

// Installment represents a single payment in a loan agreement.
type Installment struct {
	Amount      float64   `json:"amount"`
	PaymentTerm string    `json:"payment_term"`
	DueDate     time.Time `json:"due_date"`
}

// --- Model C: Draft Fill Prompt ---

// Draft represents the structured output for filling a template.
// It is broken down into sections and signature details.
type Draft struct {
	Title      string     `json:"title" bson:"title"`
	Sections   []Section  `json:"sections" bson:"sections"`
	Signatures Signatures `json:"signatures" bson:"signatures"`
}

func (b Draft) String() string { //? patching for The CreateAgreement end-point
	sections := ""
	for _, each_section := range b.Sections {
		heading := each_section.Heading
		txt := each_section.Text
		sections += (heading + "\n")
		sections += (txt + "\n")
	}
	return fmt.Sprintf("Title: %s\n %s ", b.Title, sections)
}

// Section represents a heading and text block within the draft.
type Section struct {
	Heading string `json:"heading" bson:"heading"`
	Text    string `json:"text" bson:"text"`
}

// Signatures represents the signature block of the draft document.
type Signatures struct {
	PartyA string `json:"party_a" bson:"party_a"` // signiture svg url
	PartyB string `json:"party_b" bson:"party_b"` // signiture svg url
	Place  string `json:"place" bson:"place"`
	Date   string `json:"date" bson:"date"`
}

type JustForTitleSake struct {
	Title string `json:"title"`
}
