import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false // Don't return password by default in queries
        },
        role: {
            type: String,
            enum: {
                values: ['admin', 'user'],
                message: 'Role must be either admin or user'
            },
            default: 'user'
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [
                /^[0-9]{10}$/,
                'Please provide a valid 10-digit phone number'
            ]
        },
        membershipType: {
            type: String,
            trim: true
        },
        joiningDate: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual field to get user's active subscription
userSchema.virtual('activeSubscription', {
    ref: 'Subscription',
    localField: '_id',
    foreignField: 'userId',
    justOne: true,
    match: { status: 'active' }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to check if user is admin
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

export default User;
