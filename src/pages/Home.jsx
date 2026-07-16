import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../index.css';
import logoImg from '../assets/فخم.png';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === 'ar';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState({});
  const [settings, setSettings] = useState({});

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [phone, setPhone] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-in');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, [products, services]);

  const changeLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || null);
    setPhone('');
    setPromoCode('');
    setDiscountInfo(null);
    setOrderSuccess(false);
  };

  const closeModal = () => setSelectedProduct(null);

  const applyPromo = async () => {
    if (!promoCode || !selectedSize) return;
    try {
      const res = await axios.post('/api/promocodes/validate', {
        code: promoCode,
        orderValue: selectedSize.price
      });
      if (res.data.valid) {
        setDiscountInfo(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error validating code');
      setDiscountInfo(null);
    }
  };

  const confirmOrder = () => {
    if (!phone) {
      alert(t('phone_placeholder'));
      return;
    }
    const finalPrice = discountInfo ? (selectedSize.price - discountInfo.discountAmount) : selectedSize.price;
    const prodName = selectedProduct.name[lang] || selectedProduct.name.ar;
    let msg = `طلب جديد: ${prodName} - الحجم: ${selectedSize.size} - السعر النهائي: ${finalPrice} ${t('currency')} - الهاتف: ${phone}`;
    if (discountInfo) msg += ` - كود الخصم: ${discountInfo.promoCode}`;
    
    const whatsappNum = settings?.whatsapp || '201555590004';
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, '_blank');
    setOrderSuccess(true);
    setTimeout(closeModal, 2000);
  };

  return (
    <>
      {/* HEADER */}
      <header className={`site-header`} id="siteHeader">
        <div className="header-inner">
            <a href="#" className="header-logo" >
                <img src={logoImg} alt="فخم" />
                <span className="header-logo-text">فخم</span>
            </a>
            <nav className="header-nav">
                <a href="#hero" className="nav-link active">{t('home')}</a>
                <a href="#products" className="nav-link">{t('perfumes')}</a>
                <a href="#services" className="nav-link">{t('services')}</a>
                <a href="#footer" className="nav-link">{t('contact')}</a>
                <button className="nav-link" onClick={changeLanguage} style={{background:'transparent', border:'none', cursor:'pointer'}}>
                  {lang === 'ar' ? 'English' : 'عربي'}
                </button>
            </nav>
            <div>
                <button className="header-search-btn" aria-label="بحث" onClick={() => setSearchOpen(true)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button className="mobile-menu-btn" aria-label="القائمة" onClick={() => setMobileMenuOpen(true)}>
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`} id="mobileNavOverlay" onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} id="mobileNav">
          <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          <a href="#hero" onClick={() => setMobileMenuOpen(false)}>{t('home')}</a>
          <a href="#products" onClick={() => setMobileMenuOpen(false)}>{t('perfumes')}</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>{t('services')}</a>
          <a href="#footer" onClick={() => setMobileMenuOpen(false)}>{t('contact')}</a>
          <button onClick={() => {changeLanguage(); setMobileMenuOpen(false);}} style={{background:'transparent', border:'none', color:'var(--text-secondary)', fontSize:'1.05rem', fontWeight:'500', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'block', width:'100%', textAlign: isRTL ? 'right' : 'left', cursor:'pointer'}}>{lang === 'ar' ? 'English' : 'عربي'}</button>
      </div>

      {/* SEARCH OVERLAY */}
      <div className={`search-overlay ${searchOpen ? 'active' : ''}`} id="searchOverlay">
          <button className="search-close" onClick={() => setSearchOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          <div className="search-container">
              <div className="search-input-wrapper">
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                  <input type="text" className="search-input" id="searchInput" placeholder="ابحث عن عطرك المفضل..."
                      autoComplete="off" />
              </div>
              <div className="search-results" id="searchResults"></div>
          </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero" id="hero">
          <div className="hero-content">
              <div className="hero-showcase">
                  <div className="hero-circle sm"><img src={hero?.circles?.[0]?.src || "/WhatsApp Image 2026-07-13 at 4.05.02 PM.jpeg"} alt={hero?.circles?.[0]?.alt || "لا يسبب الحساسية"} /></div>
                  <div className="hero-circle md"><img src={hero?.circles?.[1]?.src || "/WhatsApp Image 2026-07-13 at 422.05.03 PM.jpeg"} alt={hero?.circles?.[1]?.alt || "ضمان مدى الحياة"} /></div>
                  <div className="hero-logo-frame">
                      <img src={hero?.circles?.[2]?.src || "./src/assets/فخم.png"} alt={hero?.circles?.[2]?.alt || "فخم - عطور فاخرة"} className="hero-logo" />
                  </div>
                  <div className="hero-circle md"><img src={hero?.circles?.[3]?.src || "/WhatsApp Image 2026-07-13 at12 4.05.02 PM.jpeg"} alt={hero?.circles?.[3]?.alt || "أعلى تركيز ثبات قوي"} /></div>
                  <div className="hero-circle sm"><img src={hero?.circles?.[4]?.src || "/WhatsApp Image 2026-4407-13 at 4.05.03 PM.jpeg"} alt={hero?.circles?.[4]?.alt || "إرجاع مجاني"} /></div>
              </div>

              <div className="hero-badge"><i className="fa-solid fa-gem"></i> {hero?.badge?.[lang] || t('hero_badge')}</div>
              <h1 className="hero-title">{hero?.title?.[lang] || t('hero_title')}</h1>
              <p className="hero-subtitle">{hero?.subtitle?.[lang] || t('hero_subtitle')}</p>
              <a href="#products" className="hero-cta">
                  {hero?.ctaText?.[lang] || t('hero_cta')}
                  <i className="fa-solid fa-arrow-down"></i>
              </a>
          </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="products-section" id="products">
          <div className="section-title-wrapper animate-in">
              <span className="section-tag">{t('perfumes')}</span>
              <h2 className="section-title">اكتشف مجموعتنا الحصرية من أرقى العطور الرجالية</h2>
              <div className="section-divider"></div>
          </div>
          <div className="products-grid" id="productsGrid">
            {products.map(p => (
              <div key={p._id} className="product-card" onClick={() => openModal(p)}>
                  {p.badge && p.badge[lang] && (
                      <div className="product-badge">{p.badge[lang]}</div>
                  )}
                  <div className="product-card-image-wrapper">
                      <img src={p.images?.[0]?.src || '../src/assets/فخم.png'} alt={p.name[lang] || p.name.ar} />
                  </div>
                  <h3 className="product-card-name">{p.name[lang] || p.name.ar}</h3>
                  <div className="product-card-price">
                      {t('starts_from')} <span>{p.sizes?.[0]?.price}</span> {t('currency')}
                  </div>
              </div>
            ))}
          </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
          <div className="section-title-wrapper animate-in">
              <span className="section-tag">{t('services_tag')}</span>
              <h2 className="section-title">{t('services_title')}</h2>
              <p className="section-subtitle">{t('services_subtitle')}</p>
              <div className="section-divider"></div>
          </div>
          <div className="services-grid" id="servicesGrid">
            {services.map(s => (
              <div key={s._id} className="service-card">
                  <div className="service-card-icon">
                      <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <h3 className="service-card-title">{s.name[lang] || s.name.ar}</h3>
                  <p className="service-card-desc">{s.desc[lang] || s.desc.ar}</p>
              </div>
            ))}
          </div>
      </section>

      {/* MODAL */}
      <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} id="productModal" onClick={(e) => { if(e.target.id === 'productModal') closeModal(); }}>
        {selectedProduct && (
          <div className="modal-container">
              <button className="modal-close" aria-label="إغلاق" onClick={closeModal}><i
                      className="fa-solid fa-xmark"></i></button>

              <div className="modal-image-section">
                  <img id="modalImg" className="modal-main-image" src={selectedProduct.images?.[0]?.src || '../src/assets/فخم.png'} alt="" />
                  <div className="modal-thumbs" id="thumbContainer">
                      {selectedProduct.images?.map((img, idx) => (
                        <img key={idx} src={img.src} className="modal-thumb" alt="" onClick={(e) => {document.getElementById('modalImg').src = img.src}} />
                      ))}
                  </div>
              </div>

              <div className="modal-info-section">
                  <h2 id="modalTitle" className="modal-product-name">{selectedProduct.name[lang] || selectedProduct.name.ar}</h2>
                  <p className="modal-product-tagline">{selectedProduct.category || t('no_category')}</p>

                  <div id="customArea"></div>

                  <div id="sizeOptions">
                      <p className="modal-size-label">اختر الحجم</p>
                      <div className="modal-size-options" id="sizeBtnContainer">
                        {selectedProduct.sizes?.map((size, idx) => (
                          <button 
                            key={idx} 
                            className={`size-btn ${selectedSize?.size === size.size ? 'active' : ''}`}
                            onClick={() => { setSelectedSize(size); setDiscountInfo(null); }}
                          >
                            {size.size}
                          </button>
                        ))}
                      </div>
                  </div>

                  <div className="modal-price-wrapper">
                      <p className="modal-price-label">السعر</p>
                      <p id="modalPrice" className="modal-price">
                        {discountInfo ? (
                          <>
                            <span style={{textDecoration:'line-through', color:'#666', fontSize:'1.2rem', margin:'0 10px'}}>{selectedSize?.price}</span>
                            {selectedSize?.price - discountInfo.discountAmount}
                          </>
                        ) : (
                          selectedSize?.price
                        )} <span className="currency">{t('currency')}</span>
                      </p>
                  </div>

                  {/* Promo Code Input added here nicely */}
                  <div className="modal-phone-wrapper" style={{display:'flex', gap:'10px'}}>
                      <input type="text" className="modal-phone" placeholder={t('promo_code_placeholder')} value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                      <button className="size-btn active" style={{whiteSpace:'nowrap', margin:0, borderRadius:'var(--radius-md)'}} onClick={applyPromo}>{t('apply')}</button>
                  </div>

                  <div className="modal-phone-wrapper">
                      <i className="fa-solid fa-phone modal-phone-icon"></i>
                      <input type="tel" id="phone" className="modal-phone" placeholder="رقم الهاتف للتواصل" maxLength="11" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>

                  <button className="modal-order-btn" onClick={confirmOrder}>
                      <i className="fa-brands fa-whatsapp"></i>
                      تأكيد الأوردر عبر واتساب
                  </button>

                  <div id="successMsg" className={`modal-success ${orderSuccess ? 'visible' : ''}`}>
                      <i className="fa-solid fa-circle-check"></i>
                      تم تأكيد الأوردر بنجاح! سيتم تحويلك للواتساب
                  </div>
              </div>
          </div>
        )}
      </div>

      {/* SOCIAL ACCOUNTS */}
      <section className="social-accounts-section animate-in">
          <span className="section-tag">تابعنا</span>
          <h2 className="section-title">حساباتنا</h2>
          <p className="section-subtitle">تابعنا على منصات التواصل الاجتماعي</p>
          <div className="section-divider"></div>
          <div className="social-accounts-icons">
              <a href={`https://wa.me/${settings?.whatsapp || '201555590004'}`} target="_blank" rel="noreferrer" className="whatsapp-icon" aria-label="واتساب"><i className="fa-brands fa-whatsapp"></i></a>
              <a href={settings?.instagram || '#'} target="_blank" rel="noreferrer" className="instagram-icon" aria-label="انستغرام"><i className="fa-brands fa-instagram"></i></a>
              <a href={settings?.facebook || '#'} target="_blank" rel="noreferrer" className="facebook-icon" aria-label="فيسبوك"><i className="fa-brands fa-facebook-f"></i></a>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" id="footer">
          <div className="footer-inner">
              <div className="footer-brand">
                  <div className="footer-brand-logo">
                      <img src="./assets/فخم.png" alt="فخم" />
                      <span>فخم</span>
                  </div>
                  <p className="footer-brand-desc">{settings?.footerText?.[lang] || 'متجر متخصص في العطور الفاخرة الرجالية. نقدم لك أرقى العطور العالمية بأفضل جودة وثبات وبأسعار تنافسية مع التوصيل لجميع المحافظات.'}</p>
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
                      <a href={`https://wa.me/${settings?.whatsapp || '201555590004'}`} target="_blank" rel="noreferrer">{settings?.whatsapp || '01555590004'}</a>
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
              <p className="footer-copyright" dangerouslySetInnerHTML={{ __html: (settings?.copyrightText?.[lang] || '© 2025 فخم - جميع الحقوق محفوظة').replace('فخم', '<span>فخم</span>') }}></p>
          </div>
      </footer>

      <a href={`https://wa.me/${settings?.whatsapp || '201555590004'}`} target="_blank" rel="noreferrer" className="whatsapp-float" aria-label="تواصل عبر واتساب">
          <i className="fa-brands fa-whatsapp"></i>
      </a>

      <button className="scroll-top visible" id="scrollTopBtn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} aria-label="العودة للأعلى">
          <i className="fa-solid fa-arrow-up"></i>
      </button>

    </>
  );
}
