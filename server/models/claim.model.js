import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: [true, 'Item ID is required']
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        claimDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'collected'],
            default: 'pending'
        },
        adminComment: {
            type: String, // Optional reason for rejection/approval
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent same user from claiming same item multiple times
claimSchema.index({ itemId: 1, userId: 1 }, { unique: true });

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
