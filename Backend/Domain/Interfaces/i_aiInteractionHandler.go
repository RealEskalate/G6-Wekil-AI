package domain

import (
	"context"
	domain "wekil_ai/Domain"
)

type IAIInteraction interface {
	GenerateIntake(ctx context.Context, prompt string, language string) (*domain.Intake, error)
	ClassifyDeal(ctx context.Context, text string) (*domain.ClassifierResult, error)
	GenerateDocumentDraft(ctx context.Context, draftText string, language string) (*domain.Draft, error)
	GenerateDraftFromPrompt(ctx context.Context, draft *domain.Draft, promptText, language string) (*domain.Draft, error)
	TitleGenerateHelper(ctx context.Context, draftStringPrompt, language string) (string, error)
}
