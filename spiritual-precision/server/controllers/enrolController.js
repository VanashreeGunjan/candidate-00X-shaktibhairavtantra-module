export async function enrollPartner(req, res) {
  const { partnerUserId, trialEnds, fullName, email, city } = req.body;
  if (!partnerUserId || !trialEnds || !fullName || !email || !city) {
    return res.status(400).json({ error: 'Missing Required Fields' });
  }
  console.log('Enrolling Partner:', { partnerUserId, trialEnds, fullName, email, city });
  setTimeout(() => {
    return res.json({ message: 'Account Created. Welcome!' });
  }, 1000);
}
