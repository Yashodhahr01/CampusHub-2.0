import React, { useState, useEffect } from 'react';
import { PackageSearch, Plus, Search } from 'lucide-react';
import LostFoundCard from '../../components/LostFoundCard';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [itemType, setItemType] = useState('All');
  const [search, setSearch] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const { showToast } = useToast();

  const [postForm, setPostForm] = useState({
    itemType: 'LOST',
    title: '',
    description: '',
    category: 'Personal Belongings',
    location: '',
    contactMethod: ''
  });

  useEffect(() => {
    fetchItems();
  }, [itemType, search]);

  const fetchItems = () => {
    api.get('/lostfound', { itemType, search }).then(res => res.success && setItems(res.items || []));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/lostfound', postForm);
      if (res.success) {
        showToast(res.message, 'success');
        setShowPostModal(false);
        fetchItems();
      }
    } catch (err) {
      showToast('Failed to post item', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><PackageSearch size={24} color="#06b6d4" /> Campus Lost & Found</h1>
          <p className="page-subtitle">Report lost items or post found belongings with automatic item matching</p>
        </div>
        <button onClick={() => setShowPostModal(true)} className="btn btn-primary">
          <Plus size={16} /> Post Lost / Found Item
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <input type="text" className="form-input" placeholder="Search lost or found items..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <select className="form-select" value={itemType} onChange={e => setItemType(e.target.value)}>
              <option>All</option>
              <option value="LOST">🔴 Lost Items Only</option>
              <option value="FOUND">🟢 Found Items Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-cols-3">
        {items.map(item => (
          <LostFoundCard key={item.id} item={item} onResolve={fetchItems} />
        ))}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Report Lost or Found Item</h3>

            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label className="form-label">Post Type</label>
                <select className="form-select" value={postForm.itemType} onChange={e => setPostForm({ ...postForm, itemType: e.target.value })}>
                  <option value="LOST">LOST — I lost an item</option>
                  <option value="FOUND">FOUND — I found an item</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Item Title</label>
                <input required type="text" className="form-input" placeholder="e.g. Blue Hydro Flask Water Bottle" value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })}>
                    <option>Personal Belongings</option>
                    <option>Electronics</option>
                    <option>ID Card / Documents</option>
                    <option>Books / Stationery</option>
                    <option>Keys / Accessories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input required type="text" className="form-input" placeholder="e.g. Near A-Block Staircase" value={postForm.location} onChange={e => setPostForm({ ...postForm, location: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description & Marks</label>
                <textarea required rows={3} className="form-textarea" placeholder="Detailed description of the item..." value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Details</label>
                <input required type="text" className="form-input" placeholder="Phone or email for claims" value={postForm.contactMethod} onChange={e => setPostForm({ ...postForm, contactMethod: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowPostModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
