import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await fetch(
      `https://${process.env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${process.env.MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: email,
          double_opt_in: false,
          status: 'subscribed'
        })
      }
    );

    const data = await result.json();

    if (!result.ok) {
      return res.status(result.status).json({ error: data.detail });
    }

    return res.status(201).json({ error: '' });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
