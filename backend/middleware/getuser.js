const jwt = require('jsonwebtoken')
const JWT_SECRET = "MitIsAGoodB@@@@iiHALLO"

const fetchUser = (req, res, next) => {
    //get user from jwt token and add id to the req object 
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).json({ error: 'please authenticate using a valid token' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next();
    } catch (error) {
        res.status(401).json({ error: 'please authenticate using a valid token' })
    }

}

module.exports = fetchUser;