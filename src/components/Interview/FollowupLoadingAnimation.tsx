import React from 'react';
import { motion } from 'framer-motion';

interface FollowupLoadingAnimationProps {
  isVisible: boolean;
}

const FollowupLoadingAnimation: React.FC<FollowupLoadingAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
        {/* AI Brain Animation */}
        <div className="mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl mb-4"
          >
            🧠
          </motion.div>
          
          {/* Pulsing dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Loading Text */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="space-y-2"
        >
          <h3 className="text-xl font-semibold text-gray-900">
            Generating Follow-up Question
          </h3>
          <p className="text-gray-600">
            AI is analyzing your response to create the perfect next question...
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              animate={{ width: ["0%", "100%"] }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Typing Animation */}
        <div className="mt-4 flex justify-center">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-sm text-gray-500"
          >
            Thinking...
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FollowupLoadingAnimation;

