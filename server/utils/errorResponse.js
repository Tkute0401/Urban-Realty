class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    console.log('🔧 ErrorResponse created:', {
      message,
      statusCode,
      stack: this.stack
    });
  }
}

module.exports = ErrorResponse;