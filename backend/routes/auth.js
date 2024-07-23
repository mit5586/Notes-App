const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/getuser')

const router = express.Router();
const JWT_SECRET = "MitIsAGoodB@@@@iiHALLO"

//Route: 1 Create a User using: POST "/api/auth/createuser". Doesn't require login
router.post('/createuser', [
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'enter a valid password').isLength({ min: 5 })
],
    async (req, res) => {
        //if there are errors return bad request
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                success = false;
                return res.status(400).json({success,  message: "User with Email already exists" })
            }
            const salt = await bcrypt.genSalt(10)
            const secPass = await bcrypt.hash(req.body.password, salt);
            // create a user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })

            let data = { user: user._id }
            const authToken = jwt.sign(data, JWT_SECRET);

            success = true
            res.json({success, authToken })

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "internal server error occured", message: error.message })
        }
    })

//Route: 2 authenticate a user: POST "/api/auth/login". Doesn't require login
router.post('/login', [
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {

    //if there are errors return bad request
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
        return res.status(400).json({success, errors: errors.array() });
    }

    const {email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user){
            success = false;
            return res.status(400).json({success, error: "please try to login with correct credentials"});
        }
        
        const passCompare = await bcrypt.compare(password, user.password);
        if(!passCompare){
            success = false;
            return res.status(400).json({success, error: "please try to login with correct credentials"});
        }
        let data = { user: user._id }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error occured", message: error.message }) 
    }

})

//Route: 3 fetching user details: POST "/api/auth/getuser". require login
router.post('/getuser',fetchUser,  async(req, res)=>{
    try {
        const userId = req.user
        const user = await User.findById(userId).select('-password')
        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error occured", message: error.message }) 
    }
})
module.exports = router