package repository

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	converter "wekil_ai/Delivery/Converter"
	domain "wekil_ai/Domain" // This import path should point to the location of your data models
	domainInterface "wekil_ai/Domain/Interfaces"
	"wekil_ai/config"
)

// NotificationRepo_ implements the domainInterface.INotification interface for MongoDB.
type NotificationRepo_ struct {
	collection *mongo.Collection
}


// NewNotification_Repository initializes a new repository instance.


// FindByReceiverID_ retrieves notifications for a specific recipient with pagination and sorting.
func (r *NotificationRepo_) FindByReceiverID_(ctx context.Context, individualID string, page, limit int64) ([]*domain.Notification_, error) {
	var notifs []domain.Notification_

	// Pagination values
	skip := (page - 1) * limit

	// Find options: sort by created_at in descending order, apply skip & limit
	findOptions := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}). // newest → oldest
		SetSkip(skip).
		SetLimit(limit)

	// The query uses dot notation to find documents where the embedded 'recipient' user_id matches.
	cursor, err := r.collection.Find(ctx, bson.M{"recipient.user_id": individualID}, findOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to find notifications: %w", err)
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &notifs); err != nil {
		return nil, fmt.Errorf("failed to decode notifications: %w", err)
	}

	return converter.ToListPtrObject(notifs), nil
}

// CreateNotification_ inserts a new notification document into the collection.
func (r *NotificationRepo_) CreateNotification_(ctx context.Context, notification *domain.Notification_) (*domain.Notification_, error) {
	if notification == nil {
		return nil, fmt.Errorf("notification is nil")
	}

	// MongoDB will automatically generate a unique _id if one is not provided.
	_, err := r.collection.InsertOne(ctx, notification)
	if err != nil {
		return nil, fmt.Errorf("failed to insert notification: %w", err)
	}
	return notification, nil
}

// CountByReceiverID gets the total count of notifications for a specific recipient.
func (r *NotificationRepo_) CountByReceiverID_(ctx context.Context, receiverID string) (int64, error) {
	// The query uses dot notation to count documents where the embedded 'recipient' user_id matches.
	count, err := r.collection.CountDocuments(ctx, bson.M{"recipient.user_id": receiverID})
	if err != nil {
		return 0, fmt.Errorf("failed to count notifications: %w", err)
	}
	return count, nil
}
func (r *NotificationRepo_) FindUserByEmail_(ctx context.Context, email string) ([]*domain.Notification_, error) {
	var notifs []domain.Notification_
	
	// Create a query that uses the $or operator to check both recipient.email and sender.email.
	filter := bson.M{
		"$or": []bson.M{
			{"recipient.email": email},
			{"sender.email": email},
		},
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find notifications by email: %w", err)
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &notifs); err != nil {
		return nil, fmt.Errorf("failed to decode notifications: %w", err)
	}

	return converter.ToListPtrObject(notifs), nil
}

func NewNotification_Repository(client *mongo.Client) domainInterface.INotification_ {
	dbName := config.MONGODB          // Replace with your database name
	collectionName := "notifications" // Standard practice is to use a plural name
	coll := client.Database(dbName).Collection(collectionName)

	return &NotificationRepo_{
		collection: coll,
	}
}