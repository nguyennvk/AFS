export function Loading() {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading, please wait...</p>
        </div>
      </div>
    );
  }
  