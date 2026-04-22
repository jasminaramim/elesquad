import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { Card, SectionHeading } from '../components/UI';
import axios from 'axios';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/reviews')
      .then(res => setReviews(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
      <SectionHeading 
        title="What Our Clients Say" 
        subtitle="Testimonials" 
      />

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass rounded-3xl h-64 shimmer mb-8" />)
        ) : (
          reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="inline-block w-full"
            >
              <Card className="flex flex-col gap-6 group relative">
                <Quote size={40} className="text-primary/20 absolute top-6 right-8 group-hover:text-primary/40 transition-colors" />
                
                <div>
                   <h4 className="text-xl font-bold mb-1">{review.title || 'Client Feedback'}</h4>
                   <p className="text-[10px] text-primary font-mono uppercase tracking-[0.2em]">By {review.developerName || 'Squad Member'}</p>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      size={14} 
                      className={j < review.rating ? "text-primary fill-primary" : "text-white/20"} 
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-white/70 italic">
                  "{review.feedback}"
                </p>
                <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-display font-bold text-primary text-sm">
                    {(review.clientName || review.name || 'C')[0]}
                  </div>
                  <div>
                    <h5 className="font-bold">{review.clientName || review.name}</h5>
                    {review.orderId && <p className="text-[9px] text-white/20 font-mono">ORDER: {review.orderId}</p>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
