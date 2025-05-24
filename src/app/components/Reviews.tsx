'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

const initialReviews: Review[] = [
  {
    id: '1',
    author: 'Анна',
    rating: 5,
    text: 'Очень вкусная шаурма! Особенно понравился соус и свежие овощи. Обязательно закажу еще.',
    date: '15.03.2024',
    avatar: '/avatars/anna.jpg'
  },
  {
    id: '2',
    author: 'Михаил',
    rating: 4,
    text: 'Хорошее соотношение цена-качество. Быстрое обслуживание и приятный персонал.',
    date: '14.03.2024'
  },
  {
    id: '3',
    author: 'Елена',
    rating: 5,
    text: 'Лучшая шаурма в городе! Всегда свежая и вкусная. Рекомендую попробовать с соусом карри.',
    date: '13.03.2024',
    avatar: '/avatars/elena.jpg'
  },
  {
    id: '4',
    author: 'Дмитрий',
    rating: 4,
    text: 'Удобно заказывать через сайт. Приятно, что можно выбрать время готовности.',
    date: '12.03.2024'
  },
  {
    id: '5',
    author: 'Ольга',
    rating: 5,
    text: 'Отличный сервис и вкусная еда! Особенно понравился вегетарианский вариант.',
    date: '11.03.2024',
    avatar: '/avatars/olga.jpg'
  }
];

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleReviews = isExpanded ? reviews : reviews.slice(0, 3);

  const handleSubmitReview = async (review: { author: string; rating: number; text: string }) => {
    const newReview: Review = {
      id: Date.now().toString(),
      ...review,
      date: new Date().toLocaleDateString('ru-RU'),
    };

    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <section className="bg-[#232323] rounded-2xl p-8 shadow-xl border-2 border-[#6de082]">
      <h2 className="text-3xl font-extrabold text-white mb-6 graffiti-title">Отзывы</h2>
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#5f2dab] p-4 rounded-lg"
          >
            <h3 className="text-xl font-bold text-[#6de082]">{review.author}</h3>
            <p className="text-gray-300">{review.text}</p>
            <div className="flex items-center mt-2">
              {[...Array(review.rating)].map((_, i) => (
                <span key={i} className="text-[#6de082]">★</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-3 bg-[#6de082] text-white rounded-md hover:bg-[#5bc06f] transition-colors"
          >
            {isExpanded ? 'Показать меньше' : 'Показать все отзывы'}
          </motion.button>
        </div>
      )}

      <div className="mt-8">
        <ReviewForm onSubmit={handleSubmitReview} />
      </div>
    </section>
  );
} 