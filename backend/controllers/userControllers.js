const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const Admin = require('../models/AdminModel');
const generateToken = require('../config/generateJsonWebToken');

//@description --> Get or Search all users
//@route --> GET /api/user?search=
//@access --> Public
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

// @description --> Register new user
// @route --> POST /api/user
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

    if(name === "Admin" || email === "admin@gmail.com") {
        // store the admin in the database
        const admin = await Admin.create({
            name,
            email,
            password,
            pic,
        });
    
        // if the admin is created successfully
        if(admin) {
            res.status(201).json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                pic: admin.pic,
                token: generateToken(admin._id)
            });
        } else {
            res.status(400);
            throw new Error("Failed to add the admin");
        }
    } else {

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
                token: generateToken(user._id)
            });
        } else {
            res.status(400);
            throw new Error("Failed to create a new user");
        }
    }


});


// @description --> Authenticate the user
// @route --> POST /api/user/login
// @access --> Public
const authUser = asyncHandler(async(req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });

    if(!user && !admin) {
        res.status(400);
        throw new Error("User does not exist");
    }

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else if(admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            pic: admin.pic,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }

});

module.exports = { registerUser, authUser, allUsers};