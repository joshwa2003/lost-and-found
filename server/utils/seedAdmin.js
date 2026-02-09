import User from '../models/user.model.js';

const createDefaultAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@gym.com' });

        if (!adminExists) {
            console.log('Creating default admin user...');

            const adminUser = await User.create({
                name: 'System Admin',
                email: 'admin@gym.com',
                password: 'admin123',
                role: 'admin',
                phone: '1234567890',
                membershipType: 'Staff',
                isActive: true
            });

            console.log(`\x1b[32m%s\x1b[0m`, `Default Admin Created: ${adminUser.email} / admin123`);
        } else {
            // console.log('Admin user already exists');
        }
    } catch (error) {
        console.error(`Error creating default admin: ${error.message}`);
    }
};

export default createDefaultAdmin;
