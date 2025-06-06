import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res) => {
  const { itemId, itemName, price, splitToGuru } = req.body;
  if (!itemId || !price) {
    return res.status(400).json({ error: 'Missing itemId or price' });
  }
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: itemName || 'Spiritual Offering',
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      }],
      payment_intent_data: {
        application_fee_amount: Math.round(price * 0.20 * 100),
        transfer_data: {
          destination: splitToGuru || process.env.GURU_STRIPE_ACCOUNT_ID,
        },
      },
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?cancelled=true`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
