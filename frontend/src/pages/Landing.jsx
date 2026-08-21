export default function Landing({ onEnter }) {
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-5xl">🛒</span>
        <h1 className="text-3xl font-bold text-gray-900">BazaarSaathi</h1>
        <p className="text-gray-500">
          Decision support for the vendor who can't afford to guess wrong.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">Meet Ramesh.</h2>
        <p className="text-gray-600 leading-relaxed">
          Every morning, before his first customer shows up, Ramesh has to
          decide how much to prepare at his vada pav stall. There's no
          forecasting team, no supply chain software — just a guess, made on
          tight working capital, with real rupees riding on it.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Prepare too much, and whatever doesn't sell is thrown out by
          evening — money he can't get back. Prepare too little, and he turns
          away paying customers on his best day of the week.
        </p>
        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-700 font-medium">
            BazaarSaathi simulates hundreds of possible "tomorrows" — weather,
            events, demand noise — and recommends the stock level that stays
            financially safe across them, not just the single most likely one.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onEnter}
          className="bg-saathi-600 hover:bg-saathi-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          See how it works →
        </button>
      </div>
    </div>
  );
}
