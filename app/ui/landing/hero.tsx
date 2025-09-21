import Link from "next/link";

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Main Heading */}
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Knowledge Base Hub
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Organize, share, and discover knowledge. Your central hub for all the
          information that matters.
        </p>

        {/* Call to Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/auth?mode=signup"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 
                     border border-transparent text-base font-medium rounded-lg text-white 
                     bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Get Started
          </Link>

          <Link
            href="/auth?mode=login"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 
                     border border-slate-300 text-base font-medium rounded-lg text-slate-700 
                     bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Organize
            </h3>
            <p className="text-slate-600">
              Structure your knowledge with categories, tags, and smart
              organization.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Share</h3>
            <p className="text-slate-600">
              Collaborate with your team and share knowledge across your
              organization.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Discover
            </h3>
            <p className="text-slate-600">
              Find information quickly with powerful search and intelligent
              recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
