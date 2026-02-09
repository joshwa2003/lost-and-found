import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:5001/api';
let userToken = '';
let adminToken = '';
let testItemId = '';
let testClaimId = '';

// Test Data
const userData = {
    name: 'Test Claims User',
    email: `testclaim${Date.now()}@gym.com`, // Unique email
    password: 'password123',
    phone: '1234567890',
    membershipType: 'Member'
};
const adminData = { email: 'admin@gym.com', password: 'admin123' }; // Seeded credentials

const log = (msg, type = 'INFO') => {
    const icons = { INFO: 'ℹ️', SUCCESS: '✅', ERROR: '❌', WARN: '⚠️' };
    console.log(`${icons[type]} [${type}] ${msg}`);
};

const runTests = async () => {
    try {
        console.log('\n🚀 STARTING CLAIM SYSTEM API TESTS\n');

        // 0. Connectivity Check
        try {
            await axios.get(`${BASE_URL}/test`);
            log('Server is reachable', 'SUCCESS');
        } catch (e) {
            log(`Server Unreachable: ${e.message}`, 'ERROR');
            process.exit(1);
        }

        // 1. Register & Login User
        log('Registering New User...', 'INFO');
        try {
            await axios.post(`${BASE_URL}/auth/register`, userData);
            log('User registered successfully', 'SUCCESS');

            const userRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: userData.email,
                password: userData.password
            });
            userToken = userRes.data.token;
            log('User logged in successfully', 'SUCCESS');
        } catch (e) {
            const errorInfo = e.response ?
                `Status: ${e.response.status}, Data: ${JSON.stringify(e.response.data)}` :
                e.message;
            log(`User Auth Failed: ${errorInfo}`, 'ERROR');
            process.exit(1);
        }

        // 2. Login Admin
        log('Logging in as Admin...', 'INFO');
        try {
            const adminRes = await axios.post(`${BASE_URL}/auth/login`, adminData);
            adminToken = adminRes.data.token;
            log('Admin logged in successfully', 'SUCCESS');
        } catch (e) {
            log(`Admin Login Failed: ${e.response?.data?.message || e.message}`, 'ERROR');
            process.exit(1);
        }

        // 3. Create Test Item (Admin)
        log('Creating Test Item...', 'INFO');
        try {
            // Create a dummy image file if not exists
            const dummyImagePath = path.join(process.cwd(), 'test_image.png');
            if (!fs.existsSync(dummyImagePath)) {
                fs.writeFileSync(dummyImagePath, 'dummy content');
            }

            const formData = new FormData();
            formData.append('title', 'Test Item for Claims');
            formData.append('description', 'This is a test item to verify claims');
            formData.append('foundLocation', 'Test Lab');
            formData.append('foundDate', new Date().toISOString());
            formData.append('image', fs.createReadStream(dummyImagePath));

            const itemRes = await axios.post(`${BASE_URL}/items`, formData, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    ...formData.getHeaders()
                }
            });

            // Check response structure
            if (itemRes.data.success) {
                testItemId = itemRes.data.item._id;
                log(`Test Item Created: ${testItemId}`, 'SUCCESS');
            } else {
                throw new Error('Item creation failed: ' + JSON.stringify(itemRes.data));
            }

            // Cleanup dummy file
            fs.unlinkSync(dummyImagePath);
        } catch (e) {
            log(`Create Item Failed: ${e.response?.data?.message || e.message}`, 'ERROR');
            process.exit(1);
        }

        // 4. Submit Claim (User)
        log('User Submitting Claim...', 'INFO');
        try {
            const claimRes = await axios.post(`${BASE_URL}/claims`,
                { itemId: testItemId },
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );
            testClaimId = claimRes.data.data._id;
            log(`Claim Submitted: ${testClaimId} (Status: ${claimRes.data.data.status})`, 'SUCCESS');
        } catch (e) {
            log(`Submit Claim Failed: ${e.response?.data?.message || e.message}`, 'ERROR');
        }

        // 5. Try Duplicate Claim (User) - Should Fail
        log('Testing Duplicate Claim Prevention...', 'INFO');
        try {
            await axios.post(`${BASE_URL}/claims`,
                { itemId: testItemId },
                { headers: { 'Authorization': `Bearer ${userToken}` } }
            );
            log('Duplicate Claim Allowed (FAIL) ❌', 'ERROR');
        } catch (e) {
            if (e.response && e.response.status === 400) {
                log('Duplicate Claim Blocked correctly (400 Bad Request)', 'SUCCESS');
            } else {
                log(`Unexpected Error: ${e.message}`, 'WARN');
            }
        }

        // 6. View User Claims
        log('Fetching User Claims...', 'INFO');
        try {
            const myClaims = await axios.get(`${BASE_URL}/claims/user`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (myClaims.data.count > 0) {
                log(`User retrieved ${myClaims.data.count} claim(s)`, 'SUCCESS');
            } else {
                log('User claims not found', 'ERROR');
            }
        } catch (e) {
            log(`Get User Claims Failed: ${e.message}`, 'ERROR');
        }

        // 7. Approve Claim (Admin)
        log('Admin Approving Claim...', 'INFO');
        try {
            const approveRes = await axios.put(`${BASE_URL}/claims/${testClaimId}`,
                { status: 'approved', adminComment: 'Verified owner ID' },
                { headers: { 'Authorization': `Bearer ${adminToken}` } }
            );
            log(`Claim Status Updated: ${approveRes.data.data.status}`, 'SUCCESS');
        } catch (e) {
            log(`Approve Claim Failed: ${e.response?.data?.message || e.message}`, 'ERROR');
        }

        // 8. Verify Item Status Updated to 'claimed'
        log('Verifying Item Status Auto-Update...', 'INFO');
        try {
            const itemCheck = await axios.get(`${BASE_URL}/items/${testItemId}`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (itemCheck.data.item.status === 'claimed') {
                log('Item status automatically updated to "claimed"', 'SUCCESS');
            } else {
                log(`Item status failed to update! Current: ${itemCheck.data.item.status}`, 'ERROR');
            }
        } catch (e) {
            log(`Verify Item Failed: ${e.message}`, 'ERROR');
        }

        console.log('\n🎉 ALL TESTS COMPLETED!\n');

    } catch (error) {
        console.error('Test Suite Error:', error);
    }
};

runTests();
