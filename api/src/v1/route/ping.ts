import {Router} from "express";
import {parseDate} from "chrono-node";

const router = Router();

router.all('/', (req, res) => {
    res.json({message: 'pong'});
})

export default router;
