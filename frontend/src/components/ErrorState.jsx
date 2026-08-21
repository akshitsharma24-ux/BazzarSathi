export default function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 flex items-center justify-between gap-4 flex-wrap">
      <span>
        Something went wrong{message ? `: ${message}.` : "."} Please try again.
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 bg-white border border-red-300 text-red-600 hover:bg-red-100 font-medium text-xs px-3 py-1.5 rounded-md transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}
