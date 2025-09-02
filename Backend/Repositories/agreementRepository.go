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

type AgreementRepository struct {
	collection *mongo.Collection
}

// GetAgreement implements domain.IAgreementRepo.
func (a *AgreementRepository) GetAgreement(ctx context.Context, agreementID primitive.ObjectID) (*domain.Agreement, error) {
	filter := bson.M{"_id": agreementID}
	var singleAgreement domain.Agreement
	if err := a.collection.FindOne(ctx, filter).Decode(&singleAgreement); err != nil {
		return nil, err
	}
	return &singleAgreement, nil
}

// SaveAgreement implements domain.IAgreementRepo.
func (a *AgreementRepository) SaveAgreement(ctx context.Context, agreement *domain.Agreement) (*domain.Agreement, error) {
	insRes, err := a.collection.InsertOne(ctx, agreement)
	if err != nil {
		return nil, err
	}
	agreement.ID = insRes.InsertedID.(primitive.ObjectID)
	return agreement, nil
}

// UpdateAgreement implements domain.IAgreementRepo.
func (a *AgreementRepository) UpdateAgreement(ctx context.Context, agreementID primitive.ObjectID, agreement *domain.Agreement) (*domain.Agreement, error) {
	// update := bson.M{"$set": updates}
	filter := bson.M{"_id": agreementID}
	updateMapping := bson.M{"$set": map[string]interface{}{
		"acceptor_id": agreement.AcceptorID,
		"created_at":  agreement.CreatedAt,
		"deleted_at":  agreement.DeletedAt,
		"creator_id":  agreement.CreatorID,
		"intake_id":   agreement.IntakeID,
		"is_deleted":  agreement.IsDeleted,
		"pdf_url":     agreement.PDFURL,
		"status":      agreement.Status,
		"updated_at":  agreement.UpdatedAt,
	},
	}
	updateResult, err := a.collection.UpdateOne(ctx, filter, updateMapping)
	if err != nil {
		return nil, err
	}
	if updateResult.ModifiedCount == 0 {
		return nil, fmt.Errorf("no agreement was updated")
	}
	agreement.ID = agreementID
	return agreement, nil

}

func NewAgreementRepository(client *mongo.Client, dbName, collectionName string) domainInterface.IAgreementRepo {
	coll := client.Database(dbName).Collection(collectionName)
	return &AgreementRepository{
		collection: coll,
	}
}
