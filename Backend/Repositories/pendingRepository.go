package repository

import (
	"context"
	"fmt"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PendingAgreementRepository struct {
	collection *mongo.Collection
}

// GetPendingAgreement implements domain.IPendingAgreementRepo.
func (p *PendingAgreementRepository) GetPendingAgreement(ctx context.Context, pendAgreeID primitive.ObjectID) (*domain.PendingAgreement, error) {
	var resPendingAgreement domain.PendingAgreement
	filter := bson.M{"_id": pendAgreeID}
	if err := p.collection.FindOne(ctx, filter).Decode(&resPendingAgreement); err != nil {
		return nil, err
	}
	return &resPendingAgreement, nil
}

// CreatePendingAgreement implements domain.IPendingAgreementRepo.
func (p *PendingAgreementRepository) CreatePendingAgreement(ctx context.Context, pendAgree *domain.PendingAgreement) (*domain.PendingAgreement, error) {
	resPend, err := p.collection.InsertOne(ctx, pendAgree)
	if err != nil {
		return nil, err
	}
	pendAgree.AgreementID = resPend.InsertedID.(primitive.ObjectID)
	return pendAgree, nil
}

// DeletePendingAgreement implements domain.IPendingAgreementRepo.
func (p *PendingAgreementRepository) DeletePendingAgreement(ctx context.Context, pendAgreeID primitive.ObjectID) error {
	resDeleted, err := p.collection.DeleteOne(ctx, bson.M{"_id": pendAgreeID})
	if err != nil {
		return err
	} else if resDeleted.DeletedCount == 0 {
		return fmt.Errorf("no pending agreement found")
	}
	return nil
}

func NewPendingAgreementRepository(client *mongo.Client, dbName, collectionName string) domainInterface.IPendingAgreementRepo {
	coll := client.Database(dbName).Collection(collectionName)
	return &PendingAgreementRepository{
		collection: coll,
	}
}
