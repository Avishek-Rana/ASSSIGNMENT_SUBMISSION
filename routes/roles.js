const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all roles
router.get('/', authenticateToken, async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a role by ID
router.get('/:id', authenticateToken, getRole, (req, res) => {
    res.json(res.role);
});

// Create a new role (Admin only)
router.post('/', authenticateToken, authorizeRole(['Admin']), async (req, res) => {
    const { name, accessLevels } = req.body;

    if (['Initiator', 'Approver', 'Admin', 'DataManager'].includes(name)) {
        return res.status(400).json({ message: 'Cannot create a role with a reserved name' });
    }

    const role = new Role({ name, accessLevels });

    try {
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a role (Admin only)
router.patch('/:id', authenticateToken, authorizeRole(['Admin']), getRole, async (req, res) => {
    const { name, accessLevels } = req.body;

    if (name != null) res.role.name = name;
    if (accessLevels != null) res.role.accessLevels = accessLevels;

    try {
        const updatedRole = await res.role.save();
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a role (Admin only)
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), getRole, async (req, res) => {
    try {
        await res.role.remove();
        res.json({ message: 'Deleted role' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get role by ID
async function getRole(req, res, next) {
    let role;
    try {
        role = await Role.findById(req.params.id);
        if (role == null) {
            return res.status(404).json({ message: 'Cannot find role' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.role = role;
    next();
}

module.exports = router;
