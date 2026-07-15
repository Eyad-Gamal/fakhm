import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState({});
  const [settings, setSettings] = useState({});

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

  return (
    <>
      
    <header className="site-header" id="siteHeader">
        <div className="header-inner">
            <a href="#" className="header-logo" >
                <img src={settings.logo || "/فخم.jfif"} alt="فخم" />
                <span className="header-logo-text">فخم</span>
            </a>
            <nav className="header-nav">
                <a href="#hero" className="nav-link active">الرئيسية</a>
                <a href="#products" className="nav-link">العطور</a>
                <a href="#services" className="nav-link">خدماتنا</a>
                <a href="#footer" className="nav-link">تواصل معنا</a>
            </nav>
            <div >
                <button className="header-search-btn"  aria-label="بحث">
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                <button className="mobile-menu-btn"  aria-label="القائمة">
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
    </header>

    
    <div className="mobile-nav-overlay" id="mobileNavOverlay" ></div>
    <div className="mobile-nav" id="mobileNav">
        <button className="mobile-nav-close" ><i className="fa-solid fa-xmark"></i></button>
        <a href="#hero" >الرئيسية</a>
        <a href="#products" >العطور</a>
        <a href="#services" >خدماتنا</a>
        <a href="#footer" >تواصل معنا</a>
    </div>

    <div className="search-overlay" id="searchOverlay">
        <button className="search-close" ><i className="fa-solid fa-xmark"></i></button>
        <div className="search-container">
            <div className="search-input-wrapper">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" className="search-input" id="searchInput" placeholder="ابحث عن عطرك المفضل..."
                    autoComplete="off"  />
            </div>
            <div className="search-results" id="searchResults"></div>
        </div>
    </div>

    <section className="hero" id="hero">
        <div className="hero-bg"></div>
        <div className="container hero-content">
            <div className="hero-text">
                <span className="badge">{hero.badge || "المجموعة الحصرية"}</span>
                <h1>{hero.title ? hero.title.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>) : <>عطور فاخرة<br/>بجودة استثنائية</>}</h1>
                <p>{hero.subtitle || "اكتشف مجموعتنا الحصرية من أرقى العطور الرجالية المصنوعة بأفضل المكونات وأعلى تركيز لثبات يدوم طوال اليوم"}</p>
                <div className="hero-actions">
                    <a href="#products" className="btn btn-primary btn-lg">{hero.ctaText || "تصفح المجموعة"} <i className="fa-solid fa-arrow-left"></i></a>
                    <a href="#services" className="btn btn-secondary btn-lg">خدماتنا الخاصة</a>
                </div>
            </div>
            
            <div className="hero-visual">
                <div className="hero-circle sm"><img src={hero.circles?.[3] || "/WhatsApp Image 2026-07-13 at 4.05.02 PM.jpeg"} alt="لا يسبب الحساسية" /></div>
                <div className="hero-circle md"><img src={hero.circles?.[1] || "/WhatsApp Image 2026-07-13 at 422.05.03 PM.jpeg"} alt="ضمان مدى الحياة" /></div>
                <div className="hero-logo-frame">
                    <img src={settings.logo || "/فخم.png"} alt="فخم - عطور فاخرة" className="hero-logo" />
                </div>
                <div className="hero-circle md"><img src={hero.circles?.[2] || "/WhatsApp Image 2026-07-13 at12 4.05.02 PM.jpeg"} alt="أعلى تركيز ثبات قوي" /></div>
                <div className="hero-circle sm"><img src={hero.circles?.[0] || "/WhatsApp Image 2026-4407-13 at 4.05.03 PM.jpeg"} alt="إرجاع مجاني" /></div>
            </div>
        </div>
        <a href="#products" className="scroll-down">
            <i className="fa-solid fa-chevron-down"></i>
        </a>
    </section>

    
    <section className="products-section" id="products">
        <div className="section-title-wrapper animate-in">
            <div className="section-divider"></div>
        </div>
        <div className="products-grid" id="productsGrid"></div>
    </section>

    
    <section className="services-section" id="services">
        <div className="section-title-wrapper animate-in">
            <span className="section-tag">خدمات مميزة</span>
            <h2 className="section-title">خدماتنا الخاصة</h2>
            <p className="section-subtitle">نقدم لك خدمات حصرية لتجربة عطرية فريدة من نوعها</p>
            <div className="section-divider"></div>
        </div>
        <div className="services-grid" id="servicesGrid"></div>
    </section>

    
    <div className="modal-overlay" id="productModal">
        <div className="modal-container">
            <button className="modal-close"  aria-label="إغلاق"><i
                    className="fa-solid fa-xmark"></i></button>

            <div className="modal-image-section">
                <img id="modalImg" className="modal-main-image" alt="" />
                <div className="modal-thumbs" id="thumbContainer"></div>
            </div>

            <div className="modal-info-section">
                <h2 id="modalTitle" className="modal-product-name"></h2>
                <p className="modal-product-tagline">عطر فاخر بجودة استثنائية من فخم</p>

                <div id="customArea"></div>

                <div id="sizeOptions">
                    <p className="modal-size-label">اختر الحجم</p>
                    <div className="modal-size-options" id="sizeBtnContainer"></div>
                </div>

                <div className="modal-price-wrapper">
                    <p className="modal-price-label">السعر</p>
                    <p id="modalPrice" className="modal-price">0 <span className="currency">ج.م</span></p>
                </div>

                <div className="modal-phone-wrapper">
                    <i className="fa-solid fa-phone modal-phone-icon"></i>
                    <input type="tel" id="phone" className="modal-phone" placeholder="رقم الهاتف للتواصل" maxlength="11" />
                </div>

                <button  className="modal-order-btn">
                    <i className="fa-brands fa-whatsapp"></i>
                    تأكيد الأوردر عبر واتساب
                </button>

                <div id="successMsg" className="modal-success">
                    <i className="fa-solid fa-circle-check"></i>
                    تم تأكيد الأوردر بنجاح! سيتم التواصل معك خلال 24 ساعة
                </div>
            </div>
        </div>
    </div>

    
    <section className="social-accounts-section animate-in">
        <span className="section-tag">تابعنا</span>
        <h2 className="section-title">حساباتنا</h2>
        <p className="section-subtitle">تابعنا على منصات التواصل الاجتماعي</p>
        <div className="section-divider"></div>
        <div className="social-accounts-icons">
            <a href="https://wa.me/201555590004" target="_blank" className="whatsapp-icon" aria-label="واتساب"><i className="fa-brands fa-whatsapp"></i></a>
            <a href="#" className="instagram-icon" aria-label="انستغرام"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="facebook-icon" aria-label="فيسبوك"><i className="fa-brands fa-facebook-f"></i></a>
        </div>
    </section>

    
    <footer className="site-footer" id="footer">
        <div className="footer-inner">
            <div className="footer-brand">
                <div className="footer-brand-logo">
                    <img src={settings.logo || "/فخم.jfif"} alt="فخم" />
                    <span>فخم</span>
                </div>
                <p className="footer-brand-desc">متجر متخصص في العطور الفاخرة الرجالية. نقدم لك أرقى العطور العالمية بأفضل
                    جودة وثبات وبأسعار تنافسية مع التوصيل لجميع المحافظات.</p>
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
                    <a href="https://wa.me/201555590004" target="_blank">01555590004</a>
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
            <p className="footer-copyright">© 2025 <span>فخم</span> - جميع الحقوق محفوظة</p>
        </div>
    </footer>

    
    <a href="https://wa.me/201555590004" target="_blank" className="whatsapp-float" aria-label="تواصل عبر واتساب">
        <i className="fa-brands fa-whatsapp"></i>
    </a>

    
    <button className="scroll-top" id="scrollTopBtn"  aria-label="العودة للأعلى">
        <i className="fa-solid fa-arrow-up"></i>
    </button>

    
    </>
  );
}
