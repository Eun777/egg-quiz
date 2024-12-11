// Create a new file: /api/stats.js
import { createClient } from '@vercel/kv';

// Initialize KV storage
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get current stats
      let stats = await kv.get('eggStats') || {
        completions: 0,
        eggs: {
          sunny: 0,
          hardboiled: 0,
          scrambled: 0,
          poached: 0,
          deviled: 0
        }
      };
      
      // Update stats with new completion
      const { eggType } = req.body;
      stats.completions++;
      stats.eggs[eggType]++;
      
      // Save updated stats
      await kv.set('eggStats', stats);
      
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error updating stats:', error);
      res.status(500).json({ error: 'Failed to update stats' });
    }
  } else if (req.method === 'GET') {
    try {
      const stats = await kv.get('eggStats') || {
        completions: 0,
        eggs: {
          sunny: 0,
          hardboiled: 0,
          scrambled: 0,
          poached: 0,
          deviled: 0
        }
      };
      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}