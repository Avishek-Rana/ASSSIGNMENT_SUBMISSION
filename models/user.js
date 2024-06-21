const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    emailId: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    firstName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please fill a valid mobile number']
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
