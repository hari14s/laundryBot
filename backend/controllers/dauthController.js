import axios from 'axios';
import qs from 'qs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const DAUTH_BASE_URL = 'https://auth.delta.nitt.edu';

const generateRandomString = (length = 20) =>
  [...Array(length)].map(() => Math.random().toString(36)[2]).join('');

export const redirectToDAuth = (req, res) => {
  const state = generateRandomString();
  const nonce = generateRandomString();

  req.session.state = state;
  req.session.nonce = nonce;

  const clientId = process.env.DAUTH_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DAUTH_REDIRECT_URI);
  const scope = encodeURIComponent('openid email profile user');

  const url = `${DAUTH_BASE_URL}/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&grant_type=authorization_code&state=${state}&scope=${scope}&nonce=${nonce}`;

  res.redirect(url);
};

export const handleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    // console.log('Session stored state:', req.session.state);
    // console.log('State received from DAuth:', state);

    if (state !== req.session.state) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    const tokenResponse = await axios.post(
      `${DAUTH_BASE_URL}/api/oauth/token`,
      qs.stringify({
        client_id: process.env.DAUTH_CLIENT_ID,
        client_secret: process.env.DAUTH_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DAUTH_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, id_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(400).json({ error: 'Failed to get access token' });
    }

    const userResponse = await axios.post(
      `${DAUTH_BASE_URL}/api/resources/user`,
      {},
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const userData = userResponse.data;
    //console.log(userData);

    const user = await User.findOneAndUpdate(
      { email: userData.email },
      {
        name: userData.name,
        email: userData.email,
        dauthId: userData.id,
        profile: userData.profile || {},
      },
      { upsert: true, new: true }
    );

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // JS cannot access this cookie
      secure: process.env.NODE_ENV === 'production', // only HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
    });

    res.redirect('http://localhost:5000'); 

  } catch (error) {
    console.error('DAuth callback error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong during DAuth login' });
  }
};

