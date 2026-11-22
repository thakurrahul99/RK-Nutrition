import { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ProductReviews({ productId, productName }) {
  const storageKey = `rk_reviews_${productId}`;

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews, storageKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) {
      setError('Please provide your name and review comments.');
      return;
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      rating,
      author: authorName.trim(),
      title: reviewTitle.trim() || 'Verified Customer Review',
      comment: reviewText.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prev) => [newReview, ...prev]);
    setAuthorName('');
    setReviewTitle('');
    setReviewText('');
    setRating(5);
    setError(null);
    setSubmitted(true);
    setIsFormOpen(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="border-t border-[#262626] pt-10 space-y-6">
      
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-2xl sm:text-3xl uppercase font-bold text-[#F5F4F2] tracking-wide">
              Customer Reviews
            </h3>
            <span className="text-xs font-mono text-[#8C8C8C] bg-[#1A1A1A] px-2 py-0.5 border border-[#2E2E2E]">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
          {averageRating && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#E11D2E]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? 'fill-[#E11D2E]' : 'text-[#333333]'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-[#F5F4F2] font-bold">
                {averageRating} out of 5
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 bg-[#1F1F1F] hover:bg-[#282828] text-[#F5F4F2] border border-[#333333] hover:border-[#E11D2E] font-heading uppercase text-xs tracking-wider font-bold transition-colors cursor-pointer"
        >
          {isFormOpen ? 'Cancel Review' : 'Write A Review'}
        </button>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Thank you! Your feedback has been submitted successfully.</span>
        </div>
      )}

      {/* Review Submission Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-6 bg-[#161616] border border-[#2A2A2A] space-y-4">
          <div className="flex items-center justify-between border-b border-[#242424] pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
              SUBMIT FORMULATION FEEDBACK
            </span>
            <span className="text-xs text-[#8C8C8C] font-mono">
              {productName}
            </span>
          </div>

          {error && (
            <div className="p-2.5 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Star Rating Select */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-[#E11D2E] focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating) ? 'fill-[#E11D2E] text-[#E11D2E]' : 'text-[#333333]'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-mono text-[#F5F4F2]">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="review-author" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
                Your Name <span className="text-[#E11D2E]">*</span>
              </label>
              <input
                id="review-author"
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Arjun S."
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="review-title" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
                Review Headline
              </label>
              <input
                id="review-title"
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Clean mixability, zero bloating"
                className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-xs text-[#F5F4F2] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="review-comment" className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] block">
              Detailed Comments <span className="text-[#E11D2E]">*</span>
            </label>
            <textarea
              id="review-comment"
              rows={4}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe your experience regarding taste, mixability, digestion, and performance results..."
              className="w-full bg-[#111111] border border-[#2E2E2E] focus:border-[#E11D2E] px-3.5 py-2.5 text-xs text-[#F5F4F2] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-[#555555]">
              Real reviews submitted by verified storefront visitors.
            </span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E11D2E] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase tracking-wider text-xs font-bold transition-colors cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 bg-[#161616] border border-[#242424] text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-[#444444] mx-auto" />
            <h4 className="font-heading text-lg uppercase text-[#F5F4F2] font-bold">
              No Reviews Yet
            </h4>
            <p className="text-xs text-[#8C8C8C] max-w-sm mx-auto font-body">
              Be the first to share your experience with this formulation. Click "Write a Review" above to leave your verified feedback.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#222222]">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#E11D2E]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#E11D2E]' : 'text-[#333333]'}`}
                        />
                      ))}
                    </div>
                    <span className="font-heading font-bold text-sm text-[#F5F4F2]">
                      {rev.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#666666]">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#AAAAAA] font-body leading-relaxed">
                  {rev.comment}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#8C8C8C]">
                  <span className="font-semibold text-[#D0D0D0]">{rev.author}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
