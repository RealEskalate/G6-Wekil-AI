package repository

import (
	"context"
	"errors"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type userRepository struct {
	collection *mongo.Collection
}

func NewuserRepository(client *mongo.Client) domainInterface.IuserRepository {
	dbName := "wekilDb"     // Replace with your database name
	collectionName := "user_collection" // Replace with your collection name
	coll := client.Database(dbName).Collection(collectionName)

	return &userRepository{
		collection: coll,
	}
}

func (r *userRepository) UpdateResetOTP(ctx context.Context, email, otp string) error {
	filter := bson.M{"email": email}
	update := bson.M{"$set": bson.M{"reset_otp": otp}}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}

func (r *userRepository) VerifyResetOTP(ctx context.Context, email, otp string) error {
	filter := bson.M{"email": email, "reset_otp": otp}

	var user domain.Individual
	err := r.collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return errors.New("invalid OTP or email")
	}
	return nil
}

func (r *userRepository) UpdatePasswordByEmail(ctx context.Context, email, newHashedPassword string) error {
	filter := bson.M{"email": email}
	update := bson.M{
		"$set": bson.M{
			"password":   newHashedPassword,
			"reset_otp":  "", // Clear OTP after success
		},
	}

	_, err := r.collection.UpdateOne(ctx, filter, update)
	return err
}