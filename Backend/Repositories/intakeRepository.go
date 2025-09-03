package repository

import (
	"context"
	"fmt"
	domain "wekil_ai/Domain"
	domainInter "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type IntakeRepository struct {
	collection *mongo.Collection
}

// DeleteIntake implements domain.IIntakeRepo.
func (i *IntakeRepository) DeleteIntake(ctx context.Context, intakeID primitive.ObjectID) error {
	filter := bson.M{"_id": intakeID}
	delRes, err := i.collection.DeleteOne(ctx, filter)
	if err != nil {
		return err
	} else if delRes.DeletedCount == 0 {
		return fmt.Errorf("no intake found with provided intakeID")
	}
	return nil
}

// GetIntake implements domain.IIntakeRepo.
func (i *IntakeRepository) GetIntake(ctx context.Context, intakeID primitive.ObjectID) (*domain.Intake, error) {
	var intake domain.Intake
	filter := bson.M{"_id":intakeID}
	if err := i.collection.FindOne(ctx, filter).Decode(&intake); err != nil{
		return nil, err
	}
	return &intake, nil
}

// StoreIntake implements domain.IIntakeRepo.
func (i *IntakeRepository) StoreIntake(ctx context.Context, intake *domain.Intake) (*domain.Intake, error) {
	insertRes, err := i.collection.InsertOne(ctx, intake)
	if err != nil{
		return nil, err
	}
	intake.ID = insertRes.InsertedID.(primitive.ObjectID)
	return intake, nil
}

func (i *IntakeRepository) UpdateIntake(ctx context.Context, intakeID primitive.ObjectID, updatedIntake *domain.Intake) (*domain.Intake, error) {
	// Validate that the Intake struct has a valid ID for the update operation.
	if intakeID.IsZero() {
		return nil, fmt.Errorf("intake ID cannot be empty for update operation")
	}
	filter := bson.M{"_id": intakeID}
	update := bson.M{"$set": updatedIntake}

	updateResult, err := i.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update intake: %w", err)
	}	
	if updateResult.MatchedCount == 0 {
		return nil, mongo.ErrNoDocuments
	}
	updatedIntake.ID = intakeID
	return updatedIntake, nil
}

func NewIntakeRepository(client *mongo.Client, dbName, collectionName string) domainInter.IIntakeRepo {
	coll := client.Database(dbName).Collection(collectionName)
	return &IntakeRepository{
		collection: coll,
	}
}
