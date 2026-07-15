import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState({});
  const [settings, setSettings] = useState({});

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [phone, setPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
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
        setHero(heroRes.data);
        setSettings(setRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
    setPhone('');
    setOrderSuccess(false);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleOrder = () => {
    if (!phone) {
      alert('الرجاء إدخال رقم الهاتف');
      return;
    }
    setOrderSuccess(true);
    // Integrate with WhatsApp API or backend order API here
    setTimeout(() => {
        const message = `طلب جديد: ${selectedProduct?.name} - الحجم: ${selectedSize?.size || 'عادي'} - السعر: ${selectedSize?.price || 0} ج.م - رقم الهاتف: ${phone}`;
        const whatsappNumber = settings.whatsapp || '201555590004';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        closeProductModal();
    }, 1500);
  };

  return (
    <>
      <header className="site-header" id="siteHeader">
          <div className="header-inner">
              <a href="#" className="header-logo">
                  <img src="/فخم.jfif" alt="فخم" />
                  <span className="header-logo-text">فخم</span>
              </a>
              <nav className="header-nav">
                  <a href="#hero" className="nav-link active">الرئيسية</a>
                  <a href="#products" className="nav-link">العطور</a>
                  <a href="#services" className="nav-link">خدماتنا</a>
                  <a href="#footer" className="nav-link">تواصل معنا</a>
              </nav>
              <div>
                  <button className="header-search-btn" aria-label="بحث" onClick={() => setIsSearchOpen(true)}>
                      <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                  <button className="mobile-menu-btn" aria-label="القائمة" onClick={() => setIsMobileNavOpen(true)}>
                      <i className="fa-solid fa-bars"></i>
                  </button>
              </div>
          </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div className="mobile-nav-overlay active" onClick={() => setIsMobileNavOpen(false)}></div>
      )}
      <div className={`mobile-nav ${isMobileNavOpen ? 'active' : ''}`} id="mobileNav">
          <button className="mobile-nav-close" onClick={() => setIsMobileNavOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          <a href="#hero" onClick={() => setIsMobileNavOpen(false)}>الرئيسية</a>
          <a href="#products" onClick={() => setIsMobileNavOpen(false)}>العطور</a>
          <a href="#services" onClick={() => setIsMobileNavOpen(false)}>خدماتنا</a>
          <a href="#footer" onClick={() => setIsMobileNavOpen(false)}>تواصل معنا</a>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay active" id="searchOverlay">
            <button className="search-close" onClick={() => setIsSearchOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            <div className="search-container">
                <div className="search-input-wrapper">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" className="search-input" placeholder="ابحث عن عطرك المفضل..." autoComplete="off" />
                </div>
            </div>
        </div>
      )}

      <section className="hero" id="hero">
          <div className="hero-content">
              <div className="hero-showcase">
                  <div className="hero-circle sm"><img src="/WhatsApp Image 2026-07-13 at 4.05.02 PM.jpeg" alt="لا يسبب الحساسية" /></div>
                  <div className="hero-circle md"><img src="/WhatsApp Image 2026-07-13 at 422.05.03 PM.jpeg" alt="ضمان مدى الحياة" /></div>
                  <div className="hero-logo-frame">
                      <img src="/فخم.png" alt="فخم - عطور فاخرة" className="hero-logo" />
                  </div>
                  <div className="hero-circle md"><img src="/WhatsApp Image 2026-07-13 at12 4.05.02 PM.jpeg" alt="أعلى تركيز ثبات قوي" /></div>
                  <div className="hero-circle sm"><img src="/WhatsApp Image 2026-4407-13 at 4.05.03 PM.jpeg" alt="إرجاع مجاني" /></div>
              </div>

              <div className="hero-badge"><i className="fa-solid fa-gem"></i> {hero.badge || 'المجموعة الحصرية'}</div>
              <h1 className="hero-title">{hero.title || 'عطور فاخرة بجودة استثنائية'}</h1>
              <p className="hero-subtitle">{hero.subtitle || 'اكتشف مجموعتنا الحصرية من أرقى العطور الرجالية المصنوعة بأفضل المكونات وأعلى تركيز لثبات يدوم طوال اليوم'}</p>
              <a href="#products" className="hero-cta">
                  {hero.ctaText || 'تصفح المجموعة'}
                  <i className="fa-solid fa-arrow-down"></i>
              </a>
          </div>
      </section>

      <section className="products-section" id="products">
          <div className="section-title-wrapper animate-in">
              <div className="section-divider"></div>
          </div>
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', padding: '0 5%' }}>
              {products.map(product => (
                  <div key={product._id} className="product-card" onClick={() => openProductModal(product)} style={{ cursor: 'pointer', background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                      <div style={{ position: 'relative' }}>
                          <img src={product.images?.[0]?.src || '/فخم.jfif'} alt={product.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                          {product.badge && <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'gold', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{product.badge}</span>}
                      </div>
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                          <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{product.name}</h3>
                          <p style={{ margin: '0 0 15px 0', color: '#666' }}>{product.category || 'بدون تصنيف'}</p>
                          <p style={{ fontWeight: 'bold', color: '#333' }}>يبدأ من {product.sizes?.[0]?.price || 0} ج.م</p>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      <section className="services-section" id="services">
          <div className="section-title-wrapper animate-in">
              <span className="section-tag">خدمات مميزة</span>
              <h2 className="section-title">خدماتنا الخاصة</h2>
              <p className="section-subtitle">نقدم لك خدمات حصرية لتجربة عطرية فريدة من نوعها</p>
              <div className="section-divider"></div>
          </div>
          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', padding: '0 5%' }}>
              {services.map(service => (
                  <div key={service._id} className="service-card" style={{ background: '#fff', padding: '30px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                      <i className={`fa-solid ${service.icon || 'fa-star'}`} style={{ fontSize: '40px', color: 'gold', marginBottom: '20px' }}></i>
                      <h3>{service.name}</h3>
                      <p style={{ color: '#666', lineHeight: '1.6' }}>{service.desc}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="modal-overlay active" style={{ display: 'flex' }} onClick={(e) => { if (e.target.className.includes('modal-overlay')) closeProductModal() }}>
            <div className="modal-container" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <button className="modal-close" aria-label="إغلاق" onClick={closeProductModal}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="modal-image-section">
                    <img src={selectedProduct.images?.[0]?.src || '/فخم.jfif'} className="modal-main-image" alt={selectedProduct.name} />
                </div>

                <div className="modal-info-section">
                    <h2 className="modal-product-name">{selectedProduct.name}</h2>
                    <p className="modal-product-tagline">{selectedProduct.category || 'عطر فاخر بجودة استثنائية من فخم'}</p>

                    <div id="sizeOptions">
                        <p className="modal-size-label">اختر الحجم</p>
                        <div className="modal-size-options" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {selectedProduct.sizes?.map((size, index) => (
                                <button 
                                    key={index} 
                                    className={`btn ${selectedSize?.size === size.size ? 'btn-primary' : 'btn-secondary'}`} 
                                    style={{ padding: '8px 15px', borderRadius: '20px' }}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size.size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="modal-price-wrapper">
                        <p className="modal-price-label">السعر</p>
                        <p className="modal-price">{selectedSize?.price || 0} <span className="currency">ج.م</span></p>
                    </div>

                    <div className="modal-phone-wrapper">
                        <i className="fa-solid fa-phone modal-phone-icon"></i>
                        <input type="tel" className="modal-phone" placeholder="رقم الهاتف للتواصل" maxLength="11" 
                          value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <button className="modal-order-btn" onClick={handleOrder} style={{ width: '100%', marginTop: '15px' }}>
                        <i className="fa-brands fa-whatsapp"></i>
                        تأكيد الأوردر عبر واتساب
                    </button>

                    {orderSuccess && (
                      <div className="modal-success" style={{ display: 'block', marginTop: '15px', color: 'green', background: '#eaffea', padding: '10px', borderRadius: '5px' }}>
                          <i className="fa-solid fa-circle-check"></i>
                          تم تأكيد الأوردر بنجاح! سيتم التواصل معك خلال 24 ساعة
                      </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <section className="social-accounts-section animate-in">
          <span className="section-tag">تابعنا</span>
          <h2 className="section-title">حساباتنا</h2>
          <p className="section-subtitle">تابعنا على منصات التواصل الاجتماعي</p>
          <div className="section-divider"></div>
          <div className="social-accounts-icons">
              <a href={`https://wa.me/${settings.whatsapp || '201555590004'}`} target="_blank" rel="noreferrer" className="whatsapp-icon" aria-label="واتساب"><i className="fa-brands fa-whatsapp"></i></a>
              <a href={settings.instagram || '#'} target="_blank" rel="noreferrer" className="instagram-icon" aria-label="انستغرام"><i className="fa-brands fa-instagram"></i></a>
              <a href={settings.facebook || '#'} target="_blank" rel="noreferrer" className="facebook-icon" aria-label="فيسبوك"><i className="fa-brands fa-facebook-f"></i></a>
          </div>
      </section>

      <footer className="site-footer" id="footer">
          <div className="footer-inner">
              <div className="footer-brand">
                  <div className="footer-brand-logo">
                      <img src="/فخم.jfif" alt="فخم" />
                      <span>فخم</span>
                  </div>
                  <p className="footer-brand-desc">{settings.footerText || 'متجر متخصص في العطور الفاخرة الرجالية. نقدم لك أرقى العطور العالمية بأفضل جودة وثبات وبأسعار تنافسية مع التوصيل لجميع المحافظات.'}</p>
              </div>

              <div className="footer-section">
                  <h3>روابط سريعة</h3>
                  <ul className="footer-links">
                      <li><a href="#hero"><i className="fa-solid fa-angle-left"></i> الرئيسية</a></li>
                      <li><a href="#products"><i className="fa-solid fa-angle-left"></i> العطور</a></li>
                      <li><a href="#services"><i className="fa-solid fa-angle-left"></i> خدماتنا</a></li>
                  </ul>
              </div>

              <div className="footer-section">
                  <h3>تواصل معنا</h3>
                  <div className="footer-contact-item">
                      <i className="fa-brands fa-whatsapp"></i>
                      <a href={`https://wa.me/${settings.whatsapp || '201555590004'}`} target="_blank" rel="noreferrer">{settings.whatsapp || '01555590004'}</a>
                  </div>
                  <div className="footer-contact-item">
                      <i className="fa-solid fa-clock"></i>
                      <span>متاح 24 ساعة</span>
                  </div>
                  <div className="footer-contact-item">
                      <i className="fa-solid fa-truck-fast"></i>
                      <span>توصيل لجميع المحافظات</span>
                  </div>
              </div>
          </div>

          <div className="footer-bottom">
              <p className="footer-copyright">{settings.copyrightText || '© 2025 فخم - جميع الحقوق محفوظة'}</p>
          </div>
      </footer>

      <a href={`https://wa.me/${settings.whatsapp || '201555590004'}`} target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="تواصل عبر واتساب">
          <i className="fa-brands fa-whatsapp"></i>
      </a>

      <button className="scroll-top" id="scrollTopBtn" aria-label="العودة للأعلى" onClick={() => window.scrollTo(0,0)}>
          <i className="fa-solid fa-arrow-up"></i>
      </button>
    </>
  );
}
