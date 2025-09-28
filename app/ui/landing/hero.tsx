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
          Organise and discover knowledge with AI-powered search. Your central
          hub for all the information that matters.
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
              Organise
            </h3>
            <p className="text-slate-600">
              Structure your knowledge with categories, tags, and smart
              organization.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              AI Search
            </h3>
            <p className="text-slate-600">
              Find content by meaning, not just keywords. Powered by OpenAI
              embeddings and vector similarity.
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
