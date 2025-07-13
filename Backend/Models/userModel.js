const mongoose = require("mongoose");


const UserSchema = mongoose.Schema(
    {
        Username: {
            type: String,
            required: true
        },
        Email: {
            type: String,
            required: true
        },
        Password: {
            type: String,
            required: true
        },
        Phone: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            enum: ['admin', 'staff', 'user'],
            default: 'user'
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    });

const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = { UserModel };
