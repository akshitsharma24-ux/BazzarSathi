export default function SimulateButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full sm:w-auto bg-saathi-600 hover:bg-saathi-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
          Simulating 500 tomorrows...
        </>
      ) : (
        "Simulate Tomorrow"
      )}
    </button>
  );
}
