// what the heck is this i don't even know
class AlarmSound {
  private audioContext: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    if (typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
  }

  private playTone(frequency: number, duration: number, delay: number = 0) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.linearRampToValueAtTime(
      1,
      this.audioContext.currentTime + delay
    );

    // Track active oscillators
    this.activeOscillators.push(oscillator);

    oscillator.start(this.audioContext.currentTime + delay);
    oscillator.stop(this.audioContext.currentTime + delay + duration);

    // Remove from active list when done
    oscillator.onended = () => {
      const index = this.activeOscillators.indexOf(oscillator);
      if (index > -1) {
        this.activeOscillators.splice(index, 1);
      }
    };
  }

  async play() {
    if (!this.audioContext) {
      console.log("Timer completed!");
      return;
    }

    // Resume audio context if it's suspended
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    const pattern = [1000, 1000, 1000]; // Frequencies (alarm pattern)
    const toneDuration = 0.1; // Duration of each beep
    const pauseDuration = 0.1; // Distance between beeps

    pattern.forEach((frequency, index) => {
      const delay = index * (toneDuration + pauseDuration);
      this.playTone(frequency, toneDuration, delay);
    });
  }

  stop() {
    // Stop all active oscillators
    this.activeOscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // Oscillator might already be stopped
      }
    });
    this.activeOscillators = [];
  }
}

// Create a singleton instance
let alarmSoundInstance: AlarmSound | null = null;

export function createAlarmSound() {
  if (!alarmSoundInstance) {
    alarmSoundInstance = new AlarmSound();
  }
  return alarmSoundInstance;
}
