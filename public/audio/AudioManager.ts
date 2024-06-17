// utils/audioPlayer.ts

export class AudioPlayer {
    private audioElement: HTMLAudioElement | null = null;

    constructor(src: string, vol: number = 1.0) {
        if (typeof window !== 'undefined') {
            this.audioElement = new Audio(src);
            this.audioElement.preload = 'auto';
        }
    }

    play(): void {
        if (this.audioElement) {
            this.audioElement.currentTime = 0; // Reset to start
            this.audioElement.play().catch(error => {
                console.error('Audio playback failed:', error);
            });
        }
    }
}

// Export a specific instance if needed
export const checkBeepPlayer = new AudioPlayer('/audio/check-beep.mp3');
export const timerBeepPlayer = new AudioPlayer('/audio/timer-beep.mp3');
export const successPlayer = new AudioPlayer('/audio/success.mp3');
