const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        'RANDOM_TOKEN_SECRET',
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
            const token = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                    }
                },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '10s' }
            );
            res.json({ token })
        }
    );
}

module.exports = { handleRefreshToken }