export default function Loading() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Skeleton */}
        <div className="relative mb-12">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />

          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 animate-pulse" />

            <div className="mb-4 space-y-2">
              <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Profile Content Skeleton */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            <div className="h-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />

            {/* Post Skeletons */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-8 border-4 border-gray-200 dark:border-gray-800 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
