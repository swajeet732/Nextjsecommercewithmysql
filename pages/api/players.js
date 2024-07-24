import axios from 'axios';

const API_URL = 'http://api.football-data.org/v4/players/16271/matches';
const API_KEY = 'c3010694273d404d852552d941572d06';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-Auth-Token': API_KEY,
        'X-Unfold-Goals': 'true',
      },
      params: { limit: 5 },
    });

    const matches = response.data || [];
    res.status(200).json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Server error', 
      details: error.response?.data || error.message 
    });
  }
}
