package repository

import (
	"context"
	"errors"
	"fmt"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	"wekil_ai/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type OTPRepository struct {
	collection *mongo.Collection
} 

func NewUnverifiedUserRepository(client *mongo.Client) domainInterface.IOTPRepository {
	dbName :=  config.MONGODB     // Replace with your database name
	collectionName := "Unverified User" // Replace with your collection name
	coll := client.Database(dbName).Collection(collectionName)

	return &OTPRepository{
		collection: coll,
	}
}


// UpdateUnverifiedUser updates the details of an unverified user.
func (r *OTPRepository) UpdateUnverifiedUser(ctx context.Context, user *domain.UnverifiedUserDTO) error {
	if user == nil {
		return errors.New("user is nil")
	}

	filter := bson.M{"_id": user.ID, "verified": false}
	update := bson.M{"$set": user}

	res, err := r.collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update unverified user: %w", err)
	}
	if res.MatchedCount == 0 {
		return errors.New("unverified user not found")
	}
	return nil
}

func (r *OTPRepository) CreateUnverifiedUser(ctx context.Context, unverifiedUser *domain.UnverifiedUserDTO) error {


	_, err := r.collection.InsertOne(ctx, unverifiedUser)
	if err != nil {
		return err
	}

	return nil
}

func (r *OTPRepository) GetByEmail(ctx context.Context, email string) (*domain.UnverifiedUserDTO, error) {
	var entry domain.UnverifiedUserDTO
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&entry)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user does not exist")
		}
		return nil, fmt.Errorf("could not find OTP entry: %w", err)
	}
	return &entry, nil
}

func (r *OTPRepository) DeleteByID(ctx context.Context, userID string) error {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return fmt.Errorf("invalid userID format: %w", err)
	}
	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		return fmt.Errorf("could not delete OTP entry: %w", err)
	}
	return nil
}
