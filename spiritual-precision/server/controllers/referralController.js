 
export const getReferralStatus = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: 'Missing userId' });
 
  const mockData = {
    referrals: 4,
    redemptions: 2,
    creditAmount: 600,
  };

  res.json(mockData);
};
