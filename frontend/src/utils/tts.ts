// Text-to-Speech Utility for Multilingual Reading

import { LangType } from './locale';

export function speakText(text: string, lang: LangType) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language
  if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (lang === 'ur') {
    utterance.lang = 'ur-PK'; // Urdu (Pakistan) or 'ur-IN' for India
  } else {
    utterance.lang = 'en-IN'; // Default to Indian English
  }

  // Set properties for a pleasant voice
  utterance.rate = 0.9; // Slightly slower for better comprehension
  utterance.pitch = 1.0;

  // Try to find a high quality voice for the given language
  const voices = window.speechSynthesis.getVoices();
  const langVoices = voices.filter(v => v.lang.startsWith(utterance.lang.split('-')[0]));
  
  if (langVoices.length > 0) {
    // Prefer Google voices or high-quality local voices if available
    const premiumVoice = langVoices.find(v => v.name.includes('Google') || v.name.includes('Premium'));
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    } else {
      utterance.voice = langVoices[0];
    }
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
