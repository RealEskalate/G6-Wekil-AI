package usecases

import (
	"context"
	"strings"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AIUsecase struct {
	aiRepo domainInterface.IAIInteraction
}

func NewAIUsecase(aiRepo domainInterface.IAIInteraction) *AIUsecase {
	return &AIUsecase{
		aiRepo: aiRepo,
	}
}

func (u *AIUsecase) replacePartyPlaceholders(draft *domain.Draft, parties []domain.Party) {
	if len(parties) < 2 {
		return
	}

	var disclosingName, receivingName string
	if len(parties) > 0 {
		disclosingName = parties[0].Name
	}
	if len(parties) > 1 {
		receivingName = parties[1].Name
	}

	for i := range draft.Sections {
		draft.Sections[i].Text = strings.ReplaceAll(draft.Sections[i].Text, "<<Party A>>", disclosingName)
		draft.Sections[i].Text = strings.ReplaceAll(draft.Sections[i].Text, "<<Party B>>", receivingName)
	}

	draft.Signatures.PartyA = disclosingName
	draft.Signatures.PartyB = receivingName
}

// Extract key intake information
func (u *AIUsecase) Extract(ctx context.Context, text, language string) (*domain.Intake, error) {
	result, err := u.aiRepo.GenerateIntake(ctx, text, language)
	if err != nil {
		return nil, err
	}

	result.ID = primitive.NewObjectID()

	if len(result.Parties) > 0 {
		// Assign a unique ObjectID to the DisclosingParty
		result.Parties[0].ID = primitive.NewObjectID()
		result.DisclosingParty = &result.Parties[0]
	}
	if len(result.Parties) > 1 {
		result.Parties[1].ID = primitive.NewObjectID()
		result.ReceivingParty = &result.Parties[1]
	}

	for i := range result.Parties {
		if result.Parties[i].ID.IsZero() {
			result.Parties[i].ID = primitive.NewObjectID()
		}
	}

	return result, nil
}

// Classify deal type
func (u *AIUsecase) Classify(ctx context.Context, text string) (*domain.ClassifierResult, error) {
	return u.aiRepo.ClassifyDeal(ctx, text)
}

// Generate document draft (placeholders kept)
func (u *AIUsecase) Draft(ctx context.Context, intake *domain.Intake, language string) (*domain.Draft, error) {
	return u.aiRepo.GenerateDocumentDraft(ctx, intake, language)
}
// Generate draft from prompt (placeholders kept)
func (u *AIUsecase) DraftFromPrompt(ctx context.Context, draft *domain.Draft, promptText, language string) (*domain.Draft, error) {
	return u.aiRepo.GenerateDraftFromPrompt(ctx, draft, promptText, language)
}
func (u *AIUsecase)GenerateDraftFromPromptString(ctx context.Context, draftContent, promptText, language string) (*domain.Draft, error){
	return u.aiRepo.GenerateDraftFromPromptString(ctx, draftContent, promptText, language)
}
// FinalPreview applies party replacements and returns the finalized draft
func (u *AIUsecase) FinalPreview(ctx context.Context, draft *domain.Draft, parties []domain.Party) (*domain.Draft, error) {
	// make a copy so you don’t overwrite the stored draft accidentally
	finalDraft := *draft
	finalDraft.Sections = append([]domain.Section(nil), draft.Sections...)

	u.replacePartyPlaceholders(&finalDraft, parties)
	return &finalDraft, nil
}
