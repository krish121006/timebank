import React from 'react';
import { ExchangeStatus } from '../../types';

interface StatusBadgeProps {
  status: ExchangeStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'REQUESTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACCEPTED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCHEDULED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'IN_PROGRESS':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PENDING_CONFIRMATION':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'DISPUTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'REQUESTED':
        return '⏳ Requested';
      case 'ACCEPTED':
        return '✓ Accepted';
      case 'SCHEDULED':
        return '📅 Scheduled';
      case 'IN_PROGRESS':
        return '🔄 In Progress';
      case 'PENDING_CONFIRMATION':
        return '✋ Pending Confirmation';
      case 'COMPLETED':
        return '✔ Completed';
      case 'CANCELLED':
        return '✕ Cancelled';
      case 'DISPUTED':
        return '⚠️ Disputed';
      default:
        return status;
    }
  };

  return <span className={`badge-status ${getStyles()}`}>{getLabel()}</span>;
};
