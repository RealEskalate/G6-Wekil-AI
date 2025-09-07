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
		FirstName:    u.FirstName,
		LastName:     u.LastName,
		MiddleName:   u.MiddleName,
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

func ToListPtrObject(old []domain.Notification_) []*domain.Notification_{
	res := []*domain.Notification_{}
	for _, each_notification := range old{
		res = append(res, &each_notification)
	}
	return  res
}
