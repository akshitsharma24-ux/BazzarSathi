import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n.jsx";
import { MicIcon } from "./icons.jsx";

// Prototype only: converts a spoken (or typed) sentence like "Aaj 91 vada
// pav bike aur 9 bache" into structured {sold, unsold} numbers, and shows
// what BazaarSaathi *would* log. There's no backend write endpoint for
// manual sales entry (the dashboard is read-only, driven by the synthetic
// CSV), so this deliberately doesn't pretend to persist anything -- it's a
// demonstration of the accessibility idea (voice-first logging for a
// vendor who may not be comfortable typing/reading), not a shipped feature.
function parseSaleSentence(text) {
  const numbers = (text.match(/\d+/g) || []).map(Number);
  if (numbers.length === 0) return null;
  return { sold: numbers[0], unsold: numbers[1] ?? null };
}

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export default function VoiceLogger() {
  const { t, lang } = useLanguage();
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState(null);
  const [manualText, setManualText] = useState("");
  const [micError, setMicError] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognition()));
  }, []);

  function startListening() {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    setMicError(false);
    setParsed(null);
    setTranscript("");

    const recognition = new SpeechRecognition();
    const recognitionLangs = { hi: "hi-IN", mr: "mr-IN", en: "en-IN" };
    recognition.lang = recognitionLangs[lang] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const clearSafetyTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    recognition.onresult = (event) => {
      clearSafetyTimeout();
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setParsed(parseSaleSentence(text));
    };
    recognition.onerror = () => {
      clearSafetyTimeout();
      setMicError(true);
      setListening(false);
    };
    recognition.onend = () => {
      clearSafetyTimeout();
      setListening(false);
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();

    // Some browsers/OS mic configurations never fire onerror/onend if the
    // mic is unavailable (observed: hangs on "Listening..." indefinitely
    // rather than erroring) -- a hard timeout guarantees this can't get
    // stuck mid-demo with no way out other than clicking the button again.
    timeoutRef.current = setTimeout(() => {
      recognition.stop();
      setMicError(true);
      setListening(false);
    }, 8000);
  }

  function stopListening() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    recognitionRef.current?.stop();
    setListening(false);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  function parseManual() {
    if (!manualText.trim()) return;
    setTranscript(manualText.trim());
    setParsed(parseSaleSentence(manualText));
  }

  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-1.5">
            <MicIcon className="w-4 h-4 text-ink-500" /> {t("voice_title")}
          </h3>
          <p className="text-xs text-ink-500 mt-0.5 max-w-sm">{t("voice_subtitle")}</p>
        </div>

        {supported && (
          <button
            onClick={listening ? stopListening : startListening}
            className={`shrink-0 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-[8px] transition ${
              listening
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-mesh-600 hover:bg-mesh-700 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full bg-white ${listening ? "animate-pulse" : ""}`}
              aria-hidden="true"
            />
            {listening ? t("voice_listening") : t("voice_start")}
          </button>
        )}
      </div>

      {!supported && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-ink-400">{t("voice_unsupported")}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder={t("voice_placeholder")}
              className="flex-1 text-sm border border-ink-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-saathi-300"
            />
            <button
              onClick={parseManual}
              className="text-sm font-medium bg-ink-900 hover:bg-ink-800 text-white px-4 py-2 rounded-lg transition"
            >
              {t("voice_parse")}
            </button>
          </div>
        </div>
      )}

      {micError && (
        <p className="mt-3 text-xs text-rose-500">{t("voice_mic_error")}</p>
      )}

      {transcript && (
        <div className="mt-3 pt-3 border-t border-ink-100 space-y-2 animate-fade-in">
          <p className="text-xs text-ink-500 italic">&ldquo;{transcript}&rdquo;</p>
          {parsed && (parsed.sold != null || parsed.unsold != null) ? (
            <div className="flex gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-ink-400">{t("dash_sold")}</p>
                <p className="text-lg font-display font-bold text-mesh-600 tabular-nums-all">
                  {parsed.sold ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-ink-400">{t("dash_unsold")}</p>
                <p className="text-lg font-display font-bold text-rose-500 tabular-nums-all">
                  {parsed.unsold ?? "—"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink-400">{t("voice_no_numbers")}</p>
          )}
        </div>
      )}

      <p className="text-[10px] text-ink-400 mt-3 pt-3 border-t border-ink-100">{t("voice_demo_note")}</p>
    </div>
  );
}
