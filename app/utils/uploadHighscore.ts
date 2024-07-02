import { Highscore } from '@/interfaces/highscore';
import { Minigame } from '@/interfaces/minigame';

interface UploadHighscoreProps {
    minigame: Minigame;
    averageTime: number;
    username: string;
    streak: number;
}

async function uploadHighscore({ minigame, averageTime, username, streak }: UploadHighscoreProps) {
    const highscore: Highscore = {
        minigame,
        averageTime: Math.round(averageTime),
        username,
        streak,
    }

     const res = await fetch('../api/addHighscore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( highscore ),
    });
    
    if (res.ok) {
        console.log('Highscore uploaded successfully!');
        return 'Highscore uploaded successfully!';
    } else {
        console.error(await res.text());
        return 'Failed to upload highscore.';
    }
}

export default uploadHighscore;