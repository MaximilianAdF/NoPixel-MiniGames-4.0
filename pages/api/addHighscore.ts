import type { NextApiRequest, NextApiResponse } from 'next';
import { Highscore } from '@/interfaces/highscore';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const highscore: Highscore = req.body
    try {
      const client = await clientPromise;
      const db = client.db('highscores');

      const result = await db.collection(highscore.minigame.puzzle).insertOne({
        highscore,
        date: new Date(),
      });

      res.status(200).json({ success: true, data: { insertedId: result.insertedId } });
    } catch (error) {
      console.error('Error adding highscore:', error);
      res.status(500).json({ success: false, error: 'Failed to add highscore.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
