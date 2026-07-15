import React, { useState } from 'react';
import axios from 'axios';

export default function CategoriesManager({ categories, products, reloadData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingId(cat._id);
      setName(cat.name);
    } else {
      setEditingId(null);
      setName('');
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return alert("الاسم مطلوب");
    try {
      if (editingId) {
        await axios.put(`/api/categories/${editingId}`, { name });
      } else {
        await axios.post('/api/categories', { name, order: categories.length });
      }
      setIsEditing(false);
      reloadData();
    } catch (err) {
      console.error(err);
      alert("خطأ في الحفظ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      reloadData();
    } catch (err) {
      console.error(err);
      alert("خطأ في الحذف");
    }
  };

  return (
    <div className="page-section active">
      <div className="toolbar">
          <span className="toolbar-title" id="categoriesCount">{categories.length} تصنيف</span>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <i className="fa-solid fa-plus"></i> إضافة تصنيف
          </button>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-tags"></i></div>
            <p className="empty-text">لا توجد تصنيفات بعد</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                إضافة أول تصنيف
            </button>
        </div>
      ) : (
        <div className="list-view">
          {categories.map(c => (
            <div className="list-item" key={c._id}>
                <span className="list-item-name">{c.name}</span>
                <span className="list-item-count">{products.filter(p => p.category === c._id).length} منتج</span>
                <button className="btn btn-sm btn-secondary" onClick={() => handleOpenModal(c)}><i className="fa-solid fa-pen-to-square"></i></button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><i className="fa-solid fa-trash"></i></button>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="admin-modal-overlay active">
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <h3>{editingId ? 'تعديل التصنيف' : 'إضافة تصنيف'}</h3>
                    <button className="btn btn-icon btn-sm" onClick={() => setIsEditing(false)}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="admin-modal-body">
                    <div className="form-group">
                        <label className="form-label">اسم التصنيف <span className="required">*</span></label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: عطور صيفية" />
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button className="btn btn-primary" onClick={handleSave}>حفظ التصنيف</button>
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>إلغاء</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
