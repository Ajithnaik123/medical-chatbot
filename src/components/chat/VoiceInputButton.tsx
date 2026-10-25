import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscript, className = '' }: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { language, addToast } = useStore();

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    // Set recognition language based on app language
    const langMap: Record<string, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
      es: 'es-ES',
    };
    recognition.lang = langMap[language] || 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        onTranscript(finalTranscript);
        setIsRecording(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsRecording(false);
      if (event.error !== 'no-speech') {
        addToast(`Voice error: ${event.error}`, 'warning');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [language]);

  const toggleRecording = () => {
    if (!supported) {
      addToast('Speech recognition is not supported in this browser.', 'warning');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const langMap: Record<string, string> = {
          en: 'en-US',
          te: 'te-IN',
          hi: 'hi-IN',
          es: 'es-ES',
        };
        recognitionRef.current.lang = langMap[language] || 'en-US';
        recognitionRef.current?.start();
        setIsRecording(true);
        addToast(`Listening in ${language.toUpperCase()}... Speak your symptom clearly.`, 'info');
      } catch (err) {
        console.error('Failed to start voice recognition:', err);
        setIsRecording(false);
      }
    }
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      title={isRecording ? 'Listening... click to stop' : 'Describe symptoms using your voice'}
      className={`relative p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
        isRecording
          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-4 ring-rose-200 animate-pulse'
          : 'bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700'
      } ${className}`}
    >
      {isRecording ? (
        <>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
          </span>
          <Mic className="w-5 h-5 animate-bounce" />
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}
