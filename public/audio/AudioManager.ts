// utils/audioPlayer.ts

export class AudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private readonly readyPromises: Array<() => void> = [];
  private baseVolume: number;

  constructor(src: string, vol: number = 1.0) {
    this.baseVolume = vol;
    
    if (typeof window !== "undefined") {
      this.audioElement = new Audio(src);
      this.audioElement.preload = "auto";
      this.audioElement.volume = this.getEffectiveVolume();
      this.audioElement.crossOrigin = "anonymous";
      this.audioElement.setAttribute("playsinline", "true");
      this.audioElement.load();

      // Listen for global volume changes
      window.addEventListener('volumeChange', (e: Event) => {
        const customEvent = e as CustomEvent<{ volume: number }>;
        this.updateVolume(customEvent.detail.volume);
      });

      const unlock = () => {
        if (!this.audioElement) return;
        const element = this.audioElement;
        const resume = () => {
          element.pause();
          element.currentTime = 0;
          element.muted = false;
        };

        element.muted = true;
        const playPromise = element.play();
        if (playPromise !== undefined) {
          playPromise.then(resume).catch(resume);
        } else {
          resume();
        }

        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };

      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });

      this.audioElement.addEventListener(
        "canplaythrough",
        () => {
          while (this.readyPromises.length) {
            const resolve = this.readyPromises.shift();
            resolve?.();
          }
        },
        { once: true }
      );
    }
  }

  private getEffectiveVolume(): number {
    if (typeof window === 'undefined') return this.baseVolume;
    
    const savedVolume = localStorage.getItem('gameVolume');
    const savedMuted = localStorage.getItem('gameMuted');
    
    if (savedMuted === 'true') return 0;
    if (savedVolume) {
      return this.baseVolume * (parseInt(savedVolume) / 100);
    }
    return this.baseVolume;
  }

  private updateVolume(globalVolume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = this.baseVolume * globalVolume;
    }
  }

  play(): void {
    if (this.audioElement) {
      this.audioElement.currentTime = 0; // Reset to start
      const playPromise = this.audioElement.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Silently handle autoplay restrictions; playback will resume once unlocked
        });
      }
    }
  }

  whenReady(): Promise<void> {
    if (!this.audioElement) {
      return Promise.resolve();
    }

    if (this.audioElement.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.readyPromises.push(resolve);
    });
  }
}

// Export a specific instance if needed
export const checkBeepPlayer = new AudioPlayer("/audio/check-beep.mp3");
export const timerBeepPlayer = new AudioPlayer("/audio/timer-beep.mp3");
export const successPlayer = new AudioPlayer("/audio/success.mp3");
