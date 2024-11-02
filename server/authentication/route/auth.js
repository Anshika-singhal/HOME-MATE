const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/user'); // Change 'user' to 'User'
const {validateSignUpData} = require('../validation/validate');

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const userModel = new User({ firstName, lastName, emailId, password: passwordHash });
        const savedUser = await userModel.save();
        const token = await savedUser.getJWT();

        res.cookie('token', token, {
            expires: new Date(Date.now() + 1 * 360000),
        });
        res.status(201).json({ data: savedUser, message: "User added successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const isPasswordValid = await user.validatePassword(password);
        
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie('token', token, {
                expires: new Date(Date.now() + 1 * 360000),
            });
            res.send(user);
            // res.json({firstName:user.firstName, lastName:user.lastName, emailId:user.emailId});
        } else {
            res.status(400).json({ message: "Invalid credentials!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    });
    res.send("Logged out!");
});

module.exports = authRouter;
