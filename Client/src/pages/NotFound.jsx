import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center max-w-md"
    >
      {/* Animated 404 */}
      <div className="relative mb-8">
        <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-400 select-none">
          404
        </div>
        <div className="absolute inset-0 blur-3xl bg-violet-600/20 rounded-full" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-full transition-colors"
        >
          Go home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-full transition-colors"
        >
          Go back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
