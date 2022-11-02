const User = require('../models/User');
const UserList = require('../models/UserSeriesList');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email : req.body.email.toLowerCase().trim().toString(), 
                password : hash
            });
            const userList = new UserList({
                creator_id : user._id,
                series: [],
            })
            // console.log(userList)
            user.save()
                .then(() => {
                    userList.save()
                    return res.status(201).json({ message: 'User created.'})
                })
                .catch(error => res.status(400).json({ error, message : 'Mail already used.' }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = async (req, res) => {
    // const { email, password } = req.body;
    const email = req.body.email.toLowerCase().trim().toString();
    const password = req.body.password;
    if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) return res.status(401).json({ message : 'Wrong email/password'}); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        const token = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "userId": foundUser._id,
                }
            },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(token);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ token });

    } else {
        res.status(401).json({ message : 'Wrong email/password'});
    }
};