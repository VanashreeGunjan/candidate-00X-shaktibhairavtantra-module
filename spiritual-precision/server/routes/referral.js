import express from 'express';
import { getReferralStatus } from '../controllers/referralController.js';
const router = express.Router();
router.get('/referral-status', getReferralStatus);
export default router;
