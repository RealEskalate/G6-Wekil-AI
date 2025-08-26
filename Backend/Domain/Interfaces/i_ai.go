package domain

import (
	domain "backend/Domain"
	"context"
)

type IAIInteraction interface {
	GenerateIntake(ctx context.Context, prompt string, language string) (*domain.Intake, error)
	ClassifyDeal(ctx context.Context, text string, language string) (*domain.ClassifierResult, error)
	GenerateDocumentDraft(ctx context.Context, intake *domain.Intake, language string) (*domain.Draft, error)
}
