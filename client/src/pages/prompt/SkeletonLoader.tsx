import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <div className="fixed inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none z-0">
        <div
          className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
          style={{ backgroundSize: '40px 40px' }}
        ></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-2"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex gap-2 overflow-x-auto">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* AI Review Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Reviews Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                            ))}
                          </div>
                        </div>
                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-1"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-1"></div>
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-2 mx-auto"></div>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-sm">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Quick Info Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-4"></div>
              <div className="space-y-3 text-sm">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default SkeletonLoader;
