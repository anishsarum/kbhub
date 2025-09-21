export default function DocumentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600 mt-2">
          Upload and manage your knowledge base files
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Document Management
        </h2>
        <p className="text-gray-600 mb-4">This page will allow you to:</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Upload PDF files and text documents</li>
          <li>View processing status (embedding generation)</li>
          <li>Manage existing documents (rename, delete, organize)</li>
          <li>Preview document content and metadata</li>
          <li>Track upload history and file statistics</li>
        </ul>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Coming soon:</strong> Drag & drop file upload with OpenAI
            embedding processing
          </p>
        </div>
      </div>
    </div>
  );
}
