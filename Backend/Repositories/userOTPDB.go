package repository

import (
	"context"
	"fmt"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type OTPRepository struct {
	collection *mongo.Collection
}

func NewOTPRepository(client *mongo.Client) domainInterface.IOTPRepository {
	dbName := "your_database_name"     // Replace with your database name
	collectionName := "otp_collection" // Replace with your collection name
	coll := client.Database(dbName).Collection(collectionName)

	return &OTPRepository{
		collection: coll,
	}
}

func (r *OTPRepository) StoreOTP(ctx context.Context, otp *domain.UnverifiedUserDTO) (*domain.UnverifiedUserDTO, error) {
	// Filter for the document you want to update (or create)
	filter := bson.M{"email": otp.Email}

	// Only set the specific fields you want to update or insert
	update := bson.M{
		"$set": bson.M{
			"email":        otp.Email,
			"password":     otp.Password,
			"first_name":   otp.FirstName,
			"last_name":    otp.LastName,
			"middle_name":  otp.MiddleName,
			"telephone":    otp.Telephone,
			"account_type": otp.AccountType,
			"expires_at":   otp.ExpiresAt,
		},
	}

	opts := options.Update().SetUpsert(true)

	res, err := r.collection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return nil, err
	}

	// Check if a new document was inserted
	if res.UpsertedID != nil {
		otp.ID = res.UpsertedID.(primitive.ObjectID)
	}

	return otp, nil
}

func (r *OTPRepository) GetByEmail(ctx context.Context, email string) (*domain.UnverifiedUserDTO, error) {
	var entry domain.UnverifiedUserDTO
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&entry)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
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
