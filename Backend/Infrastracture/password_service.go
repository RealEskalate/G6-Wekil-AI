package infrastracture

import (
	"regexp"

	"golang.org/x/crypto/bcrypt"
)

type PasswordService struct {
}

func NewPasswordService() *PasswordService {
	return &PasswordService{}
}
func (p *PasswordService) IsValidEmail(email string) bool {

	regex := `^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(email)
}
func (p *PasswordService) IsStrongPassword(password string) bool {
	var (
		uppercase = `[A-Z]`
		lowercase = `[a-z]`
		number    = `[0-9]`
		special   = `[!@#~$%^&*()_+|<>?:{}]`
	)

	if len(password) < 8 {
		return false
	}
	hasUpper := regexp.MustCompile(uppercase).MatchString(password)
	hasLower := regexp.MustCompile(lowercase).MatchString(password)
	hasNumber := regexp.MustCompile(number).MatchString(password)
	hasSpecial := regexp.MustCompile(special).MatchString(password)

	return hasUpper && hasLower && hasNumber && hasSpecial
}

func (p *PasswordService) Hashpassword(password string) string {

	hashpassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	return string(hashpassword)
}

func (p *PasswordService) ComparePassword(userPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(password))
	return err
}
