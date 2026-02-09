import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema(
    {
        planName: {
            type: String,
            required: [true, 'Plan name is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Plan name must be at least 3 characters'],
            maxlength: [50, 'Plan name cannot exceed 50 characters']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
            validate: {
                validator: function (value) {
                    return value > 0;
                },
                message: 'Price must be greater than 0'
            }
        },
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [1, 'Duration must be at least 1 month'],
            max: [24, 'Duration cannot exceed 24 months']
        },
        features: {
            type: [String],
            default: [],
            validate: {
                validator: function (array) {
                    return array.length > 0;
                },
                message: 'At least one feature must be provided'
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters']
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
membershipPlanSchema.index({ planName: 1 });
membershipPlanSchema.index({ isActive: 1 });
membershipPlanSchema.index({ price: 1 });

// Virtual to get all subscriptions for this plan
membershipPlanSchema.virtual('subscriptions', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'planId'
});

// Virtual to calculate monthly price
membershipPlanSchema.virtual('monthlyPrice').get(function () {
    return Math.round((this.price / this.duration) * 100) / 100;
});

// Static method to get active plans
membershipPlanSchema.statics.getActivePlans = function () {
    return this.find({ isActive: true }).sort({ price: 1 });
};

// Static method to get plan by name
membershipPlanSchema.statics.findByName = function (name) {
    return this.findOne({ planName: name, isActive: true });
};

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema);

export default MembershipPlan;
