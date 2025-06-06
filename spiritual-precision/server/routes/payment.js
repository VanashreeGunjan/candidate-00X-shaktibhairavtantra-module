import express from 'express';
import Stripe from 'stripe';
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
router.post('/create-subscription-session', async (req, res) => {
  const { donationAmount = 0 } = req.body;
  const baseAmount = 3000 * 100;  
  const totalAmount = (3000 + Number(donationAmount)) * 100;

  const line_items = [
    {
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Spiritual Precision Subscription',
        },
        unit_amount: totalAmount,
      },
      quantity: 1,
    },
  ];

  const transferData = donationAmount
    ? {}  
    : {
        transfer_data: {
          destination: process.env.GURUJI_STRIPE_ACCOUNT,
          amount: Math.floor(0.8 * baseAmount), 
        },
      };
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      ...transferData,
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});
export default router;
