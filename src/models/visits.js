import mongoose from 'mongoose';

const objID = mongoose.Schema.Types.ObjectId;

const visitSchema = new mongoose.Schema({
    visitor: {
        type: objID,
        ref: 'Visitor',
        required: true
    },
    employee: {
        type: objID,
        ref: 'User',
        required: true
    },
    entryTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    exitTime: {
        type: Date,
        default: null
    },
    duration: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        trim: true,
        required: true
    },
    relatedTo: {
        type: objID,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        trim: true
    },
    visitorType: {
        type: String,
        enum: ['visitor', 'appointment', 'passes', 'other'],//can be changed 
        default: 'visitor',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
export const Visit = mongoose.model('Visit', visitSchema);

