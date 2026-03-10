let currentAudio = null;

/**
 * Plays a base64 encoded audio string (usually returned from TTS).
 * Returns a Promise that resolves when the audio finishes playing.
 */
export const playAudioBase64 = async (base64Audio) => {
  return new Promise((resolve, reject) => {
    try {
      if (!base64Audio) {
        resolve();
        return;
      }

      // Stop any existing audio first
      stopAudio();

      const audioContent = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioContent);
      currentAudio = audio;

      audio.onended = () => {
        currentAudio = null;
        resolve();
      };

      audio.onerror = (e) => {
        currentAudio = null;
        reject(e);
      };

      audio.play().catch(reject);
    } catch (error) {
      console.error("Error playing audio chunk:", error);
      reject(error);
    }
  });
};

/**
 * Stops the current audio playback if any.
 */
export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

/**
 * Fallback Web Speech API based TTS, if Sarvam TTS ever fails
 */
export const speakFallback = (text) => {
  return new Promise((resolve) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN"; // Indian English
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // Slightly higher pitch for female voice

      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};
