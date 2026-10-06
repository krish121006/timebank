import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, ShieldCheck, UserCheck } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState<boolean>(searchParams.get('signup') === 'true');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await api.post('/auth/register', {
          username,
          email,
          password,
          name,
          role: username.toLowerCase().includes('admin') ? 'ADMIN' : 'MEMBER'
        });
        login(res.data.token, res.data.user);
      } else {
        const res = await api.post('/auth/login', {
          emailOrUsername: email || username,
          password
        });
        login(res.data.token, res.data.user);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-2xl shadow-sm mb-4">
            <Clock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">
            {isSignUp ? 'Join TimeBank' : 'Welcome back to TimeBank'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isSignUp
              ? 'Start with 5 initial Time Credits to exchange skills with peers'
              : 'Sign in to manage your time credits & active exchanges'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isSignUp ? 'Username' : 'Email or Username'}
            </label>
            <input
              type="text"
              required
              value={isSignUp ? username : email || username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (!isSignUp) setEmail(e.target.value);
              }}
              placeholder={isSignUp ? 'rahul_react' : 'rahul@example.com or rahul_react'}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 text-sm"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 text-sm"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base font-semibold">
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-sm font-semibold text-[#2563EB] hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
