'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ReviewCardProps {
  review: {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
    avatar?: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <svg
      key={i}
      className={`w-5 h-5 ${
        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          {review.avatar ? (
            <Image
              src={review.avatar}
              alt={review.author}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#6de082] text-white text-xl font-semibold">
              {review.author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{review.author}</h3>
          <div className="flex items-center space-x-1">
            {stars}
          </div>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{review.text}</p>
      <p className="text-sm text-gray-500">{review.date}</p>
    </motion.div>
  );
} 