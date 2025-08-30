package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// UserRepository implements user persistence for Individuals.
type UserRepository struct {
    collection *mongo.Collection
}

// NewUserRepository creates a new repository for the given Mongo client.
func NewUserRepository(client *mongo.Client, dbName, collectionName string) domainInterface.IIndividualRepository {
    coll := client.Database(dbName).Collection(collectionName)
    return &UserRepository{collection: coll}
}


// CreateUser inserts a new Individual.
func (r *UserRepository) CreateIndividual(ctx context.Context, individual *domain.Individual) (*domain.Individual, error) {
    if individual == nil {
        return nil, errors.New("individual is nil")
    }
    if individual.ID.IsZero() {
        individual.ID = primitive.NewObjectID()
    }

    _, err := r.collection.InsertOne(ctx, individual)
    if err != nil {
        return nil, fmt.Errorf("failed to insert individual: %w", err)
    }
    return individual, nil
}

func (r *UserRepository) UpdateIndividual(ctx context.Context, UserID primitive.ObjectID,updates map[string]interface{}) (error){
    
     filter := bson.M{"_id": UserID}

    // Build the update document using $set
    update := bson.M{"$set": updates}

    // Execute the update
    result, err := r.collection.UpdateOne(ctx, filter, update)
    if err != nil {
        return err // database error
    }

    // Check if any document was actually updated
    if result.MatchedCount == 0 {
        return fmt.Errorf("no user found with id %s", UserID.Hex())
    }

    return nil
}

// FindByEmail returns the individual by email or (nil, nil) if not found.
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.Individual, error) {
    var ind domain.Individual
    err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&ind)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil,errors.New("user does not exist")
        }
        return nil, fmt.Errorf("failed to find individual: %w", err)
    }
    return &ind, nil
}
func (r *UserRepository) FindUser(ctx context.Context, userID string) (*domain.Individual, error) {
   
    var ind domain.Individual
    err := r.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&ind)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, fmt.Errorf("failed to find user: %w", err)
    }
    log.Println("||||||||||||||============rrrr-:", ind)
    return &ind, nil
}



// FindByID returns the individual by ID or (nil, nil) if not found.
func (r *UserRepository) FindByID(ctx context.Context, individualID primitive.ObjectID) (*domain.Individual, error) {
    var ind domain.Individual
    err := r.collection.FindOne(ctx, bson.M{"_id": individualID}).Decode(&ind)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, fmt.Errorf("failed to find individual by ID: %w", err)
    }
    return &ind, nil
}

// UpdateResetOTP sets (or overwrites) the reset OTP for a user identified by email.
func (r *UserRepository) UpdateResetOTP(ctx context.Context, email, otp string) error {
    filter := bson.M{"email": email}
    update := bson.M{"$set": bson.M{"reset_otp": otp}}

    res, err := r.collection.UpdateOne(ctx, filter, update)
    if err != nil {
        return err
    }
    if res.MatchedCount == 0 {
        return errors.New("email not found")
    }
    return nil
}

// VerifyResetOTP verifies that the provided OTP matches the stored one for the email.
func (r *UserRepository) VerifyResetOTP(ctx context.Context, email, otp string) error {
    filter := bson.M{"email": email, "reset_otp": otp}
    var user domain.Individual
    err := r.collection.FindOne(ctx, filter).Decode(&user)
    if err != nil {
        return errors.New("invalid OTP or email")
    }
    return nil
}

// UpdatePasswordByEmail updates a user's password and clears the reset OTP.
func (r *UserRepository) UpdatePasswordByEmail(ctx context.Context, email, newHashedPassword string) error {
    filter := bson.M{"email": email}
    update := bson.M{
        "$set": bson.M{
            "password":  newHashedPassword,
            "reset_otp": "",
        },
    }

    res, err := r.collection.UpdateOne(ctx, filter, update)
    if err != nil {
        return err
    }
    if res.MatchedCount == 0 {
        return errors.New("email not found")
    }
    return nil
}

// DeleteIndividual removes a user by ID.
func (r *UserRepository) DeleteIndividual(ctx context.Context, individualID primitive.ObjectID) error {
    res, err := r.collection.DeleteOne(ctx, bson.M{"_id": individualID})
    if err != nil {
        return fmt.Errorf("failed to delete individual: %w", err)
    }
    if res.DeletedCount == 0 {
        return errors.New("individual not found")
    }
    return nil
}

func (ur UserRepository) DeleteRefreshToken(ctx context.Context, userID string) error {
    objID:=userID
    log.Println("||||||||||||||============:", objID)
    
    filter := bson.M{"_id": userID}
    update := bson.M{"$unset": bson.M{"refresh_token": ""}} 

    _, err := ur.collection.UpdateOne(ctx, filter, update)
    return err
}

// UpdateProfile updates the profile of an individual by ID with the provided update data.
func (r *UserRepository) UpdateProfile(ctx context.Context, email string, updateData map[string]interface{}) error {
    if len(updateData) == 0 {
        return errors.New("update data is empty")
    }
    	log.Println("%%%%%%%%%%%%%%%%", email)


    filter := bson.M{"email": email}
    update := bson.M{"$set": updateData}

    res, err := r.collection.UpdateOne(ctx, filter, update)
    if err != nil {
        return fmt.Errorf("failed to update profile: %w", err)
    }
    if res.MatchedCount == 0 {
        return errors.New("individual not found")
    }
    return nil
}

// Compile-time interface assertions (comment out if interfaces differ).
// var _ domainInterface.IUserRepository = (*UserRepository)(nil)
// var _ domainInterface.IuserRepository = (*UserRepository)(nil)
