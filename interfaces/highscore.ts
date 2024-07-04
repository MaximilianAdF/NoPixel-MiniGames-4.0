import { Minigame } from "./minigame";

export interface Highscore {
    minigame: Minigame
    averageTime: number,
    username: string,
    streak: number,
}