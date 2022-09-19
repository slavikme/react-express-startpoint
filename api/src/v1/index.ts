import express from 'express';

import auth from './route/auth';
import ping from "./route/ping";
import admin from "./route/admin";

import {requireAuth, ROLE_ADMIN} from './middleware/auth';
import {parseDate} from "chrono-node";

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'pong',
  });
});

router.use('/auth', auth);
router.use('/ping', ping);

router.use('/admin', requireAuth(ROLE_ADMIN), admin);

export default router;
