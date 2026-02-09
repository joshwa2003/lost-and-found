import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [5, 'Title must be at least 5 characters'],
            maxlength: [100, 'Title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters'],
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },
        date: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Creator ID is required']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        priority: {
            type: String,
            enum: {
                values: ['low', 'medium', 'high'],
                message: 'Priority must be low, medium, or high'
            },
            default: 'medium'
        },
        expiryDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !value || value > this.date;
                },
                message: 'Expiry date must be after announcement date'
            }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
announcementSchema.index({ isActive: 1, date: -1 });
announcementSchema.index({ createdBy: 1 });
announcementSchema.index({ priority: 1 });

// Virtual to check if announcement has expired
announcementSchema.virtual('isExpired').get(function () {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
});

// Pre-save middleware to validate creator is admin
announcementSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('createdBy')) {
        try {
            const User = mongoose.model('User');
            const creator = await User.findById(this.createdBy);

            if (!creator) {
                throw new Error('Invalid creator ID');
            }

            if (creator.role !== 'admin') {
                throw new Error('Only admins can create announcements');
            }

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Static method to get active announcements
announcementSchema.statics.getActiveAnnouncements = function () {
    const now = new Date();
    return this.find({
        isActive: true,
        $or: [
            { expiryDate: null },
            { expiryDate: { $gt: now } }
        ]
    })
        .populate('createdBy', 'name email')
        .sort({ priority: -1, date: -1 });
};

// Static method to get announcements by priority
announcementSchema.statics.getByPriority = function (priority) {
    return this.find({
        isActive: true,
        priority: priority
    })
        .populate('createdBy', 'name email')
        .sort({ date: -1 });
};

// Instance method to deactivate announcement
announcementSchema.methods.deactivate = async function () {
    this.isActive = false;
    return await this.save();
};

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
