import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Exchange, SmartMatchCandidate } from '../types';
import { Clock, Plus, Search, RefreshCw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, wallet } = useAuth();
  const [activeExchanges, setActiveExchanges] = useState<Exchange[]>([]);
  const [recommendedMatches, setRecommendedMatches] = useState<SmartMatchCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [exRes, matchRes] = await Promise.all([
          api.get('/exchanges'),
          api.post('/matching/search', { query: '' })
        ]);
        setActiveExchanges(exRes.data.slice(0, 3));
        setRecommendedMatches(matchRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider">TimeBank Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">Good day, {user?.name}!</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            You have <strong className="text-white font-semibold">{wallet?.cachedBalance ?? 5} Time Credits</strong> available to learn new skills or request mentoring.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/discover" className="btn-primary bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find a Match
          </Link>
          <Link to="/profile" className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20">
            <Plus className="w-4 h-4" />
            Offer a Skill
          </Link>
        </div>
      </div>

      {/* Credit Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-blue-200 bg-blue-50/50">
          <div className="flex justify-between items-center text-blue-900">
            <span className="text-sm font-semibold">Available Balance</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {wallet?.cachedBalance ?? 5} <span className="text-sm font-normal text-slate-500">Time Credits</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">1 credit = 1 hour of skill exchange session</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-sm font-semibold">Completed Exchanges</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {user?.completedExchangesCount ?? 0}
          </div>
          <p className="text-xs text-slate-500 mt-2">Community reputation: {user?.ratingAverage ?? 5.0} ★</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-center text-slate-600">
            <span className="text-sm font-semibold">Pending Sessions</span>
            <RefreshCw className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#0F172A] mt-2">
            {activeExchanges.filter((e) => e.status !== 'COMPLETED' && e.status !== 'CANCELLED').length}
          </div>
          <p className="text-xs text-slate-500 mt-2">Active requests and scheduled exchanges</p>
        </div>
      </div>

      {/* Active Exchanges Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#2563EB]" />
            Active & Pending Exchanges
          </h2>
          <Link to="/exchanges" className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {activeExchanges.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-slate-500 text-sm">No active exchanges at the moment.</p>
            <Link to="/discover" className="btn-primary text-sm inline-block mt-3">
              Discover Skills
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeExchanges.map((ex) => (
              <div key={ex._id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <StatusBadge status={ex.status} />
                    <span className="text-xs font-semibold text-slate-500">{ex.creditAmount} Credit</span>
                  </div>
                  <h3 className="font-bold text-[#0F172A] text-base">{ex.skillName}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    With: <strong className="text-slate-800">{ex.providerId?.name || ex.requesterId?.name}</strong>
                  </p>
                </div>
                <Link
                  to={`/exchanges`}
                  className="mt-4 btn-secondary text-xs text-center py-2 font-semibold"
                >
                  Manage Session
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Matches Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Recommended Smart Matches
          </h2>
          <Link to="/discover" className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedMatches.map((match, idx) => (
            <div key={idx} className="card flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                    {match.matchScore}% Match
                  </span>
                  <span className="text-xs text-amber-600 font-semibold">★ {match.candidateUser.ratingAverage}</span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-lg mt-3">{match.skill.skillName}</h3>
                <p className="text-sm text-slate-600">By {match.candidateUser.name}</p>
                <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 block">Why this matches:</span>
                  {match.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-1">
                      <span className="text-emerald-500">✓</span> {r}
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/discover" className="mt-4 btn-primary text-xs text-center py-2 font-semibold">
                Request Skill
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
