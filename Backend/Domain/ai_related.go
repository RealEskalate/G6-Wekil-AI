package domain

// These models are designed to correspond with the JSON outputs described in the prompts.

import "time"

// --- Model A: Classifier Prompt ---

// ClassifierResult represents the JSON output for the classifier prompt.
// It categorizes a deal and provides reasons for the classification.
const (
	AmharicLang = "amharic"
	EnglishLang = "engish"
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
type Intake struct {
	// Common fields
	Parties     []Party     `json:"parties"`
	Location    string      `json:"location"`
	Currency    string      `json:"currency"`
	TotalAmount float64     `json:"total_amount,omitempty"`
	DueDates    []time.Time `json:"due_dates"`
	StartDate   time.Time   `json:"start_date"`
	EndDate     time.Time   `json:"end_date"`

	// Service-specific fields
	Services   string      `json:"services,omitempty"`
	Milestones []Milestone `json:"milestones,omitempty"`
	Revisions  int         `json:"revisions,omitempty"`

	// Sale-specific fields
	Goods         []Goods `json:"goods,omitempty"`
	DeliveryTerms string  `json:"delivery_terms,omitempty"`

	// Loan-specific fields
	Principal      float64       `json:"principal,omitempty"`
	Installments   []Installment `json:"installments,omitempty"`
	LateFeePercent float64       `json:"late_fee_percent,omitempty"`

	//! NON DISCLOSURE IS SUPPOSTED TO BE HERE
}

// Party represents a party involved in the agreement.
type Party struct {
	Name  string `json:"name"`
	Phone string `json:"phone,omitempty"`
	Email string `json:"email,omitempty"`
}

// Milestone represents a milestone in a service agreement.
type Milestone struct {
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
}

// Goods represents an item in a sale agreement.
type Goods struct {
	Item      string  `json:"item"`
	Quantity  int     `json:"qty"`
	UnitPrice float64 `json:"unit_price"`
}

// Installment represents a single payment in a loan agreement.
type Installment struct {
	Amount  float64   `json:"amount"`
	DueDate time.Time `json:"due_date"`
}

// --- Model C: Draft Fill Prompt ---

// Draft represents the structured output for filling a template.
// It is broken down into sections and signature details.
type Draft struct {
	Title      string     `json:"title"`
	Sections   []Section  `json:"sections"`
	Signatures Signatures `json:"signatures"`
}

// Section represents a heading and text block within the draft.
type Section struct {
	Heading string `json:"heading"`
	Text    string `json:"text"`
}

// Signatures represents the signature block of the draft document.
type Signatures struct {
	PartyA string `json:"partyA"` // signiture svg url
	PartyB string `json:"partyB"` // signiture svg url
	Place  string `json:"place"`
	Date   string `json:"date"`
}
