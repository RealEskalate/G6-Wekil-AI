package infrastracture

import (
	"fmt"
	"os"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"math/rand"
	"time"
)

type GeneralEmailService struct{
}

func NewGeneralEmailService()*GeneralEmailService{
	return &GeneralEmailService{}
}
func (o *GeneralEmailService) GenerateOTP() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func (o *GeneralEmailService) SendOTP(toEmail, otp string) error {
	from := mail.NewEmail("wekilai", os.Getenv("SENDER_EMAIL")) 
	subject := "Verify your Wekilai account"
	to := mail.NewEmail("", toEmail)

	plainText := fmt.Sprintf("Your OTP is: %s", otp)
	htmlText := fmt.Sprintf("<strong>Your OTP is: %s</strong>", otp)

	message := mail.NewSingleEmail(from, subject, to, plainText, htmlText)

	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	response, err := client.Send(message)

	// Debug response
	fmt.Println("SendGrid Status Code:", response.StatusCode)
	fmt.Println("SendGrid Response Body:", response.Body)
	fmt.Println("SendGrid Headers:", response.Headers)

	if err != nil {
		return err
	}
	if response.StatusCode >= 400 {
		return fmt.Errorf("sendgrid failed: %v", response.Body)
	}
	return nil
}
func (s *GeneralEmailService) SendAgreementLink(toEmail, agreementLink string) error {
    from := mail.NewEmail("Wekilai", os.Getenv("SENDER_EMAIL"))
    subject := "Action Required: Please Review and Sign the Agreement"
    to := mail.NewEmail("", toEmail)

    // The plain text version of the email for clients that don't support HTML
    plainText := fmt.Sprintf("Hello,\n\nPlease review and sign the agreement at the following link: %s\n\nThank you,\nWekilai Team", agreementLink)

    // The HTML version of the email with a clickable button
    htmlText := fmt.Sprintf(`
        <p>Hello,</p>
        <p>Please review and sign the agreement by clicking the button below:</p>
        <p>
            <a href="%s" style="background-color:#4CAF50;border:none;color:white;padding:15px 32px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;margin:4px 2px;cursor:pointer;">Review and Sign Agreement</a>
        </p>
        <p>Thank you,</p>
        <p>Wekilai Team</p>
    `, agreementLink)

    message := mail.NewSingleEmail(from, subject, to, plainText, htmlText)

    client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
    response, err := client.Send(message)

    // Debugging and error handling
    fmt.Println("SendGrid Status Code:", response.StatusCode)
    fmt.Println("SendGrid Response Body:", response.Body)

    if err != nil {
        return fmt.Errorf("failed to send email: %w", err)
    }
    if response.StatusCode >= 400 {
        return fmt.Errorf("sendgrid API error, status code: %d, response body: %s", response.StatusCode, response.Body)
    }

    return nil
}