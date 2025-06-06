import express from 'express';
import { stripeWebhookHandler } from '../controllers/stripeWebhookController.js';
const router = express.Router();
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
export default router;
