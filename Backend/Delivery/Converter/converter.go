package converter

import (
	"time"
	domain "wekil_ai/Domain"
)

func ToIndividual(u *domain.UnverifiedUserDTO) *domain.Individual {
	return &domain.Individual{
		ID:           u.ID,
		Email:        u.Email,
		PasswordHash: u.Password,
		first_name:    u.first_name,
		last_name:     u.last_name,
		middle_name:   u.middle_name,
		Telephone:    u.Telephone,
		AccountType:  u.AccountType,
		// New fields for the Individual struct, initialized to default values

		IsVerified:  true, // Setting to true as this conversion implies verification
		Address:      "",   // Add logic to get this value if needed
		ProfileImage: "",   // Add logic to get this value if needed
		Signature:    "",   // Add logic to get this value if needed

		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}
