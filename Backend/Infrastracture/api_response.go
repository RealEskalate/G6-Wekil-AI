package infrastracture

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

type ResponseData struct {
	Message   string      `json:"message"`
	Payload   interface{} `json:"payload,omitempty"`
	ErrorType string      `json:"errorType,omitempty"`
}

// NewSuccessResponse creates a successful response with a data payload.
func NewSuccessResponse(message string, data interface{}) APIResponse {
	return APIResponse{
		Success: true,
		Data: ResponseData{
			Message: message,
			Payload: data,
		},
	}
}

// NewErrorResponse creates an error response.
func NewErrorResponse(message, errorType string) APIResponse {
	return APIResponse{
		Success: false,
		Data: ResponseData{
			Message:   message,
			ErrorType: errorType,
		},
	}
}