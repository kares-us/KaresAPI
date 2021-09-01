function sendJsonResponse(res, code, msg = '', data = {}) {
  return res.status(code).json({ code, message: msg, data })
}

module.exports = {
  sendJsonResponse
}