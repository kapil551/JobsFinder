
/*
Now what I'm gonna do when it registers a new user, I want to create a new jwt token and send it to our user so after the registration is done I want to generate a new jwt token.
*/

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn:'30d',
    });
};

module.exports = generateToken;