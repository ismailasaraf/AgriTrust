import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle, RefreshCw, Languages, AlertCircle } from 'lucide-react';
import { api } from '../api';

const LANGUAGES = [
  { code: 'en-US', name: 'English', prompt: 'Please state your full name, village, crops you cultivate, land size in acres, and phone number.' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', prompt: 'कृपया अपना नाम, गांव, फसलें, जमीन (एकड़ में) और फोन नंबर बोलें।' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', prompt: 'దయచేసి మీ పేరు, గ్రామం, పంటలు, భూమి (ఎకరాలు) మరియు ఫోన్ నంబర్ చెప్పండి.' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', prompt: 'தயவுசெய்து உங்கள் பெயர், கிராமம், பயிர்கள், நில அளவு மற்றும் தொலைபேசி எண்ணைக் கூறவும்.' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', prompt: 'कृपया तुमचे नाव, गाव, पिके, जमीन (एकरामध्ये) आणि फोन नंबर सांगा.' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', prompt: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ, ਪਿੰਡ, ਫ਼ਸਲਾਂ, ਜ਼ਮੀਨ (ਏਕੜ) ਅਤੇ ਫ਼ੋਨ ਨੰਬਰ ਦੱਸੋ।' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', prompt: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು, ಗ್ರಾಮ, ಬೆಳೆಗಳು, ಜಮೀನು (ಎಕರೆ) ಮತ್ತು ಫೋನ್ ಸಂಖ್ಯೆ ಹೇಳಿ.' },
];

export default function VoiceAssistant({ onAutoFillData, currentFormData }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang;

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [selectedLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setParseResult(null);
      recognitionRef.current.lang = selectedLang;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakPrompt = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const langObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];
    const utterance = new SpeechSynthesisUtterance(langObj.prompt);
    utterance.lang = selectedLang;

    utterance.onstart = () => setIsSpeakingPrompt(true);
    utterance.onend = () => setIsSpeakingPrompt(false);
    utterance.onerror = () => setIsSpeakingPrompt(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceParse = async () => {
    if (!transcript.trim()) return;
    setIsParsing(true);
    try {
      const result = await api.parseVoiceRegistration(transcript, selectedLang);
      setParseResult(result);
      if (onAutoFillData) {
        onAutoFillData(result);
      }
    } catch (err) {
      console.error('Voice parsing error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDemoPreset = (sampleText) => {
    setTranscript(sampleText);
    api.parseVoiceRegistration(sampleText, selectedLang).then((result) => {
      setParseResult(result);
      if (onAutoFillData) onAutoFillData(result);
    });
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="border-b border-emerald-500/20 pb-4 mb-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300" style={{ flexShrink: 0 }}>
              <Mic className="w-4 h-4" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 className="text-sm font-bold text-white">Voice-Based Registration Assistant</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Speak naturally to register without typing. Supports 7 Indian languages.
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="glass-input text-xs rounded-lg px-3 py-1.5 bg-slate-900 text-emerald-300 focus:outline-none"
              style={{ width: 'auto', minWidth: 120 }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                  {lang.name}
                </option>
              ))}
            </select>

            <button
              onClick={speakPrompt}
              title="Listen to Voice Prompt"
              className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 ${
                isSpeakingPrompt
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Prompt Instructions Box */}
      <div className="bg-slate-950/60 rounded-xl p-3.5 border border-emerald-500/20 mb-6 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
            Spoken Guide ({currentLangObj.name})
          </span>
          <p className="text-xs text-slate-200 font-medium mt-0.5">{currentLangObj.prompt}</p>
        </div>
      </div>

      {/* Mic Trigger & Waveform Visualization */}
      <div className="flex flex-col items-center justify-center my-6 gap-4">
        <button
          onClick={toggleListening}
          disabled={!speechSupported}
          className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isListening
              ? 'bg-gradient-to-tr from-red-600 to-amber-500 text-white animate-mic-pulse scale-105'
              : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white hover:scale-105 hover:shadow-emerald-500/50'
          }`}
        >
          {isListening ? (
            <MicOff className="w-10 h-10 animate-bounce" />
          ) : (
            <Mic className="w-10 h-10 group-hover:rotate-6 transition-transform" />
          )}

          <span className="absolute -bottom-7 whitespace-nowrap text-xs font-semibold tracking-wide text-slate-300">
            {isListening ? 'Tap to Stop Recording' : 'Tap Mic & Start Speaking'}
          </span>
        </button>

        {isListening && (
          <div className="flex items-center gap-1 mt-6 h-6">
            <span className="w-1.5 h-6 bg-red-400 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
            <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
            <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            <span className="text-xs text-red-400 font-mono font-bold ml-2">Listening...</span>
          </div>
        )}

        {!speechSupported && (
          <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
            <AlertCircle className="w-4 h-4" />
            <span>Web Speech API is not supported in this browser mode. Use the interactive demo buttons below.</span>
          </div>
        )}
      </div>

      {/* Transcript Box */}
      <div className="space-y-2 mt-8">
        <div className="flex items-center justify-between text-xs">
          <label className="text-slate-300 font-medium">Spoken Audio Transcript:</label>
          {transcript && (
            <button
              onClick={() => { setTranscript(''); setParseResult(null); }}
              className="text-slate-400 hover:text-slate-200 text-[11px] underline"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your spoken words will appear here live... e.g. 'My name is Ramesh Patel from Rampur village. Phone number 9876543210. I cultivate 5 acres of organic wheat and cotton, approx 60 quintals yield. Member of Rampur FPO.'"
          className="w-full glass-input rounded-xl p-3.5 text-xs text-slate-200 h-24 focus:outline-none resize-none font-mono"
        ></textarea>
      </div>

      {/* Quick Interactive Speech Simulation Presets for Testing */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <span className="text-[11px] text-slate-400 font-medium block mb-2">
          ✨ Or Try Quick Sample Spoken Transcripts (Click to test auto-parsing):
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDemoPreset("My name is Ramesh Kumar from Village Chandpur, mobile 9812345678. I have 4 acres of land doing organic farming of wheat and cotton. Yield is approx 55 quintals per season. Active member of Farmers FPO, selling to APMC Mandi.")}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-800/50 transition-all"
          >
            🗣️ Sample 1: Organic Wheat & Cotton (Ramesh)
          </button>
          <button
            onClick={() => handleDemoPreset("I am Lakshmi Devi from Khed Shivapur village, phone 9988776655. Cultivating 6 acres sugarcane and maize with commercial farming, history of 12 years. Approx production 120 quintals. Independent farmer selling to local trader.")}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-950/80 text-teal-300 border border-teal-500/30 hover:bg-teal-800/50 transition-all"
          >
            🗣️ Sample 2: Commercial Sugarcane (Lakshmi)
          </button>
        </div>
      </div>

      {/* Extract Action Button */}
      <div className="mt-5 flex items-center justify-end">
        <button
          onClick={handleVoiceParse}
          disabled={!transcript.trim() || isParsing}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-xl ${
            !transcript.trim() || isParsing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 shadow-emerald-500/20'
          }`}
        >
          {isParsing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI Extracting Profile Fields...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Extract & Auto-Fill Registration Form</span>
            </>
          )}
        </button>
      </div>

      {/* Parse Confirmation Output */}
      {parseResult && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300">Successfully extracted farmer fields!</span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Extracted profile for <strong>{parseResult.name || 'Farmer'}</strong> ({parseResult.village || 'Village'}), Land: {parseResult.land_size_acres || 0} Acres, Crops: {parseResult.crops_cultivated || 'General'}. Form auto-filled below!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
