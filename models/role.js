const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: {
            values: ['Initiator', 'Approver', 'Admin', 'DataManager'],
            message: 'Invalid role name'
        }
    },
    accessLevels: {
        type: Map,
        of: {
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false }
        },
        default: {}
    }
});

// Allow custom roles only if created by Admin
roleSchema.pre('validate', function (next) {
    if (!['Initiator', 'Approver', 'Admin', 'DataManager'].includes(this.name)) {
        this.accessLevels = {};  // Allow custom access levels for custom roles
    }
    next();
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
