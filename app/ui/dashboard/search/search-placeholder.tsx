export function SearchPlaceholder() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Semantic Search
      </h2>
      <p className="text-gray-600 mb-4">This page will feature:</p>
      <ul className="list-disc list-inside text-gray-600 space-y-2">
        <li>Natural language query interface</li>
        <li>AI-powered semantic search using embeddings</li>
        <li>Results ranked by content similarity (via Pinecone)</li>
        <li>Source citations and document snippets</li>
        <li>Search history and saved queries</li>
        <li>Context-aware answers from your documents</li>
      </ul>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-purple-800 text-sm">
          <strong>Coming soon:</strong> Vector search with OpenAI embeddings and
          Pinecone integration
        </p>
      </div>

      {/* Mock search interface preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
          <span className="text-sm text-gray-500">
            Search Interface Preview
          </span>
        </div>
        <div className="bg-white p-3 rounded border">
          <input
            type="text"
            placeholder="Ask anything about your documents..."
            className="w-full text-gray-400 border-none outline-none"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
