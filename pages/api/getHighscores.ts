// app/api/getHighscores.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { puzzle, preset, date, sortBy, sortOrder } = req.query;
  // Receive more query parameters here

  if (!puzzle || !preset || !date) {
    const missingParams = [];
    if (!puzzle) missingParams.push('puzzle');
    if (!preset) missingParams.push('preset');
    if (!date) missingParams.push('date');
    return res.status(400).json({ error: "Query parameters are missing: ", missingParams });
  }


  try {
    const client = await clientPromise;
    const db = client.db('highscores'); 


    const query: any = { 'highscore.minigame.puzzle': puzzle };
    if (preset) {
      const presets = Array.isArray(preset) ? preset : (preset as string).split(',');
      query['highscore.minigame.preset'] = { $in: presets };
    }
    

    if (date) {
      if (date === 'weekly') {
        const now = new Date();
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        query['date'] = {
          $gte: oneWeekAgo,
          $lt: now,
        };

      } else if (date === 'monthly') {
        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        query['date'] = {
          $gte: oneMonthAgo,
          $lt: now,
        };
      }
    }
    // Add more query parameters here


    const highscores = await db
      .collection(puzzle as string)
      .find(query)
      .sort({ [sortBy ? sortBy as string : 'highscore.streak']: sortOrder === 'asc' ? 1 : -1 }) // 'asc (ascending)' or 'desc (descending)'
      .limit(50)
      .toArray();

    res.status(200).json(highscores);
  } catch (error) {
    console.error('Error fetching highscores:', error);
    res.status(500).json({ error: 'Failed to fetch highscores.' });
  }
}
