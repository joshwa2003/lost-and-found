import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';

// Load environment variables
dotenv.config();

const seedUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create Admin User
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@gym.com',
            password: 'admin123',
            role: 'admin',
            phone: '1234567890',
            membershipType: 'Staff',
            isActive: true
        });
        console.log(`✅ Admin Created: ${admin.email} / admin123`);

        // Create Test User
        const testUser = await User.create({
            name: 'Test User',
            email: 'user@gym.com',
            password: 'user123',
            role: 'user',
            phone: '9876543210',
            membershipType: 'Premium',
            isActive: true
        });
        console.log(`✅ User Created: ${testUser.email} / user123`);

        console.log('\n✨ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error(`Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedUsers();
