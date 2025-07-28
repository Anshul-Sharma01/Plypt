import React from 'react';

const CraftorProfileLoader = () => {
  const SkeletonElement = ({ type, className }) => {
    const classes = `bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`;
    return <div className={classes}></div>;
  };

  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
    </div>
  );

  const MysticalBorder = ({ children, className = "" }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-pink-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );

  const GridBackground = () => (
    <div className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none">
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-gray-800 dark:text-white relative overflow-hidden">
      <FloatingOrbs />
      <GridBackground />

      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(120,119,198,0.1),_transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(120,119,198,0.3),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(120,119,198,0.05)_60deg,_transparent_120deg)] dark:bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(120,119,198,0.1)_60deg,_transparent_120deg)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <SkeletonElement type="badge" className="inline-flex items-center gap-2 mx-auto px-6 py-2 mb-6" />
          <SkeletonElement type="title" className="w-96 h-12 mx-auto mb-4" />
          <SkeletonElement type="text" className="w-64 h-6 mx-auto" />
        </div>

        {/* Main Profile Section */}
        <MysticalBorder className="mb-12">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar with mystical effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full p-1 animate-spin-slow">
                  <div className="w-48 h-48 bg-white dark:bg-gray-900 rounded-full"></div>
                </div>
                <SkeletonElement type="avatar" className="relative w-48 h-48 rounded-full overflow-hidden" />
                <SkeletonElement type="badge" className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-8 rounded-full" />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <SkeletonElement type="title" className="w-64 h-10 mx-auto lg:mx-0 mb-2" />
                <SkeletonElement type="text" className="w-48 h-6 mx-auto lg:mx-0 mb-4" />
                <SkeletonElement type="text" className="w-full h-20 mx-auto lg:mx-0 mb-8 max-w-2xl" />
                <SkeletonElement type="button" className="w-48 h-12 mx-auto lg:mx-0" />
              </div>
            </div>
          </div>
        </MysticalBorder>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, index) => (
            <MysticalBorder key={index}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SkeletonElement type="icon" className="w-12 h-12 rounded-lg" />
                  <SkeletonElement type="text" className="w-32 h-6" />
                </div>
                <SkeletonElement type="text" className="w-24 h-8" />
              </div>
            </MysticalBorder>
          ))}
        </div>

        {/* Prompts Gallery */}
        <MysticalBorder className="mb-12">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <SkeletonElement type="icon" className="w-8 h-8" />
              <SkeletonElement type="title" className="w-48 h-8" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-300">
                    <SkeletonElement type="image" className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <SkeletonElement type="title" className="w-48 h-6 mb-2" />
                      <SkeletonElement type="text" className="w-full h-12 mb-4" />
                      <div className="flex justify-between items-center">
                        <SkeletonElement type="text" className="w-16 h-8" />
                        <SkeletonElement type="button" className="w-24 h-10" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MysticalBorder>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CraftorProfileLoader;
