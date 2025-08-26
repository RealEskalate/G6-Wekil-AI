package userDB

import (
	"context"
	"fmt"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	collection *mongo.Collection
}

func NewIndividualRepository(client *mongo.Client) domainInterface.IUserRepository {
	dbName := "your_database_name"        
	collectionName := "individuals"        
	coll := client.Database(dbName).Collection(collectionName)

	return &IndividualRepository{collection: coll}
}


func (r *IndividualRepository) CreateUser(ctx context.Context, individual *domain.Individual) (*domain.Individual, error) {
	if individual.ID.IsZero() {
		individual.ID = primitive.NewObjectID()
	}

	_, err := r.collection.InsertOne(ctx, individual)
	if err != nil {
		return nil, fmt.Errorf("failed to insert individual: %w", err)
	}
	return individual, nil
}


func (r *IndividualRepository) FindByEmail(ctx context.Context, email string) (*domain.Individual, error) {
	var ind domain.Individual
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&ind)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil 
		}
		return nil, fmt.Errorf("failed to find individual: %w", err)
	}
	return &ind, nil
}


func (r *IndividualRepository) FindByID(ctx context.Context, individualID primitive.ObjectID) (*domain.Individual, error) {
	var ind domain.Individual
	err := r.collection.FindOne(ctx, bson.M{"_id": individualID}).Decode(&ind)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to find individual by ID: %w", err)
	}
	return &ind, nil
}
	// func (r *IndividualRepository) UpdateIndividual(ctx context.Context, individualID primitive.ObjectID, updates map[string]interface{}) (*domain.Individual, error) {
	// 	filter := bson.M{"_id": individualID}
	// 	update := bson.M{"$set": updates}

	// 	_, err := r.collection.UpdateOne(ctx, filter, update)
	// 	if err != nil {
	// 		return nil, fmt.Errorf("failed to update individual: %w", err)
	// 	}

	// 	return r.FindByID(ctx, individualID)
	// }

func (r *IndividualRepository) DeleteIndividual(ctx context.Context, individualID primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": individualID})
	if err != nil {
		return fmt.Errorf("failed to delete individual: %w", err)
	}
	return nil
}
