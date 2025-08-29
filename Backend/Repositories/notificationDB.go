package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	"wekil_ai/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationRepo struct {
	collection *mongo.Collection
}

func NewNotificationRepository(client *mongo.Client) domainInterface.INotification {
	dbName := config.MONGODB            // Replace with your database name
	collectionName := "Notification" // Replace with your collection name
	coll := client.Database(dbName).Collection(collectionName)

	return &NotificationRepo{
		collection: coll,
	}

}

func (r *NotificationRepo) FindByID(ctx context.Context, individualID string) (*domain.Notification, error) {
    var notif domain.Notification
	start := strings.Index(individualID, "\"")
	end := strings.LastIndex(individualID, "\"")
	hexID := individualID[start+1 : end] // "68b19fcdd54bbaf7f6e6fbaa"
	objID, err := primitive.ObjectIDFromHex(hexID)
	if err != nil{
		return nil, err
	}
    err = r.collection.FindOne(ctx, bson.M{"user_id": objID.Hex()}).Decode(&notif)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, err
        }
        return nil, fmt.Errorf("failed to find individual by ID: %w", err)
    }
    return &notif, nil
}

func (r *NotificationRepo) CreateIndividual(ctx context.Context, notification *domain.Notification) (*domain.Notification, error) {
    if notification == nil {
        return nil, errors.New("notification is nil")
    }
    if notification.UserID.IsZero() {
        notification.UserID = primitive.NewObjectID()
    }

    _, err := r.collection.InsertOne(ctx, notification)
    if err != nil {
        return nil, fmt.Errorf("failed to insert notification: %w", err)
    }
    return notification, nil
}