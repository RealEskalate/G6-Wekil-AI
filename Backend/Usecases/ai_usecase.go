package usecases

import (
	"context"
	"wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
)

type AIUsecase struct {
	aiRepo domainInterface.IAIInteraction
}

func NewAIUsecase(aiRepo domainInterface.IAIInteraction) *AIUsecase {
	return &AIUsecase{aiRepo: aiRepo}
}

// Extract key intake information
func (u *AIUsecase) Extract(ctx context.Context, text, language string) (*domain.Intake, error) {
	return u.aiRepo.GenerateIntake(ctx, text, language)
}

// Classify deal type
func (u *AIUsecase) Classify(ctx context.Context, text, language string) (*domain.ClassifierResult, error) {
	return u.aiRepo.ClassifyDeal(ctx, text, language)
}

// Generate document draft
func (u *AIUsecase) Draft(ctx context.Context, intake *domain.Intake, language string) (*domain.Draft, error) {
	return u.aiRepo.GenerateDocumentDraft(ctx, intake, language)
}
