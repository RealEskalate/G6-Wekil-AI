package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	"wekil_ai/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

type OTPRepository struct {
	collection *mongo.Collection
} 

func NewUnverifiedUserRepository(client *mongo.Client) domainInterface.IOTPRepository {
	dbName :=  config.MONGODB     // Replace with your database name
	collectionName := "Unverified User" // Replace with your collection name
	coll := client.Database(dbName).Collection(collectionName)
	indexModel := mongo.IndexModel{
        Keys:    bson.M{"expires_at": 1},
        Options: options.Index().SetExpireAfterSeconds(0), // delete exactly at expires_at
    }
    if _, err := coll.Indexes().CreateOne(context.Background(), indexModel); err != nil {
        log.Fatal("failed to create TTL index:", err)
    }
	return &OTPRepository{
		collection: coll,
	}
}


func (r *OTPRepository) CreateUnverifiedUser(ctx context.Context, unverifiedUser *domain.UnverifiedUserDTO) error {

	unverifiedUser.ExpiresAt =time.Now().Add(15 * time.Minute)
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
