import express from 'express';
import { enrollPartner } from '../controllers/enrolController.js';
const router = express.Router();
router.post('/partner-enroll', enrollPartner);
export default router;
