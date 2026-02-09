import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add item title'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Please add item description'],
            maxlength: [500, 'Description cannot be more than 500 characters']
        },
        image: {
            type: String,
            required: [true, 'Please upload an item image']
        },
        foundLocation: {
            type: String,
            required: [true, 'Please specify where the item was found'],
            trim: true
        },
        foundDate: {
            type: Date,
            required: [true, 'Please specify when the item was found']
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['available', 'claimed'],
            default: 'available'
        }
    },
    {
        timestamps: true
    }
);

// Indexes for better query performance
itemSchema.index({ status: 1, foundDate: -1 });
itemSchema.index({ postedBy: 1 });

// Virtual for full image URL
itemSchema.virtual('imageUrl').get(function () {
    return `/uploads/${this.image}`;
});

// Pre-remove hook to delete image file when item is deleted
itemSchema.pre('remove', async function (next) {
    try {
        const fs = await import('fs');
        const path = await import('path');
        const imagePath = path.join(process.cwd(), 'uploads', this.image);

        // Check if file exists and delete it
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        next();
    } catch (error) {
        console.error('Error deleting image:', error);
        next();
    }
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
