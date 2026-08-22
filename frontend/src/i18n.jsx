import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STRINGS = {
  en: {
    appName: "BazaarSaathi",
    nav_dashboard: "Dashboard",
    nav_simulate: "Simulate",
    footer: "Prototype for hackathon demo purposes. All vendor data shown is synthetic.",

    landing_tagline: "Decision support for the vendor who can't afford to guess wrong.",
    landing_meet: "Meet Ramesh.",
    landing_p1:
      "Every morning, before his first customer shows up, Ramesh has to decide how much to prepare at his vada pav stall. There's no forecasting team, no supply chain software — just a guess, made on tight working capital, with real rupees riding on it.",
    landing_p2:
      "Prepare too much, and whatever doesn't sell is thrown out by evening — money he can't get back. Prepare too little, and he turns away paying customers on his best day of the week.",
    landing_p3:
      "BazaarSaathi simulates hundreds of possible “tomorrows” — weather, events, demand noise — and recommends the stock level that stays financially safe across them, not just the single most likely one.",
    landing_cta: "See how it works",
    landing_stat1_label: "futures simulated per run",
    landing_stat2_label: "risk personalities",
    landing_stat3_label: "input needed to start",
    landing_step1_title: "Forecast",
    landing_step1_desc: "A trained model predicts tomorrow's demand from weather and events.",
    landing_step2_title: "Simulate",
    landing_step2_desc: "500 plausible tomorrows are run, not just one point guess.",
    landing_step3_title: "Survive",
    landing_step3_desc: "Get the stock level that's financially safest, matched to your risk mode.",

    dash_title: "Vendor Dashboard",
    dash_subtitle: "A quick look at how today went before deciding tomorrow's stock.",
    dash_today_snapshot: "Today's Snapshot",
    dash_prepared: "Prepared",
    dash_sold: "Sold",
    dash_unsold: "Unsold",
    dash_profit: "Profit",
    dash_revenue: "Revenue",
    dash_waste_loss: "Waste loss",
    dash_rain_prob: "Rain probability",
    dash_conditions: "Conditions",
    dash_weekend: "Weekend",
    dash_weekday: "Weekday",
    dash_event: "Event",
    dash_cta_title: "Not sure how much to prepare tomorrow?",
    dash_cta_desc: "Run 500 simulated “tomorrows” and get a Survival Stock recommendation.",
    dash_cta_button: "Simulate Tomorrow",

    forecast_title: "Tomorrow's ML Forecast",
    forecast_subtitle: "The model's single best guess, before we stress-test it against hundreds of futures.",
    forecast_predicted: "predicted units",
    forecast_conditions_note: "Based on typical conditions — rain probability, temperature, and a possible local event. Adjust these on the Simulate page.",
    model_accuracy: "Model accuracy",
    model_mae: "MAE",
    model_rmse: "RMSE",
    model_r2: "R²",
    model_trained_on: "trained on {n} days of history",
    model_top_driver: "Top driver",

    sim_title: "Simulate Tomorrow",
    sim_subtitle: "Set tomorrow's conditions, then run 500 simulated futures to get a Survival Stock recommendation.",
    sim_rain_prob: "Rain probability",
    sim_temperature: "Temperature",
    sim_local_event: "Local event tomorrow?",
    sim_button: "Simulate Tomorrow",
    sim_button_loading: "Simulating 500 tomorrows...",
    sim_closing_line: "Prediction tells a vendor what may happen. BazaarSaathi helps them survive when the prediction is wrong.",

    futures_title: "{n} FUTURES SIMULATED",
    futures_range: "Possible demand range",
    futures_most_likely: "Most likely",
    futures_units: "units",

    survival_title: "Recommended Survival Stock",
    survival_units: "units",
    survival_expected_profit: "Expected profit",
    survival_waste_risk: "Waste risk",
    survival_stockout_risk: "Stockout risk",
    survival_likely_demand: "Likely demand",
    survival_ml_said: "ML forecast said",
    survival_safest_because: "financially safest across 500 simulated futures",

    risk_title: "Risk personality",
    risk_protect_cash: "Protect Cash",
    risk_protect_cash_desc: "Minimize wasted stock, even if it means running out",
    risk_balanced: "Balanced",
    risk_balanced_desc: "Maximize expected profit",
    risk_maximize_sales: "Maximize Sales",
    risk_maximize_sales_desc: "Minimize running out, even if it means some waste",

    why_title: "Why this number?",
    why_subtitle: "How much each factor shifts predicted demand, compared to that factor being absent.",
    why_rain: "Rain",
    why_weekend: "Weekend",
    why_event: "Local event",
    why_trend: "Recent trend",
    why_risk_mode: "Your selected risk mode",

    savings_title: "Savings vs. guessing",
    savings_naive: "Naive stocking (raw forecast)",
    savings_recommended: "Survival Stock recommendation",
    savings_waste_cost: "Waste cost",
    savings_monthly: "Projected monthly savings",
    savings_disclaimer: "Based on prototype simulation assumptions, not real transaction history.",
    savings_saved_today: "Saved today",

    compare_title: "Compare nearby stock levels",
    compare_subtitle: "How profit, waste, and stockout risk trade off around the recommendation.",
    compare_stock: "Stock",
    compare_profit: "Profit",
    compare_waste: "Waste",
    compare_stockout: "Stockout",
    compare_best: "Best",

    mesh_title: "Bazaar Mesh",
    mesh_subtitle: "See if a nearby vendor can absorb your surplus, or cover your shortage, today.",
    mesh_check_button: "Check nearby vendors",
    mesh_checking: "Checking nearby vendors...",
    mesh_match_found: "Surplus Match Found",
    mesh_away: "away",
    mesh_short_on: "is short on",
    mesh_has_surplus: "has surplus",
    mesh_qty_matched: "Quantity matched",
    mesh_value_recovered: "Estimated value recovered",
    mesh_balanced: "Today's numbers look balanced — no surplus or shortage to match.",
    mesh_no_match: "No nearby vendor match found for today's surplus/shortage.",
    mesh_check_again: "Check again",
    mesh_error: "Couldn't reach Bazaar Mesh right now. Try again in a moment.",

    error_generic: "Something went wrong",
    error_retry: "Try again",
    error_please_retry: "Please try again.",
    chart_title: "Simulated demand across 500 possible tomorrows",
    chart_subtitle: "Each bar is how often that demand level showed up across the simulations.",
    chart_marker_label: "Survival Stock",

    voice_title: "Log today's sales (voice)",
    voice_subtitle: "Speak a sentence like “Sold 91, 9 left” — no typing needed.",
    voice_start: "Tap to speak",
    voice_listening: "Listening...",
    voice_unsupported: "Voice input isn't supported in this browser. Type the sentence instead:",
    voice_placeholder: "e.g. Sold 91, 9 left",
    voice_parse: "Parse",
    voice_mic_error: "Couldn't hear anything — check microphone access, or type it instead.",
    voice_no_numbers: "Couldn't find any numbers in that — try again with quantities.",
    voice_demo_note: "Prototype only — shown for accessibility demo purposes, not saved to the dashboard.",

    neighborhood_title: "Bazaar Intelligence",
    neighborhood_subtitle: "Don't have enough sales history yet? These are pooled, anonymized patterns from nearby vendors — a starting point until your own forecast takes over.",
    neighborhood_vendor_count: "{n} nearby vendors",
    neighborhood_based_on: "Based on",
    neighborhood_disclaimer: "Anonymized and aggregated across nearby stalls, synthetic for this prototype. Not specific to any one vendor's real sales.",

    ocr_title: "Scan a wholesale bill",
    ocr_subtitle: "Photograph a supplier invoice and pull out quantities and prices automatically.",
    ocr_upload: "Upload / take photo",
    ocr_scanning: "Reading bill...",
    ocr_error: "Couldn't read that image — try a clearer, well-lit photo.",
    ocr_detected_items: "Detected line items",
    ocr_no_items: "Couldn't find clear quantity/price pairs in this image.",
    ocr_no_text: "No text detected.",
    ocr_show_raw: "Show raw extracted text",
    ocr_hide_raw: "Hide raw extracted text",
    ocr_scan_another: "Scan another bill",
    ocr_demo_note: "Prototype only — OCR runs in your browser, nothing is uploaded or saved. Accuracy varies with handwriting and photo quality.",
  },
  hi: {
    appName: "BazaarSaathi",
    nav_dashboard: "डैशबोर्ड",
    nav_simulate: "सिमुलेट",
    footer: "यह हैकथॉन डेमो के लिए है। सभी डेटा काल्पनिक है।",

    landing_tagline: "जो वेंडर गलत अंदाजा नहीं लगा सकता, उसके लिए फैसला सहायता।",
    landing_meet: "रमेश से मिलिए।",
    landing_p1:
      "हर सुबह पहला ग्राहक आने से पहले, रमेश को तय करना पड़ता है कि उसके वड़ा पाव स्टॉल पर कितना बनाना है। न कोई फोरकास्टिंग टीम, न सप्लाई चेन सॉफ्टवेयर — बस एक अंदाजा, वो भी सीमित पूंजी और असली रुपए के साथ।",
    landing_p2:
      "ज्यादा बनाएं तो जो नहीं बिकता वह शाम तक फेंकना पड़ता है — पैसा जो वापस नहीं आता। कम बनाएं तो सबसे अच्छे दिन भी ग्राहक खाली हाथ लौटाते हैं।",
    landing_p3:
      "BazaarSaathi सैकड़ों संभावित कल का अनुकरण करता है — मौसम, आयोजन, मांग में उतार-चढ़ाव — और वह स्टॉक सुझाता है जो सबमें वित्तीय रूप से सुरक्षित रहे।",
    landing_cta: "देखें यह कैसे काम करता है",
    landing_stat1_label: "हर बार सिमुलेट किए गए भविष्य",
    landing_stat2_label: "जोखिम व्यक्तित्व",
    landing_stat3_label: "शुरू करने के लिए जरूरी इनपुट",
    landing_step1_title: "पूर्वानुमान",
    landing_step1_desc: "एक मॉडल मौसम और आयोजनों से कल की मांग बताता है।",
    landing_step2_title: "सिमुलेशन",
    landing_step2_desc: "500 संभावित कल चलाए जाते हैं, सिर्फ एक अनुमान नहीं।",
    landing_step3_title: "सुरक्षा",
    landing_step3_desc: "आपके जोखिम मोड के अनुसार सबसे सुरक्षित स्टॉक स्तर पाएं।",

    dash_title: "वेंडर डैशबोर्ड",
    dash_subtitle: "कल का स्टॉक तय करने से पहले, आज का हाल देखें।",
    dash_today_snapshot: "आज का स्नैपशॉट",
    dash_prepared: "बनाया गया",
    dash_sold: "बिका",
    dash_unsold: "बचा हुआ",
    dash_profit: "मुनाफा",
    dash_revenue: "राजस्व",
    dash_waste_loss: "बर्बादी का नुकसान",
    dash_rain_prob: "बारिश की संभावना",
    dash_conditions: "स्थिति",
    dash_weekend: "वीकेंड",
    dash_weekday: "सप्ताह का दिन",
    dash_event: "आयोजन",
    dash_cta_title: "कल कितना बनाना है, पक्का नहीं?",
    dash_cta_desc: "500 सिमुलेटेड कल चलाएं और सर्वाइवल स्टॉक पाएं।",
    dash_cta_button: "कल का सिमुलेशन करें",

    forecast_title: "कल का ML पूर्वानुमान",
    forecast_subtitle: "मॉडल का सबसे अच्छा अनुमान, सैकड़ों भविष्यों के खिलाफ टेस्ट करने से पहले।",
    forecast_predicted: "अनुमानित यूनिट",
    forecast_conditions_note: "सामान्य स्थितियों पर आधारित। सिमुलेट पेज पर इन्हें बदलें।",
    model_accuracy: "मॉडल सटीकता",
    model_mae: "MAE",
    model_rmse: "RMSE",
    model_r2: "R²",
    model_trained_on: "{n} दिनों के डेटा पर प्रशिक्षित",
    model_top_driver: "मुख्य कारक",

    sim_title: "कल का सिमुलेशन",
    sim_subtitle: "कल की स्थिति सेट करें, फिर 500 सिमुलेशन चलाएं।",
    sim_rain_prob: "बारिश की संभावना",
    sim_temperature: "तापमान",
    sim_local_event: "कल स्थानीय आयोजन?",
    sim_button: "कल का सिमुलेशन करें",
    sim_button_loading: "500 कल सिमुलेट हो रहे हैं...",
    sim_closing_line: "पूर्वानुमान बताता है क्या हो सकता है। BazaarSaathi मदद करता है जब पूर्वानुमान गलत हो।",

    futures_title: "{n} भविष्य सिमुलेट किए गए",
    futures_range: "संभावित मांग सीमा",
    futures_most_likely: "सबसे संभावित",
    futures_units: "यूनिट",

    survival_title: "अनुशंसित सर्वाइवल स्टॉक",
    survival_units: "यूनिट",
    survival_expected_profit: "अपेक्षित मुनाफा",
    survival_waste_risk: "बर्बादी जोखिम",
    survival_stockout_risk: "स्टॉकआउट जोखिम",
    survival_likely_demand: "संभावित मांग",
    survival_ml_said: "ML पूर्वानुमान था",
    survival_safest_because: "500 सिमुलेटेड भविष्यों में सबसे सुरक्षित",

    risk_title: "जोखिम व्यक्तित्व",
    risk_protect_cash: "नकद बचाएं",
    risk_protect_cash_desc: "बर्बादी कम करें, भले ही स्टॉक खत्म हो जाए",
    risk_balanced: "संतुलित",
    risk_balanced_desc: "अपेक्षित मुनाफा अधिकतम करें",
    risk_maximize_sales: "बिक्री बढ़ाएं",
    risk_maximize_sales_desc: "स्टॉक खत्म होने से बचें, भले थोड़ी बर्बादी हो",

    why_title: "यह संख्या क्यों?",
    why_subtitle: "हर कारक अनुमानित मांग को कितना बदलता है।",
    why_rain: "बारिश",
    why_weekend: "वीकेंड",
    why_event: "स्थानीय आयोजन",
    why_trend: "हालिया रुझान",
    why_risk_mode: "आपका चुना हुआ जोखिम मोड",

    savings_title: "अंदाजे से बचत",
    savings_naive: "साधारण स्टॉकिंग",
    savings_recommended: "सर्वाइवल स्टॉक सिफारिश",
    savings_waste_cost: "बर्बादी लागत",
    savings_monthly: "अनुमानित मासिक बचत",
    savings_disclaimer: "प्रोटोटाइप सिमुलेशन मान्यताओं पर आधारित।",
    savings_saved_today: "आज बचा",

    compare_title: "नजदीकी स्टॉक स्तरों की तुलना",
    compare_subtitle: "सिफारिश के आसपास ट्रेड-ऑफ।",
    compare_stock: "स्टॉक",
    compare_profit: "मुनाफा",
    compare_waste: "बर्बादी",
    compare_stockout: "स्टॉकआउट",
    compare_best: "बेस्ट",

    mesh_title: "बाजार मेश",
    mesh_subtitle: "देखें क्या कोई नजदीकी वेंडर मदद कर सकता है।",
    mesh_check_button: "नजदीकी वेंडर जांचें",
    mesh_checking: "जांच रहे हैं...",
    mesh_match_found: "सरप्लस मैच मिला",
    mesh_away: "दूर",
    mesh_short_on: "की कमी है",
    mesh_has_surplus: "के पास अतिरिक्त है",
    mesh_qty_matched: "मिलान मात्रा",
    mesh_value_recovered: "अनुमानित मूल्य वसूली",
    mesh_balanced: "आज के आंकड़े संतुलित हैं — कोई मैच जरूरी नहीं।",
    mesh_no_match: "आज के लिए कोई मैच नहीं मिला।",
    mesh_check_again: "फिर जांचें",
    mesh_error: "अभी बाजार मेश तक नहीं पहुंच पाए।",

    error_generic: "कुछ गलत हो गया",
    error_retry: "फिर कोशिश करें",
    error_please_retry: "कृपया फिर कोशिश करें।",
    chart_title: "500 संभावित कल के अनुमानित मांग",
    chart_subtitle: "हर बार वह मांग स्तर कितनी बार आया।",
    chart_marker_label: "सर्वाइवल स्टॉक",

    voice_title: "आज की बिक्री बोलकर दर्ज करें",
    voice_subtitle: "बोलें जैसे “91 बिके, 9 बचे” — टाइप करने की जरूरत नहीं।",
    voice_start: "बोलने के लिए दबाएं",
    voice_listening: "सुन रहे हैं...",
    voice_unsupported: "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है। इसके बजाय टाइप करें:",
    voice_placeholder: "जैसे: 91 बिके, 9 बचे",
    voice_parse: "पार्स करें",
    voice_mic_error: "कुछ सुनाई नहीं दिया — माइक्रोफ़ोन जांचें, या टाइप करें।",
    voice_no_numbers: "कोई संख्या नहीं मिली — मात्रा के साथ फिर कोशिश करें।",
    voice_demo_note: "केवल प्रोटोटाइप — डैशबोर्ड में सेव नहीं होता, सिर्फ प्रदर्शन के लिए।",

    neighborhood_title: "बाजार इंटेलिजेंस",
    neighborhood_subtitle: "अभी पर्याप्त बिक्री इतिहास नहीं है? ये नजदीकी वेंडरों के गुमनाम, संयुक्त पैटर्न हैं — आपका अपना पूर्वानुमान तैयार होने तक शुरुआती बिंदु।",
    neighborhood_vendor_count: "{n} नजदीकी वेंडर",
    neighborhood_based_on: "आधारित",
    neighborhood_disclaimer: "नजदीकी स्टॉल्स में गुमनाम और संयुक्त, इस प्रोटोटाइप के लिए काल्पनिक। किसी एक वेंडर की वास्तविक बिक्री नहीं।",

    ocr_title: "थोक बिल स्कैन करें",
    ocr_subtitle: "सप्लायर इनवॉइस की फोटो लें और मात्रा व कीमत अपने आप निकालें।",
    ocr_upload: "अपलोड / फोटो लें",
    ocr_scanning: "बिल पढ़ रहे हैं...",
    ocr_error: "यह छवि नहीं पढ़ पाए — बेहतर रोशनी वाली साफ फोटो आज़माएं।",
    ocr_detected_items: "पहचानी गई वस्तुएं",
    ocr_no_items: "इस छवि में स्पष्ट मात्रा/कीमत जोड़े नहीं मिले।",
    ocr_no_text: "कोई टेक्स्ट नहीं मिला।",
    ocr_show_raw: "मूल निकाला गया टेक्स्ट दिखाएं",
    ocr_hide_raw: "मूल टेक्स्ट छुपाएं",
    ocr_scan_another: "दूसरा बिल स्कैन करें",
    ocr_demo_note: "केवल प्रोटोटाइप — OCR आपके ब्राउज़र में चलता है, कुछ भी अपलोड या सेव नहीं होता। सटीकता लिखावट और फोटो गुणवत्ता पर निर्भर करती है।",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("bazaarsaathi_lang") || "en";
    } catch {
      return "en";
    }
  });

  function changeLang(next) {
    setLang(next);
    try {
      localStorage.setItem("bazaarsaathi_lang", next);
    } catch {
      // ignore -- storage may be unavailable (private browsing etc.)
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = STRINGS[lang] || STRINGS.en;
    return (key, vars) => {
      let str = dict[key] ?? STRINGS.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang: changeLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
