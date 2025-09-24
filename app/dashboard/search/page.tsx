import { SearchPlaceholder } from "@/app/ui/dashboard/search-placeholder";

export default function SearchPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600 mt-2">
          AI-powered semantic search through your knowledge base
        </p>
      </div>

      <SearchPlaceholder />
    </div>
  );
}
