const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../model/auth');

const JWT_SECRET = 'helloworld';
const JWT_SECRET_RESET = 'resethere';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'demoid0077@gmail.com',
        pass: 'scximtsfpeldqwav'
    }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Signup success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/sendpasswordlink', body('email').isEmail().withMessage('Invalid email format'), async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET_RESET, { expiresIn: '5m' });

        const mailOptions = {
            from: 'demoid0077@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            background-color: rgba(0, 0, 0, 0.7);
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            color: white;
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-body {
            background-color: grey;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: white;
        }
        .bold {
            font-weight: bold;
        }
        #a{
      color:red;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="email-body">
            <p class="bold">Your requested password reset link:</p>
            <h3>Click <a href="http://localhost:5173/resetpassword/${token}" id="a">here</a> to reset your password</h3>
        </div>
        <div class="email-footer">
            <p>This link expires within 5 mintues !!! </p>
        </div>
    </div>
</body>
</html>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset link sent successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET_RESET);
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.updateOne({ _id: decoded.id }, { $set: { password: hashedPassword } });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Token has expired or is invalid' });
    }
});

module.exports = router;
