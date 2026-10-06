import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Users, RefreshCw, AlertTriangle, FileText } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<'users' | 'exchanges' | 'transactions' | 'disputes'>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/${tab}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [tab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">TimeBank Admin Panel</h1>
          <p className="text-sm text-slate-500">Monitor community users, exchanges, transactions, and disputes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        {[
          { key: 'users', label: 'Users Directory', icon: Users },
          { key: 'exchanges', label: 'All Exchanges', icon: RefreshCw },
          { key: 'transactions', label: 'Credit Ledger', icon: FileText },
          { key: 'disputes', label: 'Disputes & Reports', icon: AlertTriangle }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key as any)}
            className={`py-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              tab === item.key
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Content Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading admin records...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  {tab === 'users' && (
                    <>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Completed Sessions</th>
                    </>
                  )}
                  {tab === 'exchanges' && (
                    <>
                      <th className="p-3">Skill</th>
                      <th className="p-3">Requester</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">Status</th>
                    </>
                  )}
                  {tab === 'transactions' && (
                    <>
                      <th className="p-3">User</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Type</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    {tab === 'users' && (
                      <>
                        <td className="p-3 font-semibold text-slate-800">{item.name} (@{item.username})</td>
                        <td className="p-3">{item.role}</td>
                        <td className="p-3">★ {item.ratingAverage}</td>
                        <td className="p-3">{item.completedExchangesCount}</td>
                      </>
                    )}
                    {tab === 'exchanges' && (
                      <>
                        <td className="p-3 font-semibold text-slate-800">{item.skillName}</td>
                        <td className="p-3">{item.requesterId?.name}</td>
                        <td className="p-3">{item.providerId?.name}</td>
                        <td className="p-3 font-semibold">{item.status}</td>
                      </>
                    )}
                    {tab === 'transactions' && (
                      <>
                        <td className="p-3 font-semibold">{item.userId?.name || 'System User'}</td>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 font-bold text-emerald-600">{item.amount} Cr</td>
                        <td className="p-3">{item.type}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
