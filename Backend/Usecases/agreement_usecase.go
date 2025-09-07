package usecases

import (
	"context"
	"fmt"
	"log"
	"time"
	domain "wekil_ai/Domain"
	domainInter "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"

	"go.mongodb.org/mongo-driver/bson/primitive"
)
const (
	BASE_URL = "https://demo.wekilai.com"
)
type AgreementUseCase struct {
	IntakeRepo        domainInter.IIntakeRepo
	AgreementRepo     domainInter.IAgreementRepo
	PendingRepo       domainInter.IPendingAgreementRepo
	AIInteraction     domainInter.IAIInteraction
	NotificatoinRepo_ domainInter.INotification_
	EmailService      *infrastracture.GeneralEmailService
}

// GetAgreementsByUserIDAndFilter implements domain.IAgreementUseCase.
func (a *AgreementUseCase) GetAgreementsByUserIDAndFilter(userID primitive.ObjectID, pageNumber int, filter *domain.AgreementFilter) ([]*domain.Agreement, error) {
	return a.AgreementRepo.GetAgreementsByFilterAndPartyID(context.Background(), userID, pageNumber, filter)
}

// SendAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) SendAgreement(receiverEmail string, agreement *domain.Agreement, parties []*domain.Party) error {
	pendingAgreement := domain.PendingAgreement{
		AgreementID:   agreement.ID,
		CreatorID:     agreement.CreatorID,
		AcceptorEmail: receiverEmail,
	}
	_, err := a.PendingRepo.CreatePendingAgreement(context.Background(), &pendingAgreement)
	if err != nil {
		return err
	}
	// send the notification to the user also
	creator := parties[0]
	acceptor := parties[1]
	signRequestNotification := domain.Notification_{
		Recipient: domain.User_{
			UserName: acceptor.Name,
			Email:    receiverEmail,
		},
		Sender: domain.User_{
			UserID:   creator.ID,
			UserName: creator.Name,
			Email:    creator.Email,
		},
		Type: "agreement_request",
		Content: domain.Content_{
			Title: "Signature Required",
			Body:  fmt.Sprintf("%s has asked you to sign a new agreement. Please review the details.", creator.Name),
		},
		IsRead:     false,
		IsArchived: false,
		CreatedAt:  time.Now(),
		TargetURL:  "/agreement/" + agreement.ID.Hex(),
	}
	// send email
	log.Println("toEmail: ", receiverEmail, "  agreementID: ", agreement.ID.Hex())
	a.EmailService.SendAgreementLink(acceptor.Email, BASE_URL + "/agreement/" + agreement.ID.Hex())

	// send notification
	_, err = a.NotificatoinRepo_.CreateNotification_(context.Background(), &signRequestNotification)
	return err
}

// CreateAgreementSave for saving end-point only implements domain.IAgreementUseCase.
// ? just call it CreateAgreement 2.0 since the implementations are the same
func (a *AgreementUseCase) CreateAgreementSave(intake *domain.Intake, save *domain.JustForSaveSake) (*domain.Agreement, error) {
	aR := save.AgreementReqeust
	if aR.AgrementInfo.Status != domain.DRAFT_STATUS && aR.AgrementInfo.Status != domain.PENDING_STATUS && aR.AgrementInfo.Status != domain.REJECTED_STATUS {
		return nil, fmt.Errorf("invalid agreement status")
	}
	intake.ID = primitive.NilObjectID // make the _id == 000000 so that the database will assign a new ID to it. JUST IN CASE

	// first store the intake in the database and get it's _id
	storedIntake, err := a.IntakeRepo.StoreIntake(context.Background(), intake)
	if err != nil {
		return nil, err
	}
	// create the Agreement and store in the AgreementRepo Database

	agreement := domain.Agreement{
		AgreementType:  aR.AgrementInfo.AgreementType,
		AgreementTitle: aR.AgrementInfo.AgreementTitle,
		IntakeID:       storedIntake.ID,
		Status:         aR.AgrementInfo.Status,
		CreatorID:      save.CreatorParty.ID,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
		CreatorSigned:  aR.AgrementInfo.CreatorSigned,
		AcceptorSigned: false,
		PDFURL:         aR.AgrementInfo.PDFURL,
	}
	storedAgreement, err := a.AgreementRepo.SaveAgreement(context.Background(), &agreement)
	if err != nil {
		return nil, err
	}
	// if the agreementStatus in pending then we will send an email request to the second user
	if storedAgreement.Status == domain.PENDING_STATUS {
		acceptorEmail := save.AcceptorEmail
		if acceptorEmail == "" {
			return nil, fmt.Errorf("empty acceptor email found")
		}
		parties := []*domain.Party{
			{ // creator party
				ID:    save.CreatorParty.ID,
				Name:  save.CreatorParty.Name,
				Email: save.CreatorParty.Email,
			},
			{ // acceptor party
				Email: acceptorEmail,
			},
		}
		err := a.SendAgreement(acceptorEmail, storedAgreement, parties)
		if err != nil {
			return nil, err
		}
	}
	return storedAgreement, nil
}

// CreateAgreement implements domain.IAgreementUseCase.
// ! Abandoned function
func (a *AgreementUseCase) CreateAgreement(intake *domain.Intake, agreementStatus string, pdfURL string, creatorID primitive.ObjectID, acceptorEmail string, creatorSigned bool) (*domain.Agreement, error) {
	if agreementStatus != domain.DRAFT_STATUS && agreementStatus != domain.PENDING_STATUS && agreementStatus != domain.REJECTED_STATUS {
		return nil, fmt.Errorf("invalid agreement status")
	}
	intake.ID = primitive.NilObjectID // make the _id == 000000 so that the database will assign a new ID to it. JUST IN CASE

	// first store the intake in the database and get it's _id
	storedIntake, err := a.IntakeRepo.StoreIntake(context.Background(), intake)
	if err != nil {
		return nil, err
	}
	// create the Agreement and store in the AgreementRepo Database

	agreement := domain.Agreement{
		IntakeID:      storedIntake.ID,
		Status:        agreementStatus,
		CreatorID:     creatorID,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		CreatorSigned: creatorSigned,
		PDFURL:        pdfURL,
	}
	storedAgreement, err := a.AgreementRepo.SaveAgreement(context.Background(), &agreement)
	if err != nil {
		return nil, err
	}
	// if the agreementStatus in pending then we will send an email request to the second user
	//! send functionality OFF
	/*
		if storedAgreement.Status == domain.PENDING_STATUS {
			if acceptorEmail == "" {
				return nil, fmt.Errorf("empty acceptor email found")
			}
			err := a.SendAgreement(acceptorEmail, storedAgreement)
			if err != nil {
				return nil, err
			}
		}
	*/

	return storedAgreement, nil
}

// DeclineAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) DeclineAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID) error {
	agreement, err := a.AgreementRepo.GetAgreement(context.Background(), agreementID)
	if err != nil {
		return err
	}
	if userID != agreement.CreatorID && userID != agreement.AcceptorID {
		return fmt.Errorf("unauthorized access")
	}
	if agreement.CreatorID == userID {
		agreement.CreatorSigned = false
		agreement.Status = domain.REJECTED_STATUS
	} else {
		agreement.AcceptorSigned = false
		agreement.Status = domain.REJECTED_STATUS
	}
	_, err = a.AgreementRepo.UpdateAgreement(context.Background(), agreementID, agreement)
	return err
}

// GetAgreementByID implements domain.IAgreementUseCase.
func (a *AgreementUseCase) GetAgreementByID(agreementID primitive.ObjectID, userID primitive.ObjectID) (*domain.Agreement, error) {
	resAgree, err := a.AgreementRepo.GetAgreement(context.Background(), agreementID)
	if err != nil {
		return nil, err
	} else if resAgree.AcceptorID != userID && resAgree.CreatorID != userID {
		return nil, fmt.Errorf("unauthorized access")
	} else if resAgree.IsDeletedByAcceptor && resAgree.IsDeletedByCreator {
		log.Println("❌ Indeed 🗑️ ed")
		return nil, fmt.Errorf("trying to access deleted agreement")
	}
	return resAgree, nil
}


// GetAgreementByID implements domain.IAgreementUseCase.
func (a *AgreementUseCase) GetAgreementByIDIntake(agreementID primitive.ObjectID, userID primitive.ObjectID) (*domain.AgreementIntake, error) {
	resAgree, err := a.AgreementRepo.GetAgreementIntake(context.Background(), agreementID)

	if err != nil {
		return nil, err
	} else if resAgree.AcceptorID != userID && resAgree.CreatorID != userID {
		return nil, fmt.Errorf("unauthorized access")
	} else if resAgree.IsDeletedByAcceptor && resAgree.IsDeletedByCreator {
		return nil, fmt.Errorf("trying to access deleted agreement")
	}
	return resAgree, nil
}

// GetAgreementsByUserID implements domain.IAgreementUseCase.
func (a *AgreementUseCase) GetAgreementsByUserID(userID primitive.ObjectID, pageNumber int) ([]*domain.Agreement, error) {
	listOfAgreement, err := a.AgreementRepo.GetAgreementsByPartyID(context.Background(), userID, pageNumber)
	log.Println("☑️", listOfAgreement)
	if err != nil {
		return nil, err
	}
	undeletedAgreements := []*domain.Agreement{}
	for _, agreement := range listOfAgreement {
		if !(agreement.IsDeletedByAcceptor || agreement.IsDeletedByCreator) {
			undeletedAgreements = append(undeletedAgreements, agreement)
		}
	}
	return undeletedAgreements, nil
}

// SignAgreement implements domain.IAgreementUseCase.
// * I know that is't a bit complex but the logic is simple
func (a *AgreementUseCase) SignAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID, wantToSign bool) error {
	agreement, err := a.AgreementRepo.GetAgreement(context.Background(), agreementID)
	if err != nil {
		return err
	} else if userID != agreement.CreatorID && userID != agreement.AcceptorID {
		return fmt.Errorf("unauthorized access")

	} else if agreement.CreatorSigned && agreement.AcceptorSigned && !wantToSign {
		return fmt.Errorf("can't unsign when both parties agreed to sign already")

	}

	if userID == agreement.CreatorID {
		agreement.CreatorSigned = wantToSign
		if agreement.AcceptorSigned {
			agreement.Status = domain.SIGNED_STATUS
		} else {
			agreement.Status = domain.PENDING_STATUS
		}

	} else {
		agreement.AcceptorSigned = wantToSign
		if agreement.CreatorSigned {
			agreement.Status = domain.SIGNED_STATUS
		} else {
			agreement.Status = domain.PENDING_STATUS
		}

	}

	_, err = a.AgreementRepo.UpdateAgreement(context.Background(), agreementID, agreement)
	return err
}

// SoftDeleteAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) SoftDeleteAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID) error {
	resAgree, err := a.AgreementRepo.GetAgreement(context.Background(), agreementID)
	if err != nil {
		return err
	}
	// if unathorized user wants to delete it by mistake
	if resAgree.CreatorID != userID && resAgree.AcceptorID != userID {
		return fmt.Errorf("unauthorized access")
	}

	// one of the IsDeleted will become true when either party wants to delete their agreement
	if resAgree.CreatorID == userID {
		resAgree.IsDeletedByCreator = true
	} else {
		resAgree.IsDeletedByAcceptor = true
	}
	//? if both parties want to delete the agreement then the deletedAt will have the time stamp of now | edit* this function is handled at database level

	_, err = a.AgreementRepo.UpdateAgreement(context.Background(), resAgree.ID, resAgree)

	return err
}

// UpdateAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) UpdateAgreement(agreementID primitive.ObjectID, newAgreement *domain.Agreement) (*domain.Agreement, error) {
	return a.AgreementRepo.UpdateAgreement(context.Background(), agreementID, newAgreement)
}

// DuplicateAgreement duplicates an existing agreement, but for a different party.
// It returns the new intake and the AI-generated draft to the frontend.
func (a *AgreementUseCase) DuplicateAgreement(originalAgreementID primitive.ObjectID, newAcceptorEmail string, callerID primitive.ObjectID) (*domain.Intake, *domain.Draft, error) {
	// 1. Get the original agreement and its associated intake.
	originalAgreement, err := a.AgreementRepo.GetAgreement(context.Background(), originalAgreementID)
	if err != nil {
		return nil, nil, err
	}

	// 2. Authorize the caller. Only the original Creator or Acceptor can duplicate.
	if callerID != originalAgreement.CreatorID && callerID != originalAgreement.AcceptorID {
		return nil, nil, fmt.Errorf("unauthorized access: only the original parties can duplicate this agreement")
	}

	originalIntake, err := a.IntakeRepo.GetIntake(context.Background(), originalAgreement.IntakeID)
	if err != nil {
		return nil, nil, err
	}

	// 3. Create a new intake object (a deep copy) and update the parties.
	newIntake := *originalIntake // Shallow copy
	if newIntake.Parties != nil {
		newParties := make([]domain.Party, len(newIntake.Parties))
		copy(newParties, newIntake.Parties) // Deep copy the slice

		if len(newParties) >= 2 {
			// A simple swap: the caller becomes the new creator (Party A),
			// and the new acceptor becomes the new Party B.
			originalCallerEmail := ""
			// Find the caller's email from the original intake.
			if callerID == originalAgreement.CreatorID {
				// The creator's email might not be in the intake, but we need it for the AI prompt.
				// This is a potential gap. Assuming you can get the creator's email from a UserRepo.
				// For now, let's use the original party's email for the swap.
				originalCallerEmail = newParties[0].Email
			} else { // callerID == originalAgreement.AcceptorID
				originalCallerEmail = newParties[1].Email
			}

			// Simple party swap logic.
			newParties[0].Email = newAcceptorEmail
			newParties[1].Email = originalCallerEmail

		} else if len(newParties) == 1 {
			// If only one party, add the new acceptor as the second party.
			newParties = append(newParties, domain.Party{Email: newAcceptorEmail})
		}
		newIntake.Parties = newParties
	}

	// 4. Call the AI to generate a new draft from the modified intake.
	// We're using the AI's GenerateDocumentDraft function as it's designed for this.
	newDraft, err := a.AIInteraction.GenerateDocumentDraft(context.Background(), &newIntake, "en")
	if err != nil {
		return nil, nil, err
	}

	// 5. Return the new intake and draft. The frontend will handle PDF creation and saving.
	return &newIntake, newDraft, nil
}
func NewAgreementUseCase(intakeRepo domainInter.IIntakeRepo, agreementRepo domainInter.IAgreementRepo, pendingRepo domainInter.IPendingAgreementRepo, aiInteraction domainInter.IAIInteraction, sweetNotification domainInter.INotification_, emailService *infrastracture.GeneralEmailService) domainInter.IAgreementUseCase {

	return &AgreementUseCase{
		IntakeRepo:        intakeRepo,
		AgreementRepo:     agreementRepo,
		PendingRepo:       pendingRepo,
		AIInteraction:     aiInteraction,
		NotificatoinRepo_: sweetNotification,
		EmailService:      emailService,
	}
}
