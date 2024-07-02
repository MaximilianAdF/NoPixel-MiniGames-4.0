export interface Minigame {
    puzzle: string,
    preset: string,

    // Optional when the user has their own preset (preset: 'None')
    duration?: number,
    targetScore?: number,
    rows?: number,
    columns?: number,
    levels?: number,
    numLetters?: number,
    pinLength?: number,
}