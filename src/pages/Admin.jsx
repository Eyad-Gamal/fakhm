import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [promocodes, setPromocodes] = useState([]);
  const [hero, setHero] = useState({ badge:{ar:'', en:''}, title:{ar:'', en:''}, subtitle:{ar:'', en:''}, ctaText:{ar:'', en:''}, circles:Array(5).fill({src:'', alt:''}) });
  const [settings, setSettings] = useState({ whatsapp:'', instagram:'', facebook:'', footerText:{ar:'', en:''}, copyrightText:{ar:'', en:''} });
  
  const [formType, setFormType] = useState(''); // 'product', 'category', 'service', 'promocode'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await axios.post('/api/upload', { image: reader.result });
        callback(res.data.url);
      } catch (err) {
        alert(err.response?.data?.message || 'خطأ في رفع الصورة');
      } finally {
        setUploading(false);
      }
    };
  };

  const fetchData = async () => {
    try {
      const [prodRes, catRes, servRes, promoRes, heroRes, setRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories'),
        axios.get('/api/services'),
        axios.get('/api/promocodes'),
        axios.get('/api/hero'),
        axios.get('/api/settings')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setServices(servRes.data);
      setPromocodes(promoRes.data);
      if(heroRes.data && Object.keys(heroRes.data).length > 0) {
        let h = heroRes.data;
        if(!h.circles || h.circles.length < 5) h.circles = Array(5).fill({src:'', alt:''});
        setHero(h);
      }
      if(setRes.data && Object.keys(setRes.data).length > 0) setSettings(setRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (type, data = null) => {
    setFormType(type);
    if (data) {
      setFormData(data);
    } else {
      // Default empty forms
      if (type === 'product') setFormData({ name: {ar:'', en:''}, category: '', sizes: [{size:'', price:0}] });
      if (type === 'category') setFormData({ name: {ar:'', en:''} });
      if (type === 'service') setFormData({ name: {ar:'', en:''}, desc: {ar:'', en:''}, icon: 'fa-star' });
      if (type === 'promocode') setFormData({ code: '', type: 'percentage', value: 0, minOrderValue: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let endpoint = `/api/${formType}s`;
      if (formType === 'category') endpoint = '/api/categories';
      
      if (formData._id) {
        await axios.put(`${endpoint}/${formData._id}`, formData);
      } else {
        await axios.post(endpoint, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving data');
    }
  };

  const handleDelete = async (type, id) => {
    if(!window.confirm('متأكد من الحذف؟')) return;
    try {
      let endpoint = `/api/${type}s`;
      if (type === 'category') endpoint = '/api/categories';
      await axios.delete(`${endpoint}/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting data');
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/hero', hero);
      alert('تم حفظ القسم الرئيسي بنجاح');
    } catch (err) { alert('خطأ في الحفظ'); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/settings', settings);
      alert('تم حفظ الإعدادات بنجاح');
    } catch (err) { alert('خطأ في الحفظ'); }
  };

  const handleHeroCircleChange = (idx, field, value) => {
    const newCircles = [...hero.circles];
    newCircles[idx] = { ...newCircles[idx], [field]: value };
    setHero({ ...hero, circles: newCircles });
  };

  const tabs = [
    { id: 'products', label: 'المنتجات', icon: 'fa-box-open' },
    { id: 'categories', label: 'التصنيفات', icon: 'fa-tags' },
    { id: 'services', label: 'الخدمات', icon: 'fa-concierge-bell' },
    { id: 'promocodes', label: 'أكواد الخصم', icon: 'fa-ticket' },
    { id: 'hero', label: 'القسم الرئيسي', icon: 'fa-image' },
    { id: 'settings', label: 'الإعدادات', icon: 'fa-gear' }
  ];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <a href="/" className="sidebar-brand">
            <img src="/فخم.jfif" alt="فخم" />
            <div>
                <span className="sidebar-brand-text">فخم</span>
                <small>لوحة التحكم</small>
            </div>
        </a>
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
            <a href="/" target="_blank" rel="noreferrer"><i className="fa-solid fa-external-link"></i> عرض الموقع</a>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 id="pageTitle"><i className={`fa-solid ${tabs.find(t=>t.id===activeTab)?.icon}`}></i> {tabs.find(t=>t.id===activeTab)?.label}</h1>
        </div>

        <div className="main-body">
          <div className="page-section active">
            
            {/* Toolbar for list tabs */}
            {['products', 'categories', 'services', 'promocodes'].includes(activeTab) && (
              <div className="toolbar">
                <span className="toolbar-title" id="productsCount">إجمالي {activeTab}: {
                  activeTab === 'products' ? products.length :
                  activeTab === 'categories' ? categories.length :
                  activeTab === 'services' ? services.length : promocodes.length
                }</span>
                <button className="btn btn-primary" onClick={() => openForm(activeTab.slice(0, -1).replace('categorie', 'category'))}>
                    <i className="fa-solid fa-plus"></i> إضافة جديد
                </button>
              </div>
            )}
            
            {activeTab === 'products' && (
              <table>
                <thead><tr><th>الاسم (AR)</th><th>التصنيف</th><th>أقل سعر</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>{p.name.ar}</td>
                      <td>{p.category}</td>
                      <td>{p.sizes?.[0]?.price}</td>
                      <td>
                        <button className="btn btn-outline" style={{padding:'5px 10px', fontSize:'0.8rem', marginRight:'5px'}} onClick={() => openForm('product', p)}>تعديل</button>
                        <button className="btn btn-outline" style={{padding:'5px 10px', fontSize:'0.8rem', color:'var(--danger)', borderColor:'var(--danger)'}} onClick={() => handleDelete('product', p._id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'promocodes' && (
              <table>
                <thead><tr><th>الكود</th><th>النوع</th><th>القيمة</th><th>مرات الاستخدام</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {promocodes.map(p => (
                    <tr key={p._id}>
                      <td style={{fontWeight:'bold', color:'var(--primary)'}}>{p.code}</td>
                      <td>{p.type === 'percentage' ? 'نسبة %' : 'مبلغ ثابت'}</td>
                      <td>{p.value}</td>
                      <td>{p.currentUses} {p.maxUses ? `/ ${p.maxUses}` : '(غير محدود)'}</td>
                      <td>
                        <button className="btn btn-outline" style={{padding:'5px 10px', fontSize:'0.8rem', color:'var(--danger)', borderColor:'var(--danger)'}} onClick={() => handleDelete('promocode', p._id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'categories' && (
              <table>
                <thead><tr><th>الاسم (AR)</th><th>الاسم (EN)</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c._id}>
                      <td>{c.name.ar}</td>
                      <td>{c.name.en}</td>
                      <td>
                        <button className="btn btn-outline" style={{padding:'5px 10px', fontSize:'0.8rem', color:'var(--danger)', borderColor:'var(--danger)'}} onClick={() => handleDelete('category', c._id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'services' && (
              <table>
                <thead><tr><th>الأيقونة</th><th>الاسم (AR)</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s._id}>
                      <td><i className={`fa-solid ${s.icon}`}></i></td>
                      <td>{s.name.ar}</td>
                      <td>
                        <button className="btn btn-outline" style={{padding:'5px 10px', fontSize:'0.8rem', color:'var(--danger)', borderColor:'var(--danger)'}} onClick={() => handleDelete('service', s._id)}>حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* HERO SECTION TAB */}
            {activeTab === 'hero' && (
              <form onSubmit={handleSaveHero} className="form-panel" style={{maxWidth:'800px', margin:'0 auto'}}>
                <h3 className="form-panel-title">النصوص</h3>
                <div className="form-group"><label className="form-label">الشارة (Badge) بالعربية</label>
                  <input className="form-input" value={hero.badge?.ar || ''} onChange={e => setHero({...hero, badge:{...hero.badge, ar: e.target.value}})} /></div>
                <div className="form-group"><label className="form-label">الشارة (Badge) بالإنجليزية</label>
                  <input className="form-input" value={hero.badge?.en || ''} onChange={e => setHero({...hero, badge:{...hero.badge, en: e.target.value}})} /></div>
                
                <div className="form-group"><label className="form-label">العنوان بالعربية</label>
                  <input className="form-input" value={hero.title?.ar || ''} onChange={e => setHero({...hero, title:{...hero.title, ar: e.target.value}})} /></div>
                <div className="form-group"><label className="form-label">العنوان بالإنجليزية</label>
                  <input className="form-input" value={hero.title?.en || ''} onChange={e => setHero({...hero, title:{...hero.title, en: e.target.value}})} /></div>
                
                <div className="form-group"><label className="form-label">الوصف بالعربية</label>
                  <textarea className="form-input" value={hero.subtitle?.ar || ''} onChange={e => setHero({...hero, subtitle:{...hero.subtitle, ar: e.target.value}})}></textarea></div>
                <div className="form-group"><label className="form-label">الوصف بالإنجليزية</label>
                  <textarea className="form-input" value={hero.subtitle?.en || ''} onChange={e => setHero({...hero, subtitle:{...hero.subtitle, en: e.target.value}})}></textarea></div>
                
                <div className="form-group"><label className="form-label">نص الزر بالعربية</label>
                  <input className="form-input" value={hero.ctaText?.ar || ''} onChange={e => setHero({...hero, ctaText:{...hero.ctaText, ar: e.target.value}})} /></div>
                <div className="form-group"><label className="form-label">نص الزر بالإنجليزية</label>
                  <input className="form-input" value={hero.ctaText?.en || ''} onChange={e => setHero({...hero, ctaText:{...hero.ctaText, en: e.target.value}})} /></div>

                <h3 className="form-panel-title" style={{marginTop:'30px'}}>الصور (الدوائر في الرئيسية)</h3>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'15px', padding:'10px', border:'1px solid var(--border-subtle)', borderRadius:'10px'}}>
                    <div style={{flex:1, minWidth:'200px'}}>
                      <label className="form-label">{i === 2 ? 'اللوجو في المنتصف' : `صورة ${i+1}`}</label>
                      <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        {hero.circles?.[i]?.src && <img src={hero.circles[i].src} alt="preview" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'8px'}} />}
                        <input type="file" accept="image/*" className="form-input" style={{padding:'8px'}} onChange={(e) => handleFileUpload(e, (url) => handleHeroCircleChange(i, 'src', url))} />
                      </div>
                    </div>
                    <div style={{flex:1, minWidth:'200px'}}>
                      <label className="form-label">النص البديل (Alt)</label>
                      <input className="form-input" placeholder="نص توضيحي" value={hero.circles?.[i]?.alt || ''} onChange={e => handleHeroCircleChange(i, 'alt', e.target.value)} />
                    </div>
                  </div>
                ))}

                <button type="submit" className="btn btn-primary" style={{marginTop:'20px'}} disabled={uploading}>
                  {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>} {uploading ? 'جاري الرفع...' : 'حفظ التغييرات'}
                </button>
              </form>
            )}

            {/* SETTINGS SECTION TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="form-panel" style={{maxWidth:'800px', margin:'0 auto'}}>
                <h3 className="form-panel-title">التواصل الاجتماعي</h3>
                <div className="form-group">
                  <label className="form-label">رقم الواتساب (لطلبات الأوردر وزر الواتساب)</label>
                  <input className="form-input" placeholder="مثال: 201555590004" required value={settings.whatsapp || ''} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                  <small style={{color:'var(--text-muted)'}}>ملاحظة: يجب كتابة الرقم مع كود الدولة وبدون علامة + أو أصفار (مثال: 201555590004)</small>
                </div>
                <div className="form-group">
                  <label className="form-label">رابط انستغرام</label>
                  <input className="form-input" placeholder="https://instagram.com/..." value={settings.instagram || ''} onChange={e => setSettings({...settings, instagram: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">رابط فيسبوك</label>
                  <input className="form-input" placeholder="https://facebook.com/..." value={settings.facebook || ''} onChange={e => setSettings({...settings, facebook: e.target.value})} />
                </div>

                <h3 className="form-panel-title" style={{marginTop:'30px'}}>نصوص الفوتر</h3>
                <div className="form-group">
                  <label className="form-label">وصف المتجر (بالعربية)</label>
                  <textarea className="form-input" value={settings.footerText?.ar || ''} onChange={e => setSettings({...settings, footerText:{...settings.footerText, ar: e.target.value}})}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">وصف المتجر (بالإنجليزية)</label>
                  <textarea className="form-input" value={settings.footerText?.en || ''} onChange={e => setSettings({...settings, footerText:{...settings.footerText, en: e.target.value}})}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">حقوق النشر (بالعربية)</label>
                  <input className="form-input" value={settings.copyrightText?.ar || ''} onChange={e => setSettings({...settings, copyrightText:{...settings.copyrightText, ar: e.target.value}})} />
                </div>
                <div className="form-group">
                  <label className="form-label">حقوق النشر (بالإنجليزية)</label>
                  <input className="form-input" value={settings.copyrightText?.en || ''} onChange={e => setSettings({...settings, copyrightText:{...settings.copyrightText, en: e.target.value}})} />
                </div>

                <button type="submit" className="btn btn-primary" style={{marginTop:'20px'}}><i className="fa-solid fa-floppy-disk"></i> حفظ الإعدادات</button>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Editor Modal for List Entities */}
      {isModalOpen && (
        <div className="modal-overlay active" style={{display:'flex', alignItems:'center', justifyContent:'center', zIndex: 1000}}>
          <div className="form-panel" style={{width:'90%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', background:'var(--bg-card)', padding:'30px', borderRadius:'var(--radius-xl)', position:'relative', border:'1px solid var(--border-gold)'}}>
            <button className="modal-close" style={{position:'absolute', top:'15px', left:'15px', background:'transparent', border:'none', color:'var(--text-primary)', fontSize:'1.2rem', cursor:'pointer'}} type="button" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            
            <form onSubmit={handleSave}>
              <h2 style={{color:'var(--gold)', marginBottom:'20px'}}>
                {formData._id ? 'تعديل' : 'إضافة'}
              </h2>
  
              {['category', 'product', 'service'].includes(formType) && (
                <>
                  <div className="form-group">
                    <label className="form-label">الاسم بالعربية</label>
                    <input className="form-input" required value={formData.name?.ar || ''} onChange={e => setFormData({...formData, name: {...formData.name, ar: e.target.value}})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الاسم بالإنجليزية</label>
                    <input className="form-input" required value={formData.name?.en || ''} onChange={e => setFormData({...formData, name: {...formData.name, en: e.target.value}})} />
                  </div>
                </>
              )}
  
              {formType === 'product' && (
                <>
                  <div className="form-group">
                    <label className="form-label">التصنيف</label>
                    <select className="form-select" required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="">اختر تصنيف...</option>
                      {categories.map(c => <option key={c._id} value={c.name.ar}>{c.name.ar}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">الشارة (Badge)</label>
                    <input className="form-input" placeholder="مثال: الأكثر مبيعاً" value={formData.badge?.ar || ''} onChange={e => setFormData({...formData, badge: {ar: e.target.value, en: e.target.value}})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">صور المنتج (حتى 4 صور)</label>
                    <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} style={{border:'1px dashed var(--border-gold)', padding:'5px', borderRadius:'8px', width:'80px', height:'80px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative'}}>
                           {formData.images?.[i]?.src ? (
                             <>
                               <img src={formData.images[i].src} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'4px'}} alt="" />
                               <button type="button" onClick={() => {
                                 const newImages = [...(formData.images || [])];
                                 newImages.splice(i, 1);
                                 setFormData({...formData, images: newImages});
                               }} style={{position:'absolute', top:'-5px', right:'-5px', background:'red', color:'white', border:'none', borderRadius:'50%', width:'20px', height:'20px', cursor:'pointer', fontSize:'10px'}}>x</button>
                             </>
                           ) : (
                             <>
                               <i className="fa-solid fa-cloud-arrow-up" style={{fontSize:'20px', color:'var(--gold)'}}></i>
                               <input type="file" accept="image/*" style={{opacity:0, position:'absolute', inset:0, cursor:'pointer'}} onChange={(e) => handleFileUpload(e, (url) => {
                                 const newImages = [...(formData.images || [])];
                                 newImages[i] = {src: url};
                                 setFormData({...formData, images: newImages});
                               })} />
                             </>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h4 style={{marginTop:'15px', marginBottom:'10px', color:'var(--gold)'}}>الأحجام والأسعار</h4>
                  {formData.sizes?.map((size, idx) => (
                    <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                      <input className="form-input" placeholder="الحجم (مثال: 50ml)" value={size.size} onChange={e => {
                        const newSizes = [...formData.sizes];
                        newSizes[idx].size = e.target.value;
                        setFormData({...formData, sizes: newSizes});
                      }} />
                      <input className="form-input" type="number" placeholder="السعر" value={size.price} onChange={e => {
                        const newSizes = [...formData.sizes];
                        newSizes[idx].price = Number(e.target.value);
                        setFormData({...formData, sizes: newSizes});
                      }} />
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFormData({...formData, sizes: [...formData.sizes, {size:'', price:0}]})}>+ إضافة حجم</button>
                </>
              )}
  
              {formType === 'service' && (
                <>
                  <div className="form-group">
                    <label className="form-label">الأيقونة (FontAwesome class)</label>
                    <input className="form-input" required value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الوصف بالعربية</label>
                    <textarea className="form-input" required value={formData.desc?.ar || ''} onChange={e => setFormData({...formData, desc: {...formData.desc, ar: e.target.value}})}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">الوصف بالإنجليزية</label>
                    <textarea className="form-input" required value={formData.desc?.en || ''} onChange={e => setFormData({...formData, desc: {...formData.desc, en: e.target.value}})}></textarea>
                  </div>
                </>
              )}
  
              {formType === 'promocode' && (
                <>
                  <div className="form-group">
                    <label className="form-label">كود الخصم</label>
                    <input className="form-input" required value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">نوع الخصم</label>
                    <select className="form-select" value={formData.type || 'percentage'} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">القيمة</label>
                    <input className="form-input" type="number" required value={formData.value || 0} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                  </div>
                </>
              )}
  
              <div style={{marginTop:'30px'}}>
                <button type="submit" className="btn btn-primary" style={{marginRight:'10px'}} disabled={uploading}>
                  {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'حفظ'} {uploading && '...'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
