const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a user by ID
router.get('/:id', authenticateToken, getUser, (req, res) => {
    res.json(res.user);
});

// Create a new user (Admin only)
router.post('/', authenticateToken, authorizeRole(['Admin']), async (req, res) => {
    const { emailId, status, firstName, mobile, employeeId, role, password } = req.body;

    if (!await Role.exists({ _id: role })) {
        return res.status(400).json({ message: 'Invalid role ID' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        emailId,
        status,
        firstName,
        mobile,
        employeeId,
        role,
        password: hashedPassword
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a user
router.patch('/:id', authenticateToken, getUser, async (req, res) => {
    const { emailId, status, firstName, mobile, employeeId, role } = req.body;

    if (emailId != null) res.user.emailId = emailId;
    if (status != null) res.user.status = status;
    if (firstName != null) res.user.firstName = firstName;
    if (mobile != null) res.user.mobile = mobile;
    if (employeeId != null) res.user.employeeId = employeeId;
    if (role != null) {
        if (!await Role.exists({ _id: role })) {
            return res.status(400).json({ message: 'Invalid role ID' });
        }
        res.user.role = role;
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a user (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), getUser, async (req, res) => {
    try {
        await res.user.remove();
        res.json({ message: 'Deleted user' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get user by ID
async function getUser(req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id).populate('role');
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;
