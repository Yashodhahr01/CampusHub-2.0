import React, { useState } from 'react';
import { FileText, Download, User, Calendar, BookOpen } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ResourceCard({ resource }) {
  const [downloads, setDownloads] = useState(resource.downloadsCount || 0);
  const { showToast } = useToast();

  const handleDownload = async () => {
    try {
      await api.post(`/resources/${resource.id}/download`);
      setDownloads(prev => prev + 1);
      showToast(`Downloading "${resource.title}"...`, 'success');
      
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `${resource.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast('Download failed', 'error');
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
            {resource.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sem {resource.semester}</span>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {resource.title}
        </h3>

        <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {resource.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><BookOpen size={13} /> {resource.subject}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={13} /> {resource.uploadedByName}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{resource.fileType} • {resource.fileSize}</span>
        <button onClick={handleDownload} className="btn btn-primary btn-sm">
          <Download size={14} /> Download ({downloads})
        </button>
      </div>
    </div>
  );
}
