import { useRef, useState } from "react";
import { useLanguage } from "../i18n.jsx";
import { ReceiptIcon } from "./icons.jsx";

// Prototype only, same spirit as VoiceLogger: real client-side OCR
// (tesseract.js, loaded on demand so it never weighs down the main
// bundle for the majority of visitors who never touch this card), but
// there's no backend endpoint to actually update inventory/cost data from
// a scanned invoice -- this demonstrates the idea (spec section: "OCR bill
// scanning... future scope", pulled forward at the user's request) without
// pretending it writes anywhere. Accuracy on real handwritten wholesale
// bills will vary a lot; that's disclosed in the UI rather than hidden.
function parseLineItems(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const items = [];
  const pairPattern = /(\d+(?:\.\d+)?)\D+?(\d+(?:\.\d+)?)/;

  for (const line of lines) {
    const match = line.match(pairPattern);
    if (match) {
      items.push({
        text: line,
        quantity: parseFloat(match[1]),
        amount: parseFloat(match[2]),
      });
    }
  }
  return items;
}

export default function BillScannerCard() {
  const { t } = useLanguage();
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [rawText, setRawText] = useState("");
  const [items, setItems] = useState([]);
  const [showRaw, setShowRaw] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setProgress(0);
    setRawText("");
    setItems([]);
    setPreview(URL.createObjectURL(file));

    try {
      const { recognize } = await import("tesseract.js");
      const result = await recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round((m.progress || 0) * 100));
          }
        },
      });
      const text = result.data.text || "";
      setRawText(text);
      setItems(parseLineItems(text));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setPreview(null);
    setRawText("");
    setItems([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="bg-white border border-ink-200 rounded-xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-display font-semibold text-ink-900 flex items-center gap-1.5">
            <ReceiptIcon className="w-4 h-4 text-ink-500" /> {t("ocr_title")}
          </h3>
          <p className="text-xs text-ink-500 mt-0.5 max-w-sm">{t("ocr_subtitle")}</p>
        </div>

        {status !== "loading" && (
          <label className="shrink-0 cursor-pointer bg-mesh-600 hover:bg-mesh-700 text-white text-xs font-medium px-3 py-2 rounded-[8px] transition">
            {t("ocr_upload")}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        )}
      </div>

      {status === "loading" && (
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-block w-4 h-4 border-2 border-ink-200 border-t-mesh-600 rounded-full animate-spin shrink-0" />
          <span className="text-sm text-ink-500">{t("ocr_scanning")} {progress}%</span>
        </div>
      )}

      {status === "error" && (
        <p className="mt-4 text-sm text-rose-500 bg-rose-50 border border-rose-200 rounded-xl p-3">
          {t("ocr_error")}
        </p>
      )}

      {preview && status !== "idle" && (
        <div className="mt-4 flex gap-4 items-start flex-wrap animate-fade-in">
          <img
            src={preview}
            alt=""
            className="w-24 h-24 object-cover rounded-lg border border-ink-100 shrink-0"
          />
          {status === "done" && (
            <div className="flex-1 min-w-[200px]">
              {items.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wide text-ink-400">
                    {t("ocr_detected_items")}
                  </p>
                  {items.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-ink-50 rounded-lg px-3 py-1.5">
                      <span className="text-ink-700 truncate pr-2">{item.text}</span>
                      <span className="text-ink-500 shrink-0 tabular-nums-all">
                        {item.quantity} × ₹{item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400">{t("ocr_no_items")}</p>
              )}

              <button
                onClick={() => setShowRaw((v) => !v)}
                className="mt-2 text-xs text-ink-400 hover:text-ink-600 underline"
              >
                {showRaw ? t("ocr_hide_raw") : t("ocr_show_raw")}
              </button>
              {showRaw && (
                <pre className="mt-2 text-xs text-ink-500 bg-ink-50 rounded-lg p-3 whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {rawText || t("ocr_no_text")}
                </pre>
              )}

              <button
                onClick={reset}
                className="mt-2 text-xs text-ink-400 hover:text-ink-600 underline"
              >
                {t("ocr_scan_another")}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-ink-400 mt-3 pt-3 border-t border-ink-100">{t("ocr_demo_note")}</p>
    </div>
  );
}
