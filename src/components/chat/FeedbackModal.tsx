import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ThumbsUp, ThumbsDown, Star, X, CheckCircle2 } from 'lucide-react';

interface FeedbackModalProps {
  sessionId: string;
  messageId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ sessionId, messageId, isOpen, onClose }: FeedbackModalProps) {
  const { submitFeedback } = useStore();
  const [rating, setRating] = useState<'helpful' | 'unhelpful'>('helpful');
  const [clinicalAccuracy, setClinicalAccuracy] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitFeedback({
        sessionId,
        messageId,
        rating,
        clinicalAccuracy,
        feedbackText: comment,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setComment('');
      }, 1500);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Rate This Health Guidance</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">Feedback Submitted</h4>
            <p className="text-xs text-slate-500">
              Your evaluation helps clinicians ensure medical safety and answer quality.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Was this health guidance helpful?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRating('helpful')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    rating === 'helpful'
                      ? 'bg-teal-50 border-teal-500 text-teal-800 ring-2 ring-teal-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-teal-600" />
                  <span>Helpful & Clear</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRating('unhelpful')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    rating === 'unhelpful'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>Needs Improvement</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Clinical Safety & Clarity Score (1-5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setClinicalAccuracy(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= clinicalAccuracy ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">
                  {clinicalAccuracy === 5
                    ? 'Exceptional'
                    : clinicalAccuracy >= 4
                    ? 'Good'
                    : clinicalAccuracy >= 3
                    ? 'Moderate'
                    : 'Inadequate'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical observations or missing precautions (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g., Explain why honey is contraindicated in infants, or clarify allergy notes..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none h-20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                {isSubmitting ? 'Recording...' : 'Submit Evaluation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
