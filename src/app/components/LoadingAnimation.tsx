export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <svg
        className="animate-spin h-12 w-12 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
    </div>
  );
}


export function FullscreenLoading({content}:{content:string}) {
  return (
    <div className="scale-100 md:scale-150 fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <LoadingSpinner />
      <p className="text-white text-lg ml-4 text-2xl">{content}</p>
    </div>
  );
}
