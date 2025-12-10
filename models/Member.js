const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    surname: { type: String },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    email: { type: String, required: true }, // Removed unique: true to avoid errors with duplicate dummy emails if any, can add later
    mobile: { type: String, required: true },
    address: { type: String },
    occupation: { type: String },
    weight: { type: Number },
    height: { type: Number },
    age: { type: Number }, // Added age field
    disability: { type: String, enum: ['yes', 'no'], default: 'no' },
    disabilityDetail: { type: String },
    healthProblems: [{ type: String }],

    // Membership Details
    joinDate: { type: String, required: true }, // Keep as string "YYYY-MM-DD" for simplicity or Date
    duration: { type: String, required: true },
    endDate: { type: String },

    // Payment
    totalAmount: { type: Number },
    paidAmount: { type: Number },

    // Incharge
    incharge: { type: String },

    // Status
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
