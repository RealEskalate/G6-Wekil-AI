package infrastracture

import (
	"fmt"
	"os"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func SendOTP(toEmail, otp string) error {
	from := mail.NewEmail("blogapp", os.Getenv("SENDER_EMAIL")) 
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
