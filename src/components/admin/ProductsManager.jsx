import React, { useState } from 'react';
import axios from 'axios';

export default function ProductsManager({ products, categories, reloadData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [images, setImages] = useState([]);
  const [sizes, setSizes] = useState([{ size: '', price: '' }]);

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingId(p._id);
      setName(p.name);
      setCategory(p.category || '');
      setBadge(p.badge || '');
      setImages(p.images || []);
      setSizes(p.sizes?.length ? p.sizes : [{ size: '', price: '' }]);
    } else {
      setEditingId(null);
      setName('');
      setCategory('');
      setBadge('');
      setImages([]);
      setSizes([{ size: '', price: '' }]);
    }
    setIsEditing(true);
  };

  const handleAddSize = () => setSizes([...sizes, { size: '', price: '' }]);
  const handleRemoveSize = (idx) => setSizes(sizes.filter((_, i) => i !== idx));
  const handleSizeChange = (idx, field, val) => {
    const newSizes = [...sizes];
    newSizes[idx][field] = val;
    setSizes(newSizes);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('images', f));
    
    try {
      const res = await axios.post('/api/upload', formData);
      const newImages = res.data.filePaths.map(src => ({
        src,
        overlay: { text: '', bgColor: '#000000', bgOpacity: 0, textColor: '#ffffff', fontSize: 16, position: 'bottom' }
      }));
      setImages([...images, ...newImages]);
    } catch (err) {
      console.error(err);
      alert('خطأ في الرفع');
    }
  };

  const handleRemoveImage = (idx) => setImages(images.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!name.trim()) return alert("اسم المنتج مطلوب");
    const validSizes = sizes.filter(s => s.size.trim() && s.price);
    
    const productData = { name, category, badge, images, sizes: validSizes };
    
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, productData);
      } else {
        await axios.post('/api/products', { ...productData, order: products.length });
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
      await axios.delete(`/api/products/${id}`);
      reloadData();
    } catch (err) {
      console.error(err);
      alert("خطأ في الحذف");
    }
  };

  if (isEditing) {
    return (
      <div className="page-section active">
        <div className="editor-header">
            <button className="btn btn-icon btn-secondary" onClick={() => setIsEditing(false)}><i className="fa-solid fa-arrow-right"></i></button>
            <h2 id="productEditorTitle">{editingId ? 'تعديل المنتج' : 'إضافة منتج'}</h2>
            <button className="btn btn-primary" onClick={handleSave}><i className="fa-solid fa-floppy-disk"></i> حفظ المنتج</button>
        </div>
        <div className="editor-grid">
            <div className="editor-main">
                <div className="form-group">
                    <label className="form-label">اسم المنتج <span className="required">*</span></label>
                    <input type="text" className="form-control" value={name} onChange={e=>setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">شريط مميز (Badge)</label>
                    <input type="text" className="form-control" value={badge} onChange={e=>setBadge(e.target.value)} placeholder="مثال: الأكثر مبيعاً" />
                </div>
                <div className="form-group">
                    <label className="form-label">الأسعار والأحجام</label>
                    <div id="pSizePriceRows">
                      {sizes.map((s, idx) => (
                        <div className="size-price-row" key={idx}>
                          <input type="text" className="sp-size" value={s.size} onChange={e=>handleSizeChange(idx, 'size', e.target.value)} placeholder="الحجم (مثال: 30ml)" />
                          <input type="number" className="sp-price" value={s.price} onChange={e=>handleSizeChange(idx, 'price', e.target.value)} placeholder="السعر (ج.م)" />
                          <button className="btn btn-icon btn-danger btn-sm" onClick={() => handleRemoveSize(idx)}><i className="fa-solid fa-xmark"></i></button>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" style={{marginTop: '12px'}} onClick={handleAddSize}><i className="fa-solid fa-plus"></i> إضافة حجم آخر</button>
                </div>
            </div>
            <div className="editor-sidebar">
                <div className="form-group">
                    <label className="form-label">التصنيف</label>
                    <select className="form-control" value={category} onChange={e=>setCategory(e.target.value)}>
                        <option value="">بدون تصنيف</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">الصور</label>
                    <div className="image-uploader">
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} id="productImgUpload" />
                        <button className="btn btn-secondary" style={{width: '100%'}} onClick={() => document.getElementById('productImgUpload').click()}>
                            <i className="fa-solid fa-cloud-arrow-up"></i> رفع صور
                        </button>
                    </div>
                    <div className="images-list" style={{marginTop: '16px'}}>
                        {images.map((img, idx) => (
                            <div className="image-item" key={idx}>
                                <div className="image-preview-wrap">
                                    <img src={img.src} alt="" />
                                    <button className="image-remove-btn" onClick={() => handleRemoveImage(idx)}><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section active">
      <div className="toolbar">
          <span className="toolbar-title">{products.length} منتج</span>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <i className="fa-solid fa-plus"></i> إضافة منتج
          </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
            <div className="empty-icon"><i className="fa-solid fa-box-open"></i></div>
            <p className="empty-text">لم تقم بإضافة أي منتجات بعد</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>إضافة أول منتج</button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(p => (
            <div className="item-card" key={p._id}>
                <div className="item-card-image">
                    <img src={p.images?.[0]?.src?.startsWith('http') || p.images?.[0]?.src?.startsWith('/') ? p.images[0].src : `/${p.images?.[0]?.src || 'فخم.jfif'}`} alt={p.name} />
                    {p.badge && <span className="item-card-badge">{p.badge}</span>}
                </div>
                <div className="item-card-body">
                    <h3 className="item-card-name">{p.name}</h3>
                    <div className="item-card-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => handleOpenModal(p)}><i className="fa-solid fa-pen-to-square"></i> تعديل</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
