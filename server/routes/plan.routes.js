import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Plan routes working');
});

export default router;
