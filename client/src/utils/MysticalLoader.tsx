

const MysticalLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="relative w-48 h-48">
        {/* Outer organic morphing ring */}
        <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '2s' }}>
          <div className="absolute inset-4 border-4 border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/20 rounded-full"
               style={{
                 borderRadius: '55% 45% 35% 65% / 55% 35% 65% 45%',
                 animation: 'morph1 1.5s ease-in-out infinite'
               }}>
          </div>
        </div>

        {/* Middle organic energy ring */}
        <div className="absolute w-32 h-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}>
          <div className="absolute inset-3 border-3 border-dashed border-purple-400 dark:border-purple-600 bg-purple-100/20 dark:bg-purple-800/20 rounded-full"
               style={{
                 borderRadius: '45% 55% 65% 35% / 45% 65% 35% 55%',
                 animation: 'morph2 1s ease-in-out infinite reverse'
               }}>
          </div>
        </div>

        {/* Inner core */}
        <div className="absolute w-16 h-16 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-500 animate-pulse shadow-lg shadow-purple-500/50 dark:shadow-purple-400/50"></div>

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="absolute w-1.5 h-1.5 bg-purple-400 dark:bg-purple-300 rounded-full animate-float" style={{
            top: `${Math.random() * 60 + 20}%`,
            left: `${Math.random() * 60 + 20}%`,
            animationDelay: `${Math.random() * 1}s`,
          }}></div>
        ))}

        {/* Mystical glow effect */}
        <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-400/30 dark:to-pink-400/30 animate-pulse blur-md"></div>

        {/* CSS keyframes for animations */}
        <style jsx>{`
          @keyframes morph1 {
            0%, 100% {
              border-radius: 55% 45% 35% 65% / 55% 35% 65% 45%;
            }
            25% {
              border-radius: 35% 65% 55% 45% / 45% 55% 35% 65%;
            }
            50% {
              border-radius: 45% 55% 65% 35% / 35% 45% 55% 65%;
            }
            75% {
              border-radius: 65% 35% 45% 55% / 55% 65% 45% 35%;
            }
          }

          @keyframes morph2 {
            0%, 100% {
              border-radius: 45% 55% 65% 35% / 45% 65% 35% 55%;
            }
            33% {
              border-radius: 65% 35% 45% 55% / 55% 45% 65% 35%;
            }
            66% {
              border-radius: 35% 45% 55% 65% / 65% 35% 45% 55%;
            }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-5px) translateX(5px);
            }
          }
        `}</style>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-20 text-center">
        <div className="flex justify-center space-x-1">
          <div className="w-2.5 h-2.5 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 font-medium tracking-wide">
          Entering the Mystical Realm...
        </p>
      </div>
    </div>
  );
};

export default MysticalLoader;
