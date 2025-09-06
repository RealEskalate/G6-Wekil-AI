package repository

/*
import (
	"context"
	"errors"
	"fmt"
	"strings"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	"wekil_ai/config"

	"go.mongodb.org/mongo-driver/mongo/options"
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


// 🔹 Repository layer with pagination + sorting
func (r *NotificationRepo) FindByReceiverID(ctx context.Context, individualID string, page, limit int64) ([]domain.Notification, error) {
	var notifs []domain.Notification

	// extract hex ID (assuming individualID is like `"68b19fcdd54bbaf7f6e6fbaa"`)
	start := strings.Index(individualID, "\"")
	end := strings.LastIndex(individualID, "\"")
	hexID := individualID[start+1 : end]

	objID, err := primitive.ObjectIDFromHex(hexID)
	if err != nil {
		return nil, err
	}

	// Pagination values
	skip := (page - 1) * limit

	// Options: sort by created_at desc, apply skip & limit
	findOptions := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}). // newest → oldest
		SetSkip(skip).
		SetLimit(limit)

	cursor, err := r.collection.Find(ctx, bson.M{"reciver_id": objID.Hex()}, findOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to find notifications: %w", err)
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &notifs); err != nil {
		return nil, fmt.Errorf("failed to decode notifications: %w", err)
	}

	return notifs, nil
}




func (r *NotificationRepo) CreateNotification(ctx context.Context, notification *domain.Notification) (*domain.Notification, error) {
    if notification == nil {
        return nil, errors.New("notification is nil")
    }
    if notification.ReceiverID.IsZero() {
        notification.ReceiverID = primitive.NewObjectID()
    }

    _, err := r.collection.InsertOne(ctx, notification)
    if err != nil {
        return nil, fmt.Errorf("failed to insert notification: %w", err)
    }
    return notification, nil
}
*/
