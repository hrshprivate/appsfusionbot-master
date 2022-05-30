const jwt = require('jsonwebtoken')

// Decode and verify auth token
function _decodeJWT(req) {
  let token = req.header('authorization')
  let chechBearer = "Bearer "
  
  token && token.includes(chechBearer) && (token = token.slice(chechBearer.length,token.length))
      
  if (!token) return null

  try {
    return jwt.verify(token, process.env.JWT_PRIVATE_KEY)
  } catch (error) {
    return null
  }
}

// Generate auth token
function generateJWT(user) {
  const payload = {
    username: user.username,
    id: user._id
  }

  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY)
}

// Get username from auth token
function getUsername(req) {
  const user = _decodeJWT(req)
  if (!user) return null

  return user.username
}

// Get user id from auth token
function getUserId(req) {
  const user = _decodeJWT(req)
  if (!user) return null

  return user.id
}

// Require login middleware
function requireLogin(req, res, next) {
  const user = _decodeJWT(req)

  if (!user)
    return res.status(401).json({ error: 'Not authorized! Please login.' })
  
  next()
}

module.exports = {
  generateJWT,
  getUsername,
  getUserId,
  requireLogin
}
