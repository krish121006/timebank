import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, Search, RefreshCw, Wallet, User as UserIcon, Shield, LogOut, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, wallet, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-[#0F172A] font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-extrabold shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <span>TimeBank</span>
          </Link>

          {/* Desktop Nav Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive('/dashboard') ? 'bg-slate-100 text-[#2563EB]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/discover"
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  isActive('/discover') ? 'bg-slate-100 text-[#2563EB]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Search className="w-4 h-4" />
                Discover
              </Link>
              <Link
                to="/exchanges"
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  isActive('/exchanges') ? 'bg-slate-100 text-[#2563EB]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Exchanges
              </Link>
              <Link
                to="/wallet"
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  isActive('/wallet') ? 'bg-slate-100 text-[#2563EB]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-4 h-4" />
                Wallet
              </Link>
              <Link
                to="/premium"
                className={`px-3 py-2 rounded-md transition-colors text-amber-600 font-semibold hover:bg-amber-50 ${
                  isActive('/premium') ? 'bg-amber-50' : ''
                }`}
              >
                ⚡ Premium
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                    isActive('/admin') ? 'bg-slate-100 text-purple-600' : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Right Header Status */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Wallet Credits Pill */}
              <Link
                to="/wallet"
                className="flex items-center gap-1.5 bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-100 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>{wallet?.cachedBalance ?? 5} Time Credits</span>
              </Link>

              {/* User Profile Menu */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-slate-800">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/auth" className="btn-secondary text-sm">
                Log In
              </Link>
              <Link to="/auth?signup=true" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
