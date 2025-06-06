 import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const stripeWebhookHandler = async (req, res) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  } 
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('✅ Stripe session completed:', session.id);
 
    const tkEnrolment = {
      success: true,
      tkUserId: `TK_${Math.floor(100 + Math.random() * 900)}`,
      role: 'pro',
      durationDays: 90,
    };

    console.log('🎉 TalentKonnect Pro enrolled:', tkEnrolment);
    return res.status(200).json(tkEnrolment);
  }

  res.status(200).send('Event received');
};
