package repository

import (
	"context"
	"fmt"
	"log"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	ITEM_PER_PAGE = 7
)

type AgreementRepository struct {
	collection        *mongo.Collection
	pendingCollection *mongo.Collection
}

// GetAgreementsByFilterAndPartyID implements domain.IAgreementRepo.
func (a *AgreementRepository) GetAgreementsByFilterAndPartyID(ctx context.Context, ownerID primitive.ObjectID, pageNumber int, filter *domain.AgreementFilter) ([]*domain.Agreement, error) {
	var filterOr bson.A
	log.Printf("%#v", filter)
	// Step 2: Conditionally append to the inner $or query.
	if filter.AgreementStatus != "" {
		log.Printf("😠Inserting %s", filter.AgreementStatus)
		filterOr = append(filterOr, bson.D{{Key: "status", Value: filter.AgreementStatus}})
	}
	if filter.AgreementType != "" {
		filterOr = append(filterOr, bson.D{{Key: "agreement_type", Value: filter.AgreementType}})
	}

	// Step 3: Initialize the main $and array.
	var and bson.A

	// Step 4: Add the mandatory $or condition for creator_id and acceptor_id.
	// This part of the query is always present.
	and = append(and, bson.D{
		{
			Key: "$or",
			Value: bson.A{
				bson.D{{Key: "creator_id", Value: ownerID}},
				bson.D{{Key: "acceptor_id", Value: ownerID}},
			},
		},
	})

	// Step 5: Conditionally add the $or query for filter fields if it's not empty.
	// This ensures we don't add an empty "$or" block.
	if len(filterOr) > 0 {
		and = append(and, bson.D{
			{
				Key: "$or",
				Value: filterOr,
			},
		})
	}

	// Step 6: Assemble the final query.
	query := bson.D{
		{
			Key:   "$and",
			Value: and,
		},
	}
	log.Printf("▶️Final BSON Query: %+v\n", query)
	pageSize := ITEM_PER_PAGE
	skip := int64((pageNumber - 1) * pageSize)
	limit := int64(pageSize)

	log.Println(" 👈 ", filter)
	findOptions := options.Find().SetSkip(skip).SetLimit(limit).SetSort(bson.D{{Key: "updated_at", Value: -1}})
	log.Println("✅ filtering finished")

	cursor, err := a.collection.Find(ctx, query, findOptions)
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
	log.Println("✅ Returning from GetAgreementsByFilterAndPartyID")
	return agreements, nil
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
// GetAgreement implements domain.IAgreementRepo.
func (a *AgreementRepository) GetAgreementIntake(ctx context.Context, agreementID primitive.ObjectID) (*domain.AgreementIntake, error) {
	filter := bson.M{"_id": agreementID}
	var singleAgreement domain.AgreementIntake
	if err := a.collection.FindOne(ctx, filter).Decode(&singleAgreement); err != nil {
		return nil, err
	}
		log.Print("data------------------------:-", singleAgreement)

	intakeFilter := bson.M{"_id": singleAgreement.IntakeID}
	var intake domain.Intake
	intakeCollection := a.collection.Database().Collection("intake")
	if err := intakeCollection.FindOne(ctx, intakeFilter).Decode(&intake); err != nil {
		return nil, fmt.Errorf("error fetching intake: %w", err)
	}
	singleAgreement.Intake = intake
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


func (r *AgreementRepository) GetPendingAgreement(ctx context.Context, agreementID primitive.ObjectID, email string) (*domain.AgreementIntake, error) {
    var pending domain.AgreementIntake
    err := r.pendingCollection.FindOne(ctx, bson.M{
        "_id":   agreementID,
        "email": email,
    }).Decode(&pending)

    if err != nil {
        return nil, err
    }
    return &pending, nil
}



func NewAgreementRepository(client *mongo.Client, dbName, collectionName string) domainInterface.IAgreementRepo {
	coll := client.Database(dbName).Collection(collectionName)
	return &AgreementRepository{
		collection: coll,
		pendingCollection: client.Database(dbName).Collection("pending"),
	}
}
