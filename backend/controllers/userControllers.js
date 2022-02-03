const asyncHandler = require("express-async-handler");
const res = require("express/lib/response");
const User = require('../models/userModel');

// @description --> Register new user
// @route --> POST/api/user
// @access --> Public
const registerUser = asyncHandler(async(req, res) => {

    const { name, email, password, pic } = req.body;

    // check if all the fields are filled
    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    // check if new user already exists in the db
    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    // otherwise --> create a new user
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    // if the user is created successfully
    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
        });
    } else {
        res.status(400);
        throw new Error("Failed to create a new user");
    }

});

module.exports = { registerUser };