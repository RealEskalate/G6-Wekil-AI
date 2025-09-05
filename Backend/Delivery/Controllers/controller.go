package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	domain "wekil_ai/Domain"
	domainInterface "wekil_ai/Domain/Interfaces"
	infrastracture "wekil_ai/Infrastracture"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
)

type UserController struct {
	userUseCase domainInterface.IUserUseCase
	OAuthUseCase domainInterface.IOAuthUsecase

}

// RegisterIndividual implements domain.IUserController.
func (u *UserController) RegisterIndividualOnly(ctx *gin.Context) {
	var unverifiedUser domain.UnverifiedUserDTO
	if err := ctx.ShouldBindJSON(&unverifiedUser); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    "BAD_REQUEST",
			"message": err.Error(),
		})
		return
	}



	// Validate email format
	if !infrastracture.NewPasswordService().IsValidEmail(unverifiedUser.Email) {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    "INVALID_EMAIL",
			"message": "wrong email format",
		})
		return
	}

	// Validate password strength
	if !infrastracture.NewPasswordService().IsStrongPassword(unverifiedUser.Password) {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    "WEAK_PASSWORD",
			"message": "your password is not strong enough",
		})
		return
	}


	// Store in OTP collection
	err := u.userUseCase.StoreUserInOTPColl(ctx,&unverifiedUser)

	if err != nil {
		parts := strings.SplitN(err.Error(), ":", 2)
		code := parts[0]
		message := strings.TrimSpace(parts[1])

		ctx.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"success": false,
			"code":    code,
			"message": message,
		})
		return
	}

	// Success response
	ctx.JSON(http.StatusCreated, gin.H{
		"success": true,
		"code":    "OTP_SENT",
		"message": "OTP has been sent. Please verify your email.",
	})
}

func (u *UserController) ResendOTPHandler(ctx *gin.Context) {
	var req domain.ResendOTPRequestDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    "BAD_REQUEST",
			"message": "Invalid input",
		})
		return
	}

	err := u.userUseCase.ResendOTP(ctx, req.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    "SERVER_ERROR",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    "OTP_RESENT",
		"message": "OTP has been resent to your email.",
	})
}


// VerfiyOTPRequest implements domain.IUserController.
func (u *UserController) VerfiyOTPRequest(ctx *gin.Context) {
	var emailOTP domain.EmailOTP
	
	if err := ctx.ShouldBindJSON(&emailOTP); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"success": false,
			"code":    "BAD_REQUEST",
			"message": err.Error(),
		})
		return
	}

	userInfo, err := u.userUseCase.ValidOTPRequest(&emailOTP)
	if err != nil {
		// Extract error code from message (convention: CODE: msg)
		parts := strings.SplitN(err.Error(), ":", 2)
		code := parts[0]
		message := strings.TrimSpace(parts[1])

		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"code":    code,
			"message": message,
		})
		return
	}

	// Store user in main collection after verification
	_, err = u.userUseCase.StoreUserInMainColl(userInfo)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    "SERVER_ERROR",
			"message": err.Error(),
		})
		return
	}
	
	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"code":    "OTP_VERIFIED",
		"message": "Email successfully verified.",
	})
}



func (uc *UserController) ChangePasswordHandler(ctx *gin.Context) {
	var req domain.ChangePasswordRequestDTO

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "success": false})
		return
	}

	email := ctx.GetString("email")
	err := uc.userUseCase.ChangePassword(ctx, email, req.OldPassword, req.NewPassword)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Password changed successfully",
		},
	})
}



func (u *UserController) RefreshTokenHandler(ctx *gin.Context) {
	// get refresh token from cookie
	refreshToken, err := ctx.Cookie("WEKIL-API-REFRESH-TOKEN") //! don't forget to make the string in the cookie to a const
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Refresh token cookie not found"})
		return
	}
	// validate refresh token and if the refresh token is valid then
	accessToken,AccountType, err := u.userUseCase.ReSendAccessToken(refreshToken)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// send the access token to the user and send accepted status
	ctx.Header("Authorization", fmt.Sprintf("Bearer %s", accessToken))
	ctx.IndentedJSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"account_type":AccountType,
			"message": "Refreshed successfully. Tokens sent in header and cookie.",
		},
	})

}

func (uc *UserController) HandleLogin(ctx *gin.Context) {

	var user *domain.LoginDTO
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Invalid request payload","success": false,
		})
		return
	}
	if user.Email == "" || user.Password == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload","success": false,})
		return
	}
	accessToken,refreshToken,accountType, err := uc.userUseCase.Login(user.Email, user.Password)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	ctx.SetCookie(
		"WEKIL-API-REFRESH-TOKEN",
		refreshToken,
		60*60*24*7,      // 7 days in seconds
		"/",      // cookie path
		"",              // domain ("" means current domain)
		true,            // secure
		true,            // httpOnly
	)

	ctx.Header("Authorization", "Bearer "+accessToken)

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "login successful",
			"account_type":accountType,
		},
	})
}

func (uc *UserController) UpdateProfile(ctx *gin.Context) {
	var updateReq domain.UpdateProfileRequestDTO

	if err := ctx.ShouldBindJSON(&updateReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input","success": false,})
		return
	}

	email := ctx.GetString("email")
	err := uc.userUseCase.UpdateProfile(ctx, email, &updateReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile","success": false,})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully","success": true,})
}

func (uc *UserController) GetProfile(ctx *gin.Context) {
	email := ctx.GetString("email")
	log.Println("id============---------:", email)
	profile, err := uc.userUseCase.GetProfile(ctx, email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve profile!!","success": false,})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    profile,
	})
}

func (uc UserController) Logout(ctx *gin.Context) {
		userID := ctx.GetString("user_id")
		log.Println("id============:", userID)

		err := uc.userUseCase.Logout(ctx, userID)
			if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "logout failed*****","success": false,})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{
			"success": true,
		"data": gin.H{
			"message": "logged out successfully",
		},
	})
	}


func (u *UserController) SendResetOTP(c *gin.Context) {
	var req domain.ForgotPasswordRequestDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(),"success": false,})
		return
	}

	log.Println("Forgot password request received for:", req.Email)

	err := u.userUseCase.SendResetOTP(c, req.Email)
	if err != nil {
		log.Println("SendResetOTP error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send reset OTP","success": false,})
		return
	}

	c.JSON(http.StatusOK, gin.H{
			"success": true,
		"data": gin.H{
			"message": "Reset OTP sent to your email address",
		},
	})
}


func (uc *UserController) ResetPassword(c *gin.Context) {
	var req domain.ResetPasswordRequestDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input","success": false,})
		return
	}

	err := uc.userUseCase.ResetPassword(c, req.Email, req.OTP, req.NewPassword)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(),"success": false,})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"message": "Password reset successfully",
		},
		})
}



func (uc *UserController) SignInWithProvider(c *gin.Context) {

	provider := c.Param("provider")
	q := c.Request.URL.Query()
	q.Add("provider", provider)
	c.Request.URL.RawQuery = q.Encode()
	// req := c.Request
	// req = req.WithContext(context.WithValue(req.Context(), "provider", provider))
	gothic.BeginAuthHandler(c.Writer, c.Request)
}

func (uc *UserController) CallbackHandler(c *gin.Context) {

	provider := c.Param("provider")
	q := c.Request.URL.Query()
	q.Add("provider", provider)
	c.Request.URL.RawQuery = q.Encode()
	// req := c.Request
	// fmt.Println("^^^^^",provider)
	// req = req.WithContext(context.WithValue(c.Request.Context(), "provider", provider))

	_,accessToken,refreshToken, err := uc.OAuthUseCase.HandleOAuthLogin(c.Request, c.Writer)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	c.SetCookie(
		"WEKIL-API-REFRESH-TOKEN",
		refreshToken,
		60*60*24*7,      // 7 days in seconds
		"/",      // cookie path
		"",              // domain ("" means current domain)
		true,            // secure
		true,            // httpOnly
	)

	c.Header("Authorization", "Bearer "+accessToken)
	redirectURL := "http://localhost:3000/dashboard"
	c.Redirect(http.StatusFound, redirectURL)

	// c.JSON(http.StatusOK, gin.H{
	// 	"success": true,
	// 	"data": gin.H{
	// 		"message": "login successful",
	// 		"user": user,
	// 	},
	// })

	// c.JSON(http.StatusOK, gin.H{"message": "Logged in", "user": user})

	// user, err := gothic.CompleteUserAuth(c.Writer, c.Request)

	// if err != nil {
	// 	c.AbortWithError(http.StatusInternalServerError, err)
	// 	return
	// }

	// c.Redirect(http.StatusTemporaryRedirect, "/success")
}
func (uc *UserController) Success(c *gin.Context) {

	c.Data(http.StatusOK, "text/html; charset=utf-8", fmt.Appendf(nil, `
      <div style="
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
      ">
          <h1 style="
              color: #333;
              margin-bottom: 20px;
          ">You have Successfull signed in!</h1>
          
          </div>
      </div>
  `))
}

func (uc *UserController) HandleNotifications(ctx *gin.Context) {
	userId := ctx.GetString("user_id")

	// Read query params for pagination
	pageStr := ctx.DefaultQuery("page", "1")
	limitStr := ctx.DefaultQuery("limit", "10")

	page, _ := strconv.ParseInt(pageStr, 10, 64)
	limit, _ := strconv.ParseInt(limitStr, 10, 64)

	notify, err := uc.userUseCase.GetNotifications(userId, page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   err.Error(),
			"success": false,
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"success": true,
		"page":    page,
		"limit":   limit,
		"data":    notify,
	})
}



func NewUserController(userUseCase_ domainInterface.IUserUseCase,OAuthUsecase domainInterface.IOAuthUsecase) domainInterface.IUserController {
	return &UserController{
		userUseCase: userUseCase_,
		OAuthUseCase: OAuthUsecase,
	}
}
