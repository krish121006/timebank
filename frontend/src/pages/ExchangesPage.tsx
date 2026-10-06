import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Exchange, ExchangeStatus } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Calendar, CheckCircle2, XCircle, AlertTriangle, MessageSquare, Star } from 'lucide-react';

export const ExchangesPage: React.FC = () => {
  const { user, refreshWallet } = useAuth();
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalExchange, setRatingModalExchange] = useState<Exchange | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchExchanges = async () => {
    try {
      const res = await api.get('/exchanges');
      setExchanges(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleUpdateStatus = async (exchangeId: string, status: ExchangeStatus, data?: any) => {
    try {
      setMsg('');
      await api.patch(`/exchanges/${exchangeId}/status`, { status, ...data });
      await fetchExchanges();
      await refreshWallet();
    } catch (err: any) {
      setMsg(err.response?.data?.message || 'Status update failed.');
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModalExchange) return;
    setSubmittingRating(true);

    const targetUserId =
      ratingModalExchange.providerId._id === user?._id
        ? ratingModalExchange.requesterId._id
        : ratingModalExchange.providerId._id;

    try {
      await api.post('/reputation', {
        exchangeId: ratingModalExchange._id,
        targetUserId,
        rating: ratingValue,
        reviewText
      });
      setRatingModalExchange(null);
      setReviewText('');
      await fetchExchanges();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Rating submission failed.');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-[#2563EB]" />
          My Skill Exchanges
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track lifecycle states, schedule sessions, chat with partners, confirm completions & settle time credits.
        </p>
      </div>

      {msg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {msg}
        </div>
      )}

      {exchanges.length === 0 && !loading ? (
        <div className="card text-center py-12">
          <p className="text-slate-500">Your completed & active exchanges will appear here.</p>
          <Link to="/discover" className="btn-primary text-sm inline-block mt-4">
            Discover & Request Skills
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {exchanges.map((ex) => {
            const isProvider = ex.providerId._id === user?._id;
            const partner = isProvider ? ex.requesterId : ex.providerId;

            return (
              <div key={ex._id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={ex.status} />
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {ex.creditAmount} Time Credit(s)
                    </span>
                    <span className="text-xs text-slate-400">
                      Role: <strong>{isProvider ? 'Teacher/Provider' : 'Learner/Requester'}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A]">{ex.skillName}</h3>
                  <p className="text-sm text-slate-600">
                    Partner: <strong className="text-slate-800">{partner.name}</strong> (@{partner.username})
                  </p>

                  {ex.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                      "{ex.notes}"
                    </p>
                  )}
                </div>

                {/* State Machine Control Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    to={`/chat/${ex._id}`}
                    className="btn-secondary text-xs flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </Link>

                  {isProvider && ex.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleUpdateStatus(ex._id, 'ACCEPTED')}
                      className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-500"
                    >
                      Accept Request
                    </button>
                  )}

                  {ex.status === 'ACCEPTED' && (
                    <button
                      onClick={() => {
                        const dateStr = prompt('Enter session date/time (e.g. 2026-09-27T18:00):');
                        if (dateStr) handleUpdateStatus(ex._id, 'SCHEDULED', { scheduledAt: dateStr });
                      }}
                      className="btn-primary text-xs"
                    >
                      Schedule Session
                    </button>
                  )}

                  {ex.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleUpdateStatus(ex._id, 'IN_PROGRESS')}
                      className="btn-primary text-xs bg-indigo-600 hover:bg-indigo-500"
                    >
                      Start Session
                    </button>
                  )}

                  {(ex.status === 'IN_PROGRESS' || ex.status === 'SCHEDULED') && (
                    <button
                      onClick={() => handleUpdateStatus(ex._id, 'PENDING_CONFIRMATION')}
                      className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-500"
                    >
                      Confirm Complete
                    </button>
                  )}

                  {ex.status === 'COMPLETED' && (
                    <button
                      onClick={() => setRatingModalExchange(ex)}
                      className="btn-secondary text-xs flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      Rate Partner
                    </button>
                  )}

                  {['REQUESTED', 'ACCEPTED', 'SCHEDULED'].includes(ex.status) && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this exchange?')) {
                          handleUpdateStatus(ex._id, 'CANCELLED');
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating & Review Modal */}
      {ratingModalExchange && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#0F172A]">Rate & Review Exchange</h3>
            <p className="text-sm text-slate-500">
              Share your feedback for session: <strong>{ratingModalExchange.skillName}</strong>
            </p>

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRatingValue(star)}
                      className={star <= ratingValue ? 'text-amber-500' : 'text-slate-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Review Comment</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Great session! Very clear explanations."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/40"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRatingModalExchange(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="btn-primary flex-1 font-semibold"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
