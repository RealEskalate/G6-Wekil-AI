package infrastracture

type APIResponse struct {
    Success     bool        `json:"success"`
    Message     string      `json:"message"`
    Data        interface{} `json:"data,omitempty"`
    ErrorType   string    `json:"errorType,omitempty"`
}

// NewSuccessResponse creates a successful response with a data payload.
func NewSuccessResponse(message string, data interface{}) APIResponse {
    return APIResponse{
        Success: true,
        Message: message,
        Data:    data,
    }
}

// NewErrorResponse creates an error response.
func NewErrorResponse(message, errorType string) APIResponse {
    return APIResponse{
        Success: false,
        Message: message,
         ErrorType: errorType,
    }
}