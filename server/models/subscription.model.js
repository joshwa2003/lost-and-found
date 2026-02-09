import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required']
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MembershipPlan',
            required: [true, 'Plan ID is required']
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'expired', 'cancelled'],
                message: 'Status must be active, expired, or cancelled'
            },
            default: 'active'
        },
        paymentStatus: {
            type: String,
            enum: {
                values: ['pending', 'completed'],
                message: 'Payment status must be pending or completed'
            },
            default: 'pending'
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative']
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Compound indexes for better query performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ planId: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ status: 1 });

// Virtual to check if subscription is currently valid
subscriptionSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.status === 'active' &&
        this.endDate > now &&
        this.paymentStatus === 'completed';
});

// Virtual to get remaining days
subscriptionSchema.virtual('remainingDays').get(function () {
    const now = new Date();
    const diff = this.endDate - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Pre-save middleware to calculate end date based on plan duration
subscriptionSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('startDate') || this.isModified('planId')) {
        try {
            const MembershipPlan = mongoose.model('MembershipPlan');
            const plan = await MembershipPlan.findById(this.planId);

            if (!plan) {
                throw new Error('Invalid plan ID');
            }

            // Calculate end date
            const startDate = new Date(this.startDate);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + plan.duration);
            this.endDate = endDate;

            // Set amount from plan
            if (!this.amount) {
                this.amount = plan.price;
            }

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Pre-save middleware to prevent multiple active subscriptions
subscriptionSchema.pre('save', async function (next) {
    if (this.isNew && this.status === 'active') {
        try {
            // Check for existing active subscription
            const existingSubscription = await mongoose.model('Subscription').findOne({
                userId: this.userId,
                status: 'active',
                _id: { $ne: this._id }
            });

            if (existingSubscription) {
                throw new Error('User already has an active subscription. Please cancel or wait for it to expire.');
            }

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Static method to get user's active subscription
subscriptionSchema.statics.getActiveSubscription = function (userId) {
    return this.findOne({
        userId,
        status: 'active',
        endDate: { $gt: new Date() }
    }).populate('planId');
};

// Static method to expire old subscriptions
subscriptionSchema.statics.expireOldSubscriptions = async function () {
    const now = new Date();
    return await this.updateMany(
        {
            status: 'active',
            endDate: { $lt: now }
        },
        {
            status: 'expired'
        }
    );
};

// Instance method to cancel subscription
subscriptionSchema.methods.cancel = async function () {
    this.status = 'cancelled';
    return await this.save();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
