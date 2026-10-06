import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { SmartMatchCandidate } from '../types';
import { Search, Sparkles, Calendar, Clock, Star, Filter, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DiscoverPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState<SmartMatchCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<SmartMatchCandidate | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSearch = async (queryText?: string) => {
    setLoading(true);
    setMessage('');
    try {
      const q = queryText !== undefined ? queryText : searchQuery;
      const res = await api.post('/matching/search', { query: q });
      setMatches(res.data);
    } catch (err: any) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;
    setRequesting(true);
    setMessage('');

    try {
      await api.post('/exchanges', {
        providerId: selectedMatch.candidateUser._id,
        skillName: selectedMatch.skill.skillName,
        durationHours,
        notes: requestNotes
      });
      setSelectedMatch(null);
      navigate('/exchanges');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to create exchange request.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Search & Natural Language Query */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          <Sparkles className="w-4 h-4 text-amber-500" /> Smart Match Search
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A]">What skill do you need today?</h1>
        <p className="text-sm text-slate-500">
          Search using natural language (e.g. <em>"I need React mentoring this weekend in English"</em>)
        </p>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. React mentoring, Python backend, UI/UX design..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-6"
          >
            {loading ? 'Searching...' : 'Find Matches'}
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap gap-2 pt-2 text-xs font-medium text-slate-600">
          <span className="self-center text-slate-400 font-semibold">Quick Filters:</span>
          {['React', 'Node.js', 'UI/UX', 'Python', 'Data Science', 'English'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                handleSearch(tag);
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full border border-slate-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-[#0F172A]">
          Match Candidates ({matches.length})
        </h2>
      </div>

      {/* Candidates Grid */}
      {matches.length === 0 && !loading ? (
        <div className="card text-center py-12">
          <p className="text-slate-500 text-base">We couldn't find a candidate matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleSearch('');
            }}
            className="btn-secondary text-sm mt-3"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((candidate, idx) => (
            <div key={idx} className="card flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {candidate.skill.category || 'General'}
                    </span>
                    <h3 className="font-bold text-[#0F172A] text-xl mt-2">{candidate.skill.skillName}</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                    {candidate.matchScore}% Match
                  </span>
                </div>

                <div className="flex items-center gap-3 my-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold text-sm flex items-center justify-center">
                    {candidate.candidateUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{candidate.candidateUser.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                        {candidate.candidateUser.ratingAverage} ({candidate.candidateUser.ratingCount})
                      </span>
                      <span>·</span>
                      <span>{candidate.candidateUser.completedExchangesCount} sessions</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg italic">
                  "{candidate.skill.description || 'Ready to share knowledge and guide in exchange for time credits.'}"
                </p>

                {/* Match Reasoning */}
                <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-100 space-y-1">
                  <span className="text-xs font-bold text-blue-900 block">Why this matches:</span>
                  {candidate.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedMatch(candidate)}
                className="mt-5 btn-primary text-sm w-full font-semibold py-2.5"
              >
                Request Skill Exchange
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Exchange Request Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase">Skill Exchange Request</span>
                <h3 className="text-xl font-bold text-[#0F172A]">{selectedMatch.skill.skillName}</h3>
                <p className="text-sm text-slate-500">With {selectedMatch.candidateUser.name}</p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {message && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs">
                {message}
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value={1}>1 Hour (1 Time Credit)</option>
                  <option value={2}>2 Hours (2 Time Credits)</option>
                  <option value={3}>3 Hours (3 Time Credits)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message / Goal for Session
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Describe what you want to learn or work on together..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2563EB]/40 outline-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900 flex justify-between items-center font-semibold">
                <span>You will spend:</span>
                <span className="text-sm text-[#2563EB]">{durationHours} Time Credit(s)</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting}
                  className="btn-primary flex-1 font-semibold"
                >
                  {requesting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
