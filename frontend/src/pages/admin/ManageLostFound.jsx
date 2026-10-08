import React, { useState, useEffect } from 'react';
import { PackageSearch, Trash2 } from 'lucide-react';
import LostFoundCard from '../../components/LostFoundCard';
import api from '../../services/api';

export default function ManageLostFound() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    api.get('/lostfound').then(res => res.success && setItems(res.items || []));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><PackageSearch size={24} color="#06b6d4" /> Moderate Lost & Found Posts ({items.length})</h1>
          <p className="page-subtitle">Review campus posts, verify ownership matches, and mark items resolved</p>
        </div>
      </div>

      <div className="grid-cols-3">
        {items.map(item => (
          <LostFoundCard key={item.id} item={item} onResolve={fetchItems} />
        ))}
      </div>
    </div>
  );
}
