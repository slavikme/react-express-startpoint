import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'only admin visible information',
    });
});

export default router;