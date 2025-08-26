package converter

import (
	domain "backend/Domain"
	"time"
)

func ToIndividual(u *domain.UnverifiedUserDTO) *domain.Individual {
	return &domain.Individual{
		ID:           u.ID,
		Email:        u.Email,
		PasswordHash: u.Password,
		FirstName:    u.FirstName,
		LastName:     u.LastName,
		MiddleName:   u.MiddleName,
		Telephone:    u.Telephone,
		AccountType:  u.AccountType,
		// New fields for the Individual struct, initialized to default values
		IsVerified:   false, // Setting to true as this conversion implies verification
		Address:      "",    // Add logic to get this value if needed
		ProfileImage: "",    // Add logic to get this value if needed
		Signature:    "",    // Add logic to get this value if needed
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}
