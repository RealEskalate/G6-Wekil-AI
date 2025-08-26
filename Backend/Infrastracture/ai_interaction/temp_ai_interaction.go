// Package main provides an example of an AI interaction layer using the
// official Google generativeai Go SDK to request a structured JSON response.
package infrastructure

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

// domain.ClassifierResult represents the structured JSON response from the classifier prompt.

// domain.Draft represents the structured JSON response for the document template.

// AIInteraction encapsulates the generative AI clients for different tasks.
type AIInteraction struct {
	IntakeClient     *genai.GenerativeModel
	ClassifierClient *genai.GenerativeModel
	DocumentClient   *genai.GenerativeModel
}

// NewAIInteraction creates and initializes clients for the Gemini API.
func NewAIInteraction(apiKey string) (domainInterface.IAIInteraction, error) {
	ctx := context.Background()

	// Create a new base client with the API key.
	baseClient, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %w", err)
	}

	// 1. Initialize and configure the client for the Intake task.
	intakeModel := baseClient.GenerativeModel("gemini-2.5-flash")
	intakeModel.GenerationConfig = genai.GenerationConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"parties": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"name":  {Type: genai.TypeString},
							"phone": {Type: genai.TypeString},
							"email": {Type: genai.TypeString},
						},
						Required: []string{"name"},
					},
				},
				"location":     {Type: genai.TypeString},
				"currency":     {Type: genai.TypeString},
				"total_amount": {Type: genai.TypeNumber},
				"due_dates": {
					Type:  genai.TypeArray,
					Items: &genai.Schema{Type: genai.TypeString, Format: "date-time"},
				},
				"start_date": {Type: genai.TypeString, Format: "date-time"},
				"end_date":   {Type: genai.TypeString, Format: "date-time"},
				"services":   {Type: genai.TypeString},
				"milestones": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"description": {Type: genai.TypeString},
							"date":        {Type: genai.TypeString, Format: "date-time"},
						},
						Required: []string{"description", "date"},
					},
				},
				"revisions": {Type: genai.TypeInteger},
				"goods": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"item":       {Type: genai.TypeString},
							"qty":        {Type: genai.TypeInteger},
							"unit_price": {Type: genai.TypeNumber},
						},
						Required: []string{"item", "qty", "unit_price"},
					},
				},
				"delivery_terms": {Type: genai.TypeString},
				"principal":      {Type: genai.TypeNumber},
				"installments": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"amount":   {Type: genai.TypeNumber},
							"due_date": {Type: genai.TypeString, Format: "date-time"},
						},
						Required: []string{"amount", "due_date"},
					},
				},
				"late_fee_percent": {Type: genai.TypeNumber},
			},
		},
	}

	// 2. Initialize and configure the client for the Classification task.
	classifierModel := baseClient.GenerativeModel("gemini-2.5-flash")
	classifierModel.GenerationConfig = genai.GenerationConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"category": {
					Type: genai.TypeString,
					Enum: []string{"basic", "complex", "unknown"},
				},
				"reasons": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeString,
					},
				},
			},
		},
	}

	// 3. Initialize and configure the client for the Document Draft task.
	// This configuration uses the schema from the 'Draft' model to ensure a structured JSON response.
	documentModel := baseClient.GenerativeModel("gemini-2.5-flash")
	documentModel.GenerationConfig = genai.GenerationConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"title": {Type: genai.TypeString},
				"sections": {
					Type: genai.TypeArray,
					Items: &genai.Schema{
						Type: genai.TypeObject,
						Properties: map[string]*genai.Schema{
							"heading": {Type: genai.TypeString},
							"text":    {Type: genai.TypeString},
						},
						Required: []string{"heading", "text"},
					},
				},
				"signatures": {
					Type: genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"partyA": {Type: genai.TypeString},
						"partyB": {Type: genai.TypeString},
						"place":  {Type: genai.TypeString},
						"date":   {Type: genai.TypeString},
					},
					Required: []string{"partyA", "partyB", "place", "date"},
				},
			},
		},
	}

	return &AIInteraction{
		IntakeClient:     intakeModel,
		ClassifierClient: classifierModel,
		DocumentClient:   documentModel,
	}, nil
}

// GenerateIntake sends a request with a prompt and expects a structured
// JSON response. It then unmarshals the response into the desired Go struct.
func (ai *AIInteraction) GenerateIntake(ctx context.Context, prompt string, language string) (*domain.Intake, error) {
	fullPrompt := fmt.Sprintf("Extract the following information from this in the language of %s text: %s   TODAY IS %s  ", language, prompt, time.Now().Format("2006-01-02"))
	parts := []genai.Part{genai.Text(fullPrompt)}

	// Send the request and get the response. The SDK handles all HTTP details.
	resp, err := ai.IntakeClient.GenerateContent(ctx, parts...)
	if err != nil {
		return nil, fmt.Errorf("failed to generate content: %w", err)
	}

	// Check for a valid response and content.
	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty response from the API")
	}

	// The SDK returns the raw JSON string as Text. Unmarshal it directly.
	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("response part is not of type genai.Text")
	}

	var intakeResponse domain.Intake
	if err := json.Unmarshal([]byte(jsonString), &intakeResponse); err != nil {
		return nil, fmt.Errorf("error unmarshaling response JSON: %w\nRaw JSON: %s", err, jsonString)
	}

	return &intakeResponse, nil
}

// ClassifyDeal sends a prompt to a dedicated model instance to classify the deal type.
// It returns a structured domain.ClassifierResult.
func (ai *AIInteraction) ClassifyDeal(ctx context.Context, text string) (*domain.ClassifierResult, error) {
	// Define the specific prompt for this classification task.
	prompt := fmt.Sprintf(`Decide if this deal is basic (service, small sale, simple loan, simple NDA) or complex (employment, land/real estate, corporate shares, regulated sectors) based on the text. Return JSON: {category: \"basic|complex|unknown\", reasons: []}. 
	Test: <<%s>>`,
		text)

	parts := []genai.Part{genai.Text(prompt)}

	// Send the request.
	resp, err := ai.ClassifierClient.GenerateContent(ctx, parts...)
	if err != nil {
		return nil, fmt.Errorf("failed to generate classification content: %w", err)
	}

	// Check for a valid response.
	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty classification response from the API")
	}

	// The SDK returns the raw JSON string as Text. Unmarshal it directly.
	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("classification response part is not of type genai.Text")
	}

	var result domain.ClassifierResult
	if err := json.Unmarshal([]byte(strings.TrimSpace(string(jsonString))), &result); err != nil {
		return nil, fmt.Errorf("error unmarshaling classification response JSON: %w\nRaw JSON: %s", err, jsonString)
	}

	return &result, nil
}

// GenerateDocumentDraft takes a structured Intake object, transforms it into a JSON prompt,
// and uses an AI client to generate a human-readable document draft.
func (ai *AIInteraction) GenerateDocumentDraft(ctx context.Context, intake *domain.Intake, language string) (*domain.Draft, error) {
	// Marshal the intake object into a JSON string to be included in the prompt.
	intakeJSON, err := json.MarshalIndent(intake, "", "  ")
	fmt.Println("=> json: ", string(intakeJSON)) //! don't forget to delete
	if err != nil {
		return nil, fmt.Errorf("failed to marshal intake data to JSON: %w", err)
	}

	// Define the prompt for the AI.
	prompt := fmt.Sprintf(`
		Fill this one-page template in simple with language of %s. Avoid legal jargon. Keep each section short (2–4 lines).
		Always include this footer: 'This document is for information only and is not legal advice. Consult a qualified lawyer for legal matters.'
		Input JSON: <<%s>>
		Output: sections as JSON: {title, sections:[{heading,text}], signatures:{partyA,partyB,place,date}} and TODAY IS: %s`,
		language, string(intakeJSON), time.Now().Format("2006-01-02"))

	parts := []genai.Part{genai.Text(prompt)}

	// Send the request to the dedicated document client.
	resp, err := ai.DocumentClient.GenerateContent(ctx, parts...)
	if err != nil {
		return nil, fmt.Errorf("failed to generate document draft content: %w", err)
	}

	// Check for a valid response.
	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty document draft response from the API")
	}

	// The SDK returns the raw JSON string as Text. Unmarshal it directly.
	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("document draft response part is not of type genai.Text")
	}

	var draft domain.Draft
	if err := json.Unmarshal([]byte(strings.TrimSpace(string(jsonString))), &draft); err != nil {
		return nil, fmt.Errorf("error unmarshaling document draft response JSON: %w\nRaw JSON: %s", err, jsonString)
	}

	return &draft, nil
}
