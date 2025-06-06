import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const TRUST_ACCOUNT_ID = 'acct_trust123';
const PLATFORM_ACCOUNT_ID = 'acct_platform456';

export const createCheckoutSession = async (req, res) => {
  const { type, amount } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    let session;

    if (type === 'donation') {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'inr',
            unit_amount: amount * 100,
            product_data: { name: 'Temple Trust Donation' },
          },
          quantity: 1,
        }],
        mode: 'payment',
        payment_intent_data: {
          transfer_data: { destination: TRUST_ACCOUNT_ID },
        },
        success_url: 'http://localhost:3000/thank-you',
        cancel_url: 'http://localhost:3000/trust-shop',
      });

    } else if (type === 'ritual') {
      const trustShare = Math.floor(amount * 0.8 * 100);
      const platformShare = Math.floor(amount * 0.2 * 100);

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'inr',
            unit_amount: amount * 100,
            product_data: { name: 'Ritual Package' },
          },
          quantity: 1,
        }],
        mode: 'payment',
        payment_intent_data: {
          transfer_data: { destination: TRUST_ACCOUNT_ID, amount: trustShare },
          application_fee_amount: platformShare,  
        },
        success_url: 'http://localhost:3000/thank-you',
        cancel_url: 'http://localhost:3000/trust-shop',
      });
    }

    res.json({ sessionId: session.id });

  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
};
