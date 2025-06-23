import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-sm text-gray-400 mb-8 mt-8">
          <span className="text-gray-400">Home</span>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">404 Error</span>
        </div>
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-6">404 Not Found</h1>
          <p className="text-gray-600 mb-10 text-base md:text-lg">
            Your visited page not found. You may go home page.
          </p>
          <Link href="/">
            <button className="bg-[#DB4444] hover:bg-[#b83232] text-white px-8 py-3 rounded-md text-base font-medium transition-colors">
              Back to home page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
