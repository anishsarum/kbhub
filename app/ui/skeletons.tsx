const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function DocumentCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col h-full`}
    >
      {/* Header with icon/type and date */}
      <div className="flex items-start justify-start gap-4 mb-3">
        <div className="flex items-center">
          <div className="h-5 w-5 bg-gray-200 rounded mr-2 flex-shrink-0"></div>
          <div className="h-3 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center ml-auto">
          <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>

      {/* Content preview */}
      <div className="space-y-2 mb-4 flex-grow">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
      </div>

      {/* Tags */}
      <div className="flex items-center flex-wrap gap-2 mt-auto">
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-5 w-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

export function LibraryPageSkeleton() {
  return (
    <div>
      {/* Cards grid skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DocumentCardSkeleton />
        <DocumentCardSkeleton />
        <DocumentCardSkeleton />
        <DocumentCardSkeleton />
        <DocumentCardSkeleton />
        <DocumentCardSkeleton />
      </div>
    </div>
  );
}

export function DocumentDetailSkeleton() {
  return (
    <div>
      {/* Document Header Skeleton */}
      <div
        className={`${shimmer} relative overflow-hidden bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-6`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="h-6 w-6 bg-gray-200 rounded mr-3"></div>
              <div className="h-3 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          </div>

          {/* Edit Button Skeleton */}
          <div className="h-10 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Metadata Skeleton */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
            <div className="h-3 w-28 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Document Content Skeleton */}
      <div
        className={`${shimmer} relative overflow-hidden bg-white rounded-lg shadow-md border border-gray-200 p-8`}
      >
        <div className="h-5 w-20 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function EditDocumentSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
      </div>

      {/* Form Skeleton */}
      <div
        className={`${shimmer} relative overflow-hidden bg-white rounded-lg shadow-sm border border-slate-200 p-6`}
      >
        <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-6">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-40 w-full bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <div className="h-10 w-16 bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden bg-white border border-slate-200 rounded-lg p-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-full bg-gray-200 rounded"></div>
            <div className="h-3 w-4/5 bg-gray-200 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-2">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-3">
        <SearchResultSkeleton />
        <SearchResultSkeleton />
        <SearchResultSkeleton />
        <SearchResultSkeleton />
        <SearchResultSkeleton />
      </div>
    </div>
  );
}
