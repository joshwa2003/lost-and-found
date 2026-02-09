import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Subscription routes working');
});

export default router;
