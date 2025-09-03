package repository

import (
	"context"
	"fmt"
	"log"
	"time"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	ITEM_PER_PAGE = 5
)

type AgreementRepository struct {
	collection *mongo.Collection
}

// SoftDeleteAgreement implements domain.IAgreementRepo.
func (a *AgreementRepository) SoftDeleteAgreement(ctx context.Context, agreementID primitive.ObjectID, userID primitive.ObjectID) (*domain.Agreement, error) {
	resAgree, err := a.GetAgreement(ctx, agreementID)
	if err != nil {
		return nil, err
	}
	// if unathorized user wants to delete it by mistake
	if resAgree.CreatorID != userID && resAgree.AcceptorID != userID {
		return nil, fmt.Errorf("unauthorized access")
	}
	
	// one of the IsDeleted will become true when either party wants to delete their agreement
	if resAgree.CreatorID == userID {
		resAgree.IsDeletedByCreator = true
	} else {
		resAgree.IsDeletedByAcceptor = true
	}
	// if both parties want to delete the agreement then the deletedAt will have the time stamp of now
	if resAgree.IsDeletedByAcceptor && resAgree.IsDeletedByCreator {
		resAgree.DeletedAt = time.Now()
	}
		
	return a.UpdateAgreement(ctx, resAgree.ID, resAgree)
}

// GetAgreementsByPartyID implements domain.IAgreementRepo.
func (a *AgreementRepository) GetAgreementsByPartyID(ctx context.Context, ownerID primitive.ObjectID, pageNumber int) ([]*domain.Agreement, error) {
	pageSize := ITEM_PER_PAGE
	skip := int64((pageNumber - 1) * pageSize)
	limit := int64(pageSize)
	filter := bson.D{
		{Key: "$or", Value: bson.A{
			bson.M{"creator_id": ownerID},
			bson.M{"acceptor_id": ownerID},
		}},
	}

	log.Println(" 👈 ", filter)
	findOptions := options.Find().SetSkip(skip).SetLimit(limit).SetSort(bson.D{{Key: "updated_at", Value: -1}})
	log.Println("✅ filtering finished")

	cursor, err := a.collection.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, fmt.Errorf("error getting filtered agreements: %w", err)
	}
	defer cursor.Close(ctx)

	var agreements []*domain.Agreement
	for cursor.Next(ctx) {
		var agreement domain.Agreement // Change target type to DTO for decoding
		if err := cursor.Decode(&agreement); err != nil {
			return nil, fmt.Errorf("error decoding filtered agreement: %w", err)
		}

		agreements = append(agreements, &agreement)

	}

	if err = cursor.Err(); err != nil {
		return nil, fmt.Errorf("error iterating through filtered agreement cursor: %w", err)
	}
	log.Println("✅ Returning from GetAgreementsByPartyID")
	return agreements, nil
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
		"acceptor_id":            agreement.AcceptorID,
		"created_at":             agreement.CreatedAt,
		"deleted_at":             agreement.DeletedAt,
		"creator_id":             agreement.CreatorID,
		"intake_id":              agreement.IntakeID,
		"is_deleted_by_creator":  agreement.IsDeletedByCreator,
		"is_deleted_by_acceptor": agreement.IsDeletedByAcceptor,
		"pdf_url":                agreement.PDFURL,
		"status":                 agreement.Status,
		"updated_at":             agreement.UpdatedAt,
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
