import React from 'react';

export default function StatusBadge({ status, type }) {
  let badgeClass = 'badge-info';

  const s = String(status).toLowerCase();

  if (s === 'vacant' || s === 'resolved' || s === 'answered' || s === 'approved' || s === 'open') {
    badgeClass = 'badge-success';
  } else if (s === 'occupied' || s === 'urgent' || s === 'closed' || s === 'rejected') {
    badgeClass = 'badge-danger';
  } else if (s === 'reserved' || s === 'pending' || s === 'under review' || s === 'in progress' || s === 'high') {
    badgeClass = 'badge-warning';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'currentColor'
      }}></span>
      {status}
    </span>
  );
}
