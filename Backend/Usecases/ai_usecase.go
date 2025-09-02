package usecases

import (
	"context"
	"strings"
	"wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
)

type AIUsecase struct {
	aiRepo domainInterface.IAIInteraction
}

func NewAIUsecase(aiRepo domainInterface.IAIInteraction) *AIUsecase {
	return &AIUsecase{aiRepo: aiRepo}
}

// private helper: replace placeholders like <<Party A>> and <<Party B>>
func (u *AIUsecase) replacePartyPlaceholders(draft *domain.Draft, parties []domain.Party) {
	if len(parties) < 2 {
		return
	}
	partyAName := parties[0].Name
	partyBName := parties[1].Name

	for i := range draft.Sections {
		draft.Sections[i].Text = strings.ReplaceAll(draft.Sections[i].Text, "<<Party A>>", partyAName)
		draft.Sections[i].Text = strings.ReplaceAll(draft.Sections[i].Text, "<<Party B>>", partyBName)
	}

	draft.Signatures.PartyA = partyAName
	draft.Signatures.PartyB = partyBName
}

// Extract key intake information
func (u *AIUsecase) Extract(ctx context.Context, text, language string) (*domain.Intake, error) {
	return u.aiRepo.GenerateIntake(ctx, text, language)
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

// FinalPreview applies party replacements and returns the finalized draft
func (u *AIUsecase) FinalPreview(ctx context.Context, draft *domain.Draft, parties []domain.Party) (*domain.Draft, error) {
	// make a copy so you don’t overwrite the stored draft accidentally
	finalDraft := *draft
	finalDraft.Sections = append([]domain.Section(nil), draft.Sections...)

	u.replacePartyPlaceholders(&finalDraft, parties)
	return &finalDraft, nil
}
