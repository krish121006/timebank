import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { CreditTransaction } from '../types';
import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck } from 'lucide-react';

export const WalletPage: React.FC = () => {
  const { wallet } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/wallet/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalEarned = transactions
    .filter((t) => t.direction === 'INBOUND')
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.direction === 'OUTBOUND')
    .reduce((acc, cur) => acc + cur.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <WalletIcon className="w-6 h-6 text-[#2563EB]" />
          Time Credit Wallet & Ledger
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Every time credit movement is backed by an append-only transaction ledger record.
        </p>
      </div>

      {/* Wallet Balance Hero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 border-none shadow-md">
          <span className="text-xs uppercase font-semibold text-blue-300">Available Credits</span>
          <div className="text-4xl font-extrabold mt-2 flex items-baseline gap-2">
            {wallet?.cachedBalance ?? 5}
            <span className="text-sm font-normal text-blue-200">Time Credits</span>
          </div>
          <p className="text-xs text-blue-200/80 mt-3 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 1 Credit = 1 Hour of Skill Mentoring
          </p>
        </div>

        <div className="card border-emerald-200 bg-emerald-50/40">
          <div className="flex justify-between items-center text-emerald-800">
            <span className="text-sm font-semibold">Total Credits Earned</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-950 mt-2">+{totalEarned}</div>
          <p className="text-xs text-slate-500 mt-2">Earned by teaching and sharing skills</p>
        </div>

        <div className="card border-slate-200">
          <div className="flex justify-between items-center text-slate-700">
            <span className="text-sm font-semibold">Total Credits Spent</span>
            <ArrowUpRight className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">-{totalSpent}</div>
          <p className="text-xs text-slate-500 mt-2">Spent receiving skill guidance</p>
        </div>
      </div>

      {/* Ledger History Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 text-sm">Ledger Audit History</h2>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Immutable Records
          </span>
        </div>

        {transactions.length === 0 && !loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">No transaction records yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const isInbound = tx.direction === 'INBOUND';

              return (
                <div key={tx._id} className="p-4 flex justify-between items-center hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                        isInbound ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isInbound ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{tx.description}</h4>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-base font-extrabold ${
                        isInbound ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {isInbound ? '+' : '-'}{tx.amount} Credit
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      {tx.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
