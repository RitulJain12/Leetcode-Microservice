const userModel = require('../models/user.model');
const broker = require('../services/broker');

async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;

        const hash = await userModel.hashpass(password);

        const user = await userModel.create({
            name,
            email,
            password: hash,
        });
        const token = user.jwt(user._id, email);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });

        const msg = {
            id: user._id,
            email: user.email,
            name: user.name
        }

        await broker.publishToQueue('Pofile-Creation', JSON.stringify(msg));

        res.status(201).json({ message: "User registered successfully", user });

    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }


}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await user.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = user.jwt(user._id, email);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "User logged in successfully", user });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
}


async function getMe(req, res) {
    try {
        console.log("getMe called for user:", req.user.id);
        const user = await userModel.findById(req.user.id);
        res.status(200).json({ message: "User fetched successfully", user });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
}

async function getUserById(req, res) {
    try {
        const user = await userModel.findById(req.params.id);
        res.status(200).json({ message: "User fetched successfully", user });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
}

async function getRole(req, res) {
    try {
        const { id } = req.params;
        const User = await userModel.findById(id).select('+name +role +email');
        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            ...User._doc
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging out user", error: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        await userModel.findByIdAndDelete(req.user.id);
        res.clearCookie('token');
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
}

module.exports = {
    createUser,
    loginUser,
    getMe,
    getUserById,
    getRole,
    logoutUser,
    deleteUser
}