'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  onSubmit: (review: {
    author: string;
    rating: number;
    text: string;
  }) => void;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !rating || !text) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ author, rating, text });
      setAuthor('');
      setRating(0);
      setText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => (
    <button
      key={i}
      type="button"
      onClick={() => setRating(i + 1)}
      className="focus:outline-none"
    >
      <svg
        className={`w-8 h-8 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Оставить отзыв</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Ваше имя
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Оценка
          </label>
          <div className="flex space-x-1">
            {stars}
          </div>
        </div>

        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Ваш отзыв
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6de082]"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || !author || !rating || !text}
          className="w-full py-3 bg-[#6de082] text-white rounded-md hover:bg-[#5bc06f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </motion.button>
      </form>
    </motion.div>
  );
} 