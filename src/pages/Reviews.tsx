import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { Card, SectionHeading, Button } from '../components/UI';
import axios from 'axios';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/reviews');
      // Sort by newest first
      const sorted = res.data.sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setReviews(sorted);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-[50px] md:py-[70px] lg:py-[120px] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Success Stories</span>
            </motion.div>
            <SectionHeading 
              title="What our clients say about the squad." 
              subtitle="Testimonials" 
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:block"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
              <h4 className="text-4xl font-black text-white mb-2">99%</h4>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={48} className="text-primary animate-spin mb-6" />
            <p className="text-white/20 font-mono text-xs uppercase tracking-[0.4em]">Syncing Feedback Database...</p>
          </div>
        ) : (
          <AnimatePresence>
            {reviews.length > 0 ? (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
              >
                {reviews.map((review) => (
                  <motion.div
                    key={review._id}
                    variants={item}
                    className="break-inside-avoid"
                  >
                    <Card className="flex flex-col gap-8 group relative hover:border-primary/40 transition-all duration-500 bg-white/[0.02] backdrop-blur-3xl p-10">
                      <Quote size={60} className="text-primary/10 absolute -top-4 -right-2 group-hover:text-primary/20 transition-colors pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-xl font-bold mb-1 tracking-tight">{review.title || 'Exceptional Results'}</h4>
                            <p className="text-[9px] text-primary font-mono uppercase tracking-[0.2em] font-black">Ref: {review.orderId || 'SQUAD-CERTIFIED'}</p>
                         </div>
                         <div className="flex gap-1 text-primary">
                            {[...Array(5)].map((_, j) => (
                              <Star 
                                key={j} 
                                size={12} 
                                className={j < (review.rating || 5) ? "fill-primary" : "text-white/10 fill-none"} 
                              />
                            ))}
                         </div>
                      </div>

                      <p className="text-xl leading-relaxed text-white/80 font-light italic">
                        "{review.feedback}"
                      </p>

                      <div className="flex items-center gap-5 border-t border-white/5 pt-8 mt-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center font-display font-black text-white text-xl shadow-lg shadow-primary/20">
                          {(review.clientName || review.name || 'C')[0]}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h5 className="font-bold text-white text-lg truncate">{review.clientName || review.name}</h5>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0" />
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Verified Client</p>
                          </div>
                          {review.developerName && (
                            <p className="text-[10px] text-primary/70 font-mono mt-1 truncate">
                              Handled by: <span className="text-primary font-bold">{review.developerName}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
                 <MessageSquare size={48} className="text-white/10 mx-auto mb-6" />
                 <p className="text-white/40 italic">No reviews found in the database yet.</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
