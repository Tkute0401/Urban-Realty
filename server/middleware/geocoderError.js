exports.handleGeocoderError = (err, req, res, next) => {
  if (err.message.includes('Geocoding')) {
    return res.status(400).json({
      success: false,
      error: 'Could not process the provided address'
    });
  }
  next(err);
};