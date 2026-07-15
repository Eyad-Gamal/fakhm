import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../admin.css';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState({ circles: [], title: '', subtitle: '', badge: '', ctaText: '' });
  const [settings, setSettings] = useState({ whatsapp: '', instagram: '', facebook: '', footerText: '', copyrightText: '', premiumThreshold: 0 });

  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Product Editor State
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [productForm, setProductForm] = useState({ name: '', category: '', badge: '', sizes: [{ size: '', price: '' }], images: [] });

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  // Service Editor State
  const [serviceEditorOpen, setServiceEditorOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', desc: '', icon: '', images: [] });

  const fetchData = async () => {
    try {
      const [prodRes, catRes, servRes, heroRes, setRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories'),
        axios.get('/api/services'),
        axios.get('/api/hero'),
        axios.get('/api/settings')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setServices(servRes.data);
      if (heroRes.data) setHero(heroRes.data);
      if (setRes.data) setSettings(setRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = async () => {
    try {
      await axios.post('/api/categories', categoryForm);
      setCategoryModalOpen(false);
      setCategoryForm({ name: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to save category', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        fetchData();
      } catch (err) {
        console.error('Failed to delete category', err);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchData();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await axios.put('/api/settings', settings);
      alert('تم حفظ الإعدادات بنجاح');
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  };

  const navItems = [
    { id: 'dashboard', icon: 'fa-gauge-high', label: 'نظرة عامة' },
    { id: 'products', icon: 'fa-box-open', label: 'المنتجات' },
    { id: 'categories', icon: 'fa-tags', label: 'التصنيفات' },
    { id: 'hero', icon: 'fa-image', label: 'القسم الرئيسي' },
    { id: 'services', icon: 'fa-concierge-bell', label: 'الخدمات' },
    { id: 'settings', icon: 'fa-gear', label: 'الإعدادات' },
    { id: 'backup', icon: 'fa-database', label: 'النسخ الاحتياطي' }
  ];

  return (
    <>
      <button className="mobile-toggle"><i className="fa-solid fa-bars"></i></button>

      <div className="admin-layout">
        <aside className="sidebar" id="sidebar">
          <a href="/" className="sidebar-brand">
            <img src="/فخم.jfif" alt="فخم" />
            <div>
              <span className="sidebar-brand-text">فخم</span>
              <small>لوحة التحكم</small>
            </div>
          </a>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <button 
                key={item.id}
                className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => { setActiveSection(item.id); setProductEditorOpen(false); setServiceEditorOpen(false); }}
              >
                <i className={`fa-solid ${item.icon}`}></i> {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <a href="/" target="_blank" rel="noreferrer"><i className="fa-solid fa-external-link"></i> عرض الموقع</a>
          </div>
        </aside>

        <div className="main-content">
          <div className="main-header">
            <h1 id="pageTitle">
              <i className={`fa-solid ${navItems.find(i => i.id === activeSection)?.icon}`}></i> {navItems.find(i => i.id === activeSection)?.label}
            </h1>
          </div>

          <div className="main-body">
            
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div className="page-section active">
                <div className="stats-grid">
                  <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
                    <h3 style={{ margin: 0, color: '#888' }}>المنتجات</h3>
                    <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{products.length}</p>
                  </div>
                  <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
                    <h3 style={{ margin: 0, color: '#888' }}>التصنيفات</h3>
                    <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{categories.length}</p>
                  </div>
                  <div className="stat-card" style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
                    <h3 style={{ margin: 0, color: '#888' }}>الخدمات</h3>
                    <p style={{ margin: '10px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>{services.length}</p>
                  </div>
                </div>
                <div className="toolbar" style={{ marginTop: '20px' }}>
                  <span className="toolbar-title">إجراءات سريعة</span>
                </div>
                <div className="quick-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="btn btn-primary" onClick={() => { setActiveSection('products'); setProductEditorOpen(true); }}>
                    <i className="fa-solid fa-plus"></i> إضافة منتج
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveSection('categories')}>
                    <i className="fa-solid fa-tags"></i> إدارة التصنيفات
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveSection('settings')}>
                    <i className="fa-solid fa-gear"></i> الإعدادات
                  </button>
                </div>
              </div>
            )}

            {/* Products Section */}
            {activeSection === 'products' && (
              <div className="page-section active">
                {!productEditorOpen ? (
                  <div id="productsListView">
                    <div className="toolbar">
                      <span className="toolbar-title">إجمالي المنتجات: {products.length}</span>
                      <button className="btn btn-primary" onClick={() => setProductEditorOpen(true)}>
                        <i className="fa-solid fa-plus"></i> إضافة منتج
                      </button>
                    </div>
                    
                    {products.length === 0 ? (
                      <div className="empty-state">
                        <i className="fa-solid fa-box-open"></i>
                        <p>لا توجد منتجات بعد</p>
                        <button className="btn btn-primary" onClick={() => setProductEditorOpen(true)}>
                          <i className="fa-solid fa-plus"></i> إضافة أول منتج
                        </button>
                      </div>
                    ) : (
                      <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {products.map(product => (
                          <div className="item-card" key={product._id} style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <img src={product.images?.[0]?.src || '/فخم.jfif'} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                            <div style={{ padding: '15px' }}>
                              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{product.name}</h3>
                              <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>{product.category || 'بدون تصنيف'}</p>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-sm btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteProduct(product._id)}><i className="fa-solid fa-trash"></i> حذف</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="editor-panel active" style={{ display: 'block' }}>
                    <div className="editor-header">
                      <button className="editor-back-btn" onClick={() => setProductEditorOpen(false)}>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                      <h2 className="editor-title">إضافة منتج جديد</h2>
                    </div>

                    <div className="form-panel">
                      <h3 className="form-panel-title"><i className="fa-solid fa-info-circle"></i> المعلومات الأساسية</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">اسم المنتج *</label>
                          <input type="text" className="form-input" placeholder="مثال: سوفاج" 
                            value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">التصنيف</label>
                          <select className="form-select" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            <option value="">بدون تصنيف</option>
                            {categories.map(cat => (
                              <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button className="btn btn-primary"><i className="fa-solid fa-floppy-disk"></i> حفظ المنتج</button>
                      <button className="btn btn-secondary" onClick={() => setProductEditorOpen(false)}>إلغاء</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Categories Section */}
            {activeSection === 'categories' && (
              <div className="page-section active">
                <div className="toolbar">
                  <span className="toolbar-title">إجمالي التصنيفات: {categories.length}</span>
                  <button className="btn btn-primary" onClick={() => setCategoryModalOpen(true)}>
                    <i className="fa-solid fa-plus"></i> إضافة تصنيف
                  </button>
                </div>
                
                {categories.length === 0 ? (
                  <div className="empty-state">
                    <i className="fa-solid fa-tags"></i>
                    <p>لا توجد تصنيفات بعد</p>
                    <button className="btn btn-primary" onClick={() => setCategoryModalOpen(true)}>
                      <i className="fa-solid fa-plus"></i> إضافة تصنيف
                    </button>
                  </div>
                ) : (
                  <div className="list-items" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    {categories.map(category => (
                      <div key={category._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', border: '1px solid #eee', borderRadius: '8px' }}>
                        <span style={{ fontWeight: 'bold' }}>{category.name}</span>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCategory(category._id)}><i className="fa-solid fa-trash"></i></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="page-section active">
                <div className="form-panel">
                  <h3 className="form-panel-title"><i className="fa-brands fa-whatsapp"></i> واتساب</h3>
                  <div className="form-group">
                    <label className="form-label">رقم الواتساب (بالكود الدولي)</label>
                    <input type="text" className="form-input" placeholder="201555590004" 
                      value={settings.whatsapp || ''} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                  </div>
                </div>
                <div className="form-panel">
                  <h3 className="form-panel-title"><i className="fa-solid fa-share-nodes"></i> روابط التواصل</h3>
                  <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label className="form-label">انستغرام</label>
                    <input type="text" className="form-input" 
                      value={settings.instagram || ''} onChange={e => setSettings({...settings, instagram: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">فيسبوك</label>
                    <input type="text" className="form-input" 
                      value={settings.facebook || ''} onChange={e => setSettings({...settings, facebook: e.target.value})} />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={handleSaveSettings}>
                    <i className="fa-solid fa-floppy-disk"></i> حفظ الإعدادات
                  </button>
                </div>
              </div>
            )}

            {/* Placeholder for other sections */}
            {['hero', 'services', 'backup'].includes(activeSection) && (
              <div className="page-section active">
                <div className="empty-state">
                  <i className={`fa-solid ${navItems.find(i => i.id === activeSection)?.icon}`}></i>
                  <p>هذا القسم قيد التطوير في واجهة React</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="admin-modal-overlay active" style={{ display: 'flex' }}>
          <div className="admin-modal" style={{ background: '#fff', width: '400px', borderRadius: '10px', overflow: 'hidden' }}>
            <div className="admin-modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>إضافة تصنيف</h3>
              <button className="admin-modal-close" onClick={() => setCategoryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="admin-modal-body" style={{ padding: '20px' }}>
              <div className="form-group">
                <label className="form-label">اسم التصنيف</label>
                <input type="text" className="form-input" placeholder="مثال: عطور رجالية" 
                  value={categoryForm.name} onChange={e => setCategoryForm({ name: e.target.value })} />
              </div>
            </div>
            <div className="admin-modal-footer" style={{ padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setCategoryModalOpen(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={handleSaveCategory}>
                <i className="fa-solid fa-floppy-disk"></i> حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
