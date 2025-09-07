// Package main provides an example of an AI interaction layer using the
// official Google generativeai Go SDK to request a structured JSON response.
package infrastructure

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"
	domain "wekil_ai/Domain"
	domainInter "wekil_ai/Domain/Interfaces"
	"wekil_ai/config"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

const (
	_GEMINI_FLASH_2_5 = "gemini-2.5-flash"
	_GEMINI_FLASH_1_5 = "gemini-1.5-flash"
)

var _CURR_GEMINI_MODEL_USING = _GEMINI_FLASH_2_5

// AIClientPool manages a thread-safe pool of Gemini API clients.
type AIClientPool struct {
	clients      []*genai.Client
	currentIndex int
	mu           sync.Mutex
}

func (p *AIClientPool) getClient() *genai.Client {
	p.mu.Lock()
	defer p.mu.Unlock()

	client := p.clients[p.currentIndex]
	log.Printf("🤖 using %v th ai client 🤖 Out of total %v client in the pool\n", p.currentIndex, len(p.clients))
	p.currentIndex = (p.currentIndex + 1) % len(p.clients)
	return client
}

// AIInteraction encapsulates the generative AI models and the client pool.
type AIInteraction struct {
	clientPool           *AIClientPool
	IntakeModel          *genai.GenerativeModel
	ClassifierModel      *genai.GenerativeModel
	DocumentModel        *genai.GenerativeModel
	TitleGeneratingModel *genai.GenerativeModel
}

func extractJSON(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	raw = strings.TrimPrefix(raw, "```json")
	raw = strings.TrimPrefix(raw, "```")
	raw = strings.TrimSuffix(raw, "```")
	raw = strings.TrimSpace(raw)

	start := strings.Index(raw, "{")
	end := strings.LastIndex(raw, "}")
	if start == -1 || end == -1 || start >= end {
		return "", fmt.Errorf("no valid JSON object found in response: %s", raw)
	}
	return raw[start : end+1], nil
}

// NewAIInteraction creates and initializes a client pool and the
// generative models, configured for specific tasks.
func NewAIInteraction() (domainInter.IAIInteraction, error) {
	ctx := context.Background()

	// Read comma-separated API keys.
	apiKeysStr := config.GEMINI_API_KEYS
	if apiKeysStr == "" {
		log.Fatal("GEMINI_API_KEYS environment variable is not set or empty.")
	}

	apiKeys := strings.Split(apiKeysStr, ",")
	var clients []*genai.Client
	for _, key := range apiKeys {
		client, err := genai.NewClient(ctx, option.WithAPIKey(strings.TrimSpace(key)))
		if err != nil {
			log.Printf("Warning: Failed to create client with API key, will skip: %v", err)
			continue
		}
		clients = append(clients, client)
	}

	if len(clients) == 0 {
		return nil, fmt.Errorf("no valid Gemini clients could be created from the provided API keys")
	}

	clientPool := &AIClientPool{
		clients: clients,
	}

	// Create and configure all generative models.
	baseClient := clientPool.getClient()

	intakeModel := baseClient.GenerativeModel(_CURR_GEMINI_MODEL_USING)
	intakeModel.GenerationConfig = genai.GenerationConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"agreement_type": {Type: genai.TypeString},
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
				"due_dates":    {Type: genai.TypeArray, Items: &genai.Schema{Type: genai.TypeString, Format: "date-time"}},
				"start_date":   {Type: genai.TypeString, Format: "date-time"},
				"end_date":     {Type: genai.TypeString, Format: "date-time"},
				"services":     {Type: genai.TypeString},
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
					Type: genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"amount":       {Type: genai.TypeNumber, Description: "The amount to be paid per installments."},
						"payment_term": {Type: genai.TypeString, Description: "Repayment frequency (daily, weekly, monthly, quarterly)."},
						"due_date":     {Type: genai.TypeString, Format: "date-time", Description: "The due date for the first/next installments."},
					},
					Required: []string{"amount", "payment_term", "due_date"},
				},
				"late_fee_percent": {Type: genai.TypeNumber},
				"disclosingParty": {
					Type: genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"name":  {Type: genai.TypeString},
						"phone": {Type: genai.TypeString},
						"email": {Type: genai.TypeString},
					},
					Required: []string{"name"},
				},
				"receivingParty": {
					Type: genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"name":  {Type: genai.TypeString},
						"phone": {Type: genai.TypeString},
						"email": {Type: genai.TypeString},
					},
					Required: []string{"name"},
				},
				"isMutual":            {Type: genai.TypeBoolean},
				"effectiveDate":       {Type: genai.TypeString, Format: "date-time"},
				"confidentialityTerm": {Type: genai.TypeInteger},
				"purpose":             {Type: genai.TypeString},
			},
		},
	}

	classifierModel := baseClient.GenerativeModel(_CURR_GEMINI_MODEL_USING)
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

	documentModel := baseClient.GenerativeModel(_CURR_GEMINI_MODEL_USING)
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
							"heading": {Type: genai.TypeString, Description: "any heading that might be extracted"},
							"text":    {Type: genai.TypeString, Description: "this should be the body that precisley describes the heading"},
						},
						Required: []string{"heading", "text"},
					},
				},
				"signatures": {
					Type: genai.TypeObject,
					Properties: map[string]*genai.Schema{
						"place": {Type: genai.TypeString},
						"date":  {Type: genai.TypeString},
					},
					Required: []string{"place", "date"},
				},
			},
		},
	}

	titleGeneratingModel := baseClient.GenerativeModel(_GEMINI_FLASH_1_5)
	titleGeneratingModel.GenerationConfig = genai.GenerationConfig{
		ResponseMIMEType: "application/json",
		ResponseSchema: &genai.Schema{
			Type: genai.TypeObject,
			Properties: map[string]*genai.Schema{
				"title": {Type: genai.TypeString, Description: "take the first words to generate a title if you find it descriptive or "},
			},
			Required: []string{"title"},
		},
	}

	return &AIInteraction{
		clientPool:           clientPool,
		IntakeModel:          intakeModel,
		ClassifierModel:      classifierModel,
		DocumentModel:        documentModel,
		TitleGeneratingModel: titleGeneratingModel,
	}, nil
}

// GenerateIntake sends a request with a prompt and expects a structured
// JSON response, with retry logic for multiple API keys.
func (ai *AIInteraction) GenerateIntake(ctx context.Context, prompt string, language string) (*domain.Intake, error) {
	fullPrompt := fmt.Sprintf(
		"Extract the agreement details from the following text in %s language. "+
			"Include an explicit field `agreement_type` with value 'sale', 'service', 'loan', or 'nda' based on the text. "+
			"Rules: "+
			"- If agreement_type = 'loan', include an `installment` object with `amount`, `payment_term` (daily, weekly, monthly, quarterly), and `due_date`. "+
			"- If agreement_type = 'nda', include `disclosing_party` and `receiving_party`. "+
			"- For all other agreement types, omit these fields entirely. "+
			"Today is %s. Text: %s",
		language, time.Now().Format("2006-01-02"), prompt)

	parts := []genai.Part{genai.Text(fullPrompt)}

	var resp *genai.GenerateContentResponse
	var err error

	for i := 0; i < len(ai.clientPool.clients); i++ {
		// Create a new context with a 15-second timeout for this attempt
		timeoutCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
		defer cancel() // Ensure context is cancelled

		client := ai.clientPool.getClient()
		model := client.GenerativeModel(_CURR_GEMINI_MODEL_USING)
		model.GenerationConfig = ai.IntakeModel.GenerationConfig

		resp, err = model.GenerateContent(timeoutCtx, parts...)
		if err == nil {
			break // Success, exit the loop
		}
		log.Printf("Intake client failed, trying next client: %v", err)
	}

	if err != nil {
		return nil, fmt.Errorf("all API keys failed to generate intake content: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty response from the API")
	}

	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("response part is not of type genai.Text")
	}

	cleanJSON, err := extractJSON(string(jsonString))
	if err != nil {
		return nil, fmt.Errorf("failed to extract JSON: %w", err)
	}

	log.Println("🤖 ", _CURR_GEMINI_MODEL_USING, "\n", cleanJSON)

	var intakeResponse domain.Intake
	if err := json.Unmarshal([]byte(cleanJSON), &intakeResponse); err != nil {
		return nil, fmt.Errorf("error unmarshaling intake response JSON: %w\nRaw JSON: %s", err, cleanJSON)
	}

	return &intakeResponse, nil
}

// ClassifyDeal sends a prompt to a dedicated model instance to classify the deal type, with retry logic.
func (ai *AIInteraction) ClassifyDeal(ctx context.Context, text string) (*domain.ClassifierResult, error) {
	prompt := fmt.Sprintf(`Decide if this deal is basic (service, small sale, simple loan, simple NDA) or complex (employment, land/real estate, corporate shares, regulated sectors) based on the text. Return JSON: {category: \"basic|complex|unknown\", reasons: []}. Test: <<%s>>`,
		text)

	parts := []genai.Part{genai.Text(prompt)}

	var resp *genai.GenerateContentResponse
	var err error

	for i := 0; i < len(ai.clientPool.clients); i++ {
		timeoutCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
		defer cancel()

		client := ai.clientPool.getClient()
		model := client.GenerativeModel(_CURR_GEMINI_MODEL_USING)
		model.GenerationConfig = ai.ClassifierModel.GenerationConfig

		resp, err = model.GenerateContent(timeoutCtx, parts...)
		if err == nil {
			break
		}
		log.Printf("Classifier client failed, trying next client: %v", err)
	}

	if err != nil {
		return nil, fmt.Errorf("all API keys failed to generate classification content: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty classification response from the API")
	}

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

// GenerateDocumentDraft takes a structured domain.Draft object, ensures defaults,
// transforms it into JSON, and uses the AI client to generate a readable document draft.
func (ai *AIInteraction) GenerateDocumentDraft(ctx context.Context, intake *domain.Intake, language string) (*domain.Draft, error) {
	intakeJSON, err := json.MarshalIndent(intake, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("failed to marshal intake data to JSON: %w", err)
	}

	prompt := fmt.Sprintf(`
Fill this one-page template in simple %s language. Avoid legal jargon. Keep each section short (2–4 lines).

⚠️ Important:
1. The "title" must be short and descriptive, e.g., "Service Agreement", "Loan Agreement", "NDA". Do NOT include details in the title.
2. All other details must go into "sections". Example section headings:
    - Parties
    - Services (for service agreements)
    - Milestones (if applicable)
    - Payment / Installments
    - Duration
    - Termination / Other Terms
3. For all parties, use placeholders: "<<Party A>>", "<<Party B>>"
4. Signatures must use placeholders: { "party_a": "<<Signature>>", "party_b": "<<Signature>>", "place": "<<Place>>", "date": "<<Date>>" }
5. Include a disclaimer as the last section:
    { "heading": "Disclaimer", "text": "This document is for information only and is not legal advice. Consult a qualified lawyer." }

Input JSON (sensitive fields ignored): <<%s>>

Output format:
{
  "title": "short descriptive title here",
  "sections": [
    { "heading": "Parties", "text": "..." },
    { "heading": "Services", "text": "..." },
    { "heading": "Milestones", "text": "..." },
    { "heading": "Payment", "text": "..." },
    { "heading": "Duration", "text": "..." },
    { "heading": "Termination", "text": "..." },
    { "heading": "Disclaimer", "text": "..." }
  ],
  "signatures": {
    "party_a": "<<Signature>>",
    "party_b": "<<Signature>>",
    "place": "<<Place>>",
    "date": "<<Date>>"
  }
}

Today is: %s
`,
		language, string(intakeJSON), time.Now().Format("2006-01-02"))

	parts := []genai.Part{genai.Text(prompt)}

	var resp *genai.GenerateContentResponse

	for i := 0; i < len(ai.clientPool.clients); i++ {
		timeoutCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
		defer cancel()

		client := ai.clientPool.getClient()
		model := client.GenerativeModel(_CURR_GEMINI_MODEL_USING)
		model.GenerationConfig = ai.DocumentModel.GenerationConfig

		resp, err = model.GenerateContent(timeoutCtx, parts...)
		if err == nil {
			break
		}
		log.Printf("Document client failed, trying next client: %v", err)
	}

	if err != nil {
		return nil, fmt.Errorf("all API keys failed to generate document draft content: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty document draft response from the API")
	}

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
func (ai *AIInteraction) GenerateDraftFromPromptString(ctx context.Context, draftContent, promptText, language string) (*domain.Draft, error) {
	log.Println(draftContent, promptText, language)
	prompt := fmt.Sprintf(`
Generate a human-readable document draft in simple %s language based on the provided JSON input.
*don't return an explanation or thought process, just return the real body *
Instructions:
1.  Create a short, descriptive "title", such as "Service Agreement" or "Non-Disclosure Agreement." Do not include any details in the title.
2.  For the "sections" array, use the "Input Draft" information provided. Each top-level key should become a section's "heading", and its corresponding value should be the section's "text".
3.  Rewrite the "text" for each section to be simple, human-readable, and free of legal jargon. Keep each section short (2-4 lines).
4.  **Add any new sections specified in the user's prompt, rewriting their content in a simple, human-readable format.**
5.  Use placeholders for parties: "<<Party A>>", "<<Party B>>".
6.  Always include a "Disclaimer" section at the end with the text "This document is for information only and is not legal advice."
7.  The "signatures" object should be populated with the provided placeholders.

Input Draft: <<%s>>
User Prompt: %s

Output format:
{
  "title": "...",
  "sections": [
    {"heading": "...", "text": "..."},
    {"heading": "...", "text": "..."},
    {"heading": "Disclaimer", "text": "This document is for information only and is not legal advice."}
  ],
  "signatures": {"partyA":"<<Signature>>","partyB":"<<Signature>>","place":"<<Place>>","date":"<<Date>>"}
}
don't forget that the title should be precise and other informations are going to be added at the section with "heading", "text" pair
Today's date: %s
`, language, draftContent, promptText, time.Now().Format("2006-01-02"))

	parts := []genai.Part{genai.Text(prompt)}

	var resp *genai.GenerateContentResponse
	var genErr error

	for i := 0; i < len(ai.clientPool.clients); i++ {
		timeoutCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
		defer cancel()

		client := ai.clientPool.getClient()
		model := client.GenerativeModel(_CURR_GEMINI_MODEL_USING)
		model.GenerationConfig = ai.DocumentModel.GenerationConfig

		resp, genErr = model.GenerateContent(timeoutCtx, parts...)
		if genErr == nil {
			break
		}
		log.Printf("Draft from prompt client failed, trying next client: %v", genErr)
	}

	if genErr != nil {
		return nil, fmt.Errorf("all API keys failed to generate draft from prompt: %w", genErr)
	}

	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty draft response from the API")
	}

	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("draft response part is not of type genai.Text")
	}

	log.Println("🟢from the ai", string(jsonString))
	cleanJSON, err := extractJSON(string(jsonString))
	if err != nil {
		return nil, fmt.Errorf("failed to extract JSON: %w", err)
	}
	log.Println("🟢after extracting", cleanJSON)

	var result domain.Draft
	if err := json.Unmarshal([]byte(cleanJSON), &result); err != nil {
		return nil, fmt.Errorf("error unmarshaling draft JSON: %w\nRaw JSON: %s", err, cleanJSON)
	}
	log.Println("🟢 final returning", string(jsonString))

	return &result, nil
}

// GenerateDraftFromPrompt takes a structured domain.Draft object and uses an AI client
// to generate a human-readable document draft, with retry logic.
func (ai *AIInteraction) GenerateDraftFromPrompt(ctx context.Context, draft *domain.Draft, promptText, language string) (*domain.Draft, error) {
	if draft.Title == "" {
		draft.Title = "domain.Draft Agreement"
	}
	if len(draft.Sections) == 0 {
		draft.Sections = []domain.Section{
			{
				Heading: "Introduction",
				Text:    "This section introduces the purpose of the agreement and identifies the involved parties.",
			},
		}
	}
	if draft.Signatures.PartyA == "" || draft.Signatures.PartyB == "" {
		draft.Signatures = domain.Signatures{
			PartyA: "<<Signature>>",
			PartyB: "<<Signature>>",
			Place:  "<<Place>>",
			Date:   "<<Date>>",
		}
	}

	draftJSON, err := json.MarshalIndent(draft, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("failed to marshal draft to JSON: %w", err)
	}

	prompt := fmt.Sprintf(`
Fill this one-page template in simple %s. Avoid legal jargon. Keep sections short (2–4 lines).
- Title should be short and descriptive, e.g., "Service Agreement".
- Use placeholders for parties: "<<Party A>>", "<<Party B>>".
- Include all relevant sections based on agreement_type: %s.
- Always include the footer: "This document is for information only and is not legal advice."

Input domain.Draft JSON: <<%s>>

Output format:
{
  "title": "...",
  "sections": [{"heading": "...", "text": "..."}],
  "signatures": {"partyA":"<<Signature>>","partyB":"<<Signature>>","place":"<<Place>>","date":"<<Date>>"}
}

Today is: %s
`, language, draft.Title, string(draftJSON), time.Now().Format("2006-01-02"))

	parts := []genai.Part{genai.Text(prompt)}

	var resp *genai.GenerateContentResponse
	// var err error // This line is commented out as `err` is declared in the outer scope.

	for i := 0; i < len(ai.clientPool.clients); i++ {
		timeoutCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
		defer cancel()

		client := ai.clientPool.getClient()
		model := client.GenerativeModel(_CURR_GEMINI_MODEL_USING)
		model.GenerationConfig = ai.DocumentModel.GenerationConfig

		resp, err = model.GenerateContent(timeoutCtx, parts...)
		if err == nil {
			break
		}
		log.Printf("domain.Draft from prompt client failed, trying next client: %v", err)
	}

	if err != nil {
		return nil, fmt.Errorf("all API keys failed to generate draft from prompt: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return nil, fmt.Errorf("received an empty draft response from the API")
	}

	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return nil, fmt.Errorf("draft response part is not of type genai.Text")
	}

	cleanJSON, err := extractJSON(string(jsonString))
	if err != nil {
		return nil, fmt.Errorf("failed to extract JSON: %w", err)
	}

	var result domain.Draft
	if err := json.Unmarshal([]byte(cleanJSON), &result); err != nil {
		return nil, fmt.Errorf("error unmarshaling draft JSON: %w\nRaw JSON: %s", err, cleanJSON)
	}
	return &result, nil
}

func (ai *AIInteraction) TitleGenerateHelper(ctx context.Context, draftStringPrompt, language string) (string, error) {
	prompt := fmt.Sprintf(`Pick the first sentences in the following that will be used as a title for the following text in %s. Return a JSON object with a single key "title". Text: <<%s>>`,
		language,
		draftStringPrompt,
	)

	parts := []genai.Part{genai.Text(prompt)}

	var resp *genai.GenerateContentResponse
	var err error

	for i := 0; i < len(ai.clientPool.clients); i++ {
		timeoutCtx, cancel := context.WithTimeout(ctx, 15*time.Second)
		defer cancel()

		client := ai.clientPool.getClient()
		model := client.GenerativeModel(_GEMINI_FLASH_1_5)
		model.GenerationConfig = ai.TitleGeneratingModel.GenerationConfig

		resp, err = model.GenerateContent(timeoutCtx, parts...)
		if err == nil {
			break
		}
		log.Printf("Title generator client failed, trying next client: %v", err)
	}

	if err != nil {
		return "", fmt.Errorf("all API keys failed to generate title content: %w", err)
	}

	if resp == nil || len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil || len(resp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("received an empty title response from the API")
	}

	jsonString, ok := resp.Candidates[0].Content.Parts[0].(genai.Text)
	if !ok {
		return "", fmt.Errorf("title response part is not of type genai.Text")
	}

	cleanedJSON, err := extractJSON(string(jsonString))
	if err != nil {
		return "", fmt.Errorf("error extracting JSON from response: %w", err)
	}

	var result domain.JustForTitleSake
	if err := json.Unmarshal([]byte(cleanedJSON), &result); err != nil {
		return "", fmt.Errorf("error unmarshaling title response JSON: %w\nRaw JSON: %s", err, cleanedJSON)
	}
	return result.Title, nil
}
