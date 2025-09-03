package usecases

import (
	"context"
	"fmt"
	"time"
	domain "wekil_ai/Domain"
	domainInter "wekil_ai/Domain/Interfaces"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AgreementUseCase struct {
	IntakeRepo    domainInter.IIntakeRepo
	AgreementRepo domainInter.IAgreementRepo
	PendingRepo   domainInter.IPendingAgreementRepo
}

// SendAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) SendAgreement(receiverEmail string, agreement *domain.Agreement) error {
	pendingAgreement := domain.PendingAgreement{
		AgreementID:   agreement.ID,
		CreatorID:     agreement.CreatorID,
		AcceptorEmail: receiverEmail,
	}
	_, err := a.PendingRepo.CreatePendingAgreement(context.Background(), &pendingAgreement)
	return err
}

// CreateAgreement implements domain.IAgreementUseCase.
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
	if storedAgreement.Status == domain.PENDING_STATUS {
		if acceptorEmail == "" {
			return nil, fmt.Errorf("empty acceptor email found")
		}
		err := a.SendAgreement(acceptorEmail, storedAgreement)
		if err != nil {
			return nil, err
		}
	}
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
func (a *AgreementUseCase) GetAgreementByID(agreementID primitive.ObjectID) (*domain.Agreement, error) {
	resAgree, err := a.AgreementRepo.GetAgreement(context.Background(), agreementID)
	if err != nil{
		return nil, err
	}else if ! (resAgree.IsDeletedByAcceptor || resAgree.IsDeletedByCreator){
		return nil, fmt.Errorf("trying to access deleted agreement")
	}
	return resAgree, nil
}

// GetAgreementsByUserID implements domain.IAgreementUseCase.
func (a *AgreementUseCase) GetAgreementsByUserID(userID primitive.ObjectID, pageNumber int) ([]*domain.Agreement, error) {
	listOfAgreement, err := a.AgreementRepo.GetAgreementsByPartyID(context.Background(), userID, pageNumber)
	if err != nil {
		return nil, err
	}
	undeletedAgreements := []*domain.Agreement{}
	for _, agreement := range listOfAgreement {
		if agreement.IsDeletedByAcceptor || agreement.IsDeletedByCreator {
			undeletedAgreements = append(undeletedAgreements, agreement)
		}
	}
	return undeletedAgreements, nil
}

// SignAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) SignAgreement(agreementID primitive.ObjectID, userID primitive.ObjectID) error {
	agreement, err := a.AgreementRepo.GetAgreement(context.Background(), userID)
	if err != nil {
		return err
	} else if userID != agreement.CreatorID && userID != agreement.AcceptorID {
		return fmt.Errorf("unauthorized access")
	}
	if userID == agreement.CreatorID {
		agreement.CreatorSigned = true
		if agreement.AcceptorSigned {
			agreement.Status = domain.SIGNED_STATUS
		} else {
			agreement.Status = domain.PENDING_STATUS
		}
	} else {
		agreement.AcceptorSigned = true
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
	_, err := a.AgreementRepo.SoftDeleteAgreement(context.Background(), agreementID, userID)
	
	return err
}

// UpdateAgreement implements domain.IAgreementUseCase.
func (a *AgreementUseCase) UpdateAgreement(agreementID primitive.ObjectID, newAgreement *domain.Agreement) (*domain.Agreement, error) {
	return a.AgreementRepo.UpdateAgreement(context.Background(), agreementID, newAgreement)
}

func NewAgreementUseCase(intakeRepo domainInter.IIntakeRepo, agreementRepo domainInter.IAgreementRepo, pendingRepo domainInter.IPendingAgreementRepo) domainInter.IAgreementUseCase {

	return &AgreementUseCase{
		IntakeRepo:    intakeRepo,
		AgreementRepo: agreementRepo,
		PendingRepo:   pendingRepo,
	}
}
