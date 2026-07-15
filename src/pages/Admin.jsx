import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../admin.css';

export default function Admin() {
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
      <button className="mobile-toggle" ><i className="fa-solid fa-bars"></i></button>

    <div className="admin-layout">
        
        <aside className="sidebar" id="sidebar">
            <a href="index.html" className="sidebar-brand">
                <img src="فخم.jfif" alt="فخم" />
                <div>
                    <span className="sidebar-brand-text">فخم</span>
                    <small>لوحة التحكم</small>
                </div>
            </a>
            <nav className="sidebar-nav">
                <button className="sidebar-nav-item active" >
                    <i className="fa-solid fa-gauge-high"></i> نظرة عامة
                </button>
                <button className="sidebar-nav-item" >
                    <i className="fa-solid fa-box-open"></i> المنتجات
                </button>
                <button className="sidebar-nav-item" >
                    <i className="fa-solid fa-tags"></i> التصنيفات
                </button>
                <button className="sidebar-nav-item" >
                    <i className="fa-solid fa-image"></i> القسم الرئيسي
                </button>
                <button className="sidebar-nav-item" >
                    <i className="fa-solid fa-concierge-bell"></i> الخدمات
                </button>
                <button className="sidebar-nav-item" >
                    <i className="fa-solid fa-gear"></i> الإعدادات
                </button>
                <button className="sidebar-nav-item" >
                    <i className="fa-solid fa-database"></i> النسخ الاحتياطي
                </button>
            </nav>
            <div className="sidebar-footer">
                <a href="index.html" target="_blank"><i className="fa-solid fa-external-link"></i> عرض الموقع</a>
            </div>
        </aside>

        
        <div className="main-content">
            <div className="main-header">
                <h1 id="pageTitle"><i className="fa-solid fa-gauge-high"></i> نظرة عامة</h1>
            </div>

            <div className="main-body">
                
                <div className="page-section active" id="sec-dashboard">
                    <div className="stats-grid" id="statsGrid"></div>
                    <div className="toolbar">
                        <span className="toolbar-title">إجراءات سريعة</span>
                    </div>
                    <div >
                        <button className="btn btn-primary" >
                            <i className="fa-solid fa-plus"></i> إضافة منتج
                        </button>
                        <button className="btn btn-secondary" >
                            <i className="fa-solid fa-tags"></i> إدارة التصنيفات
                        </button>
                        <button className="btn btn-secondary" >
                            <i className="fa-solid fa-gear"></i> الإعدادات
                        </button>
                        <button className="btn btn-secondary"  id="initDefaultsBtn">
                            <i className="fa-solid fa-download"></i> تحميل البيانات الافتراضية
                        </button>
                    </div>
                </div>

                
                <div className="page-section" id="sec-products">
                    
                    <div id="productsListView">
                        <div className="toolbar">
                            <span className="toolbar-title" id="productsCount"></span>
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-plus"></i> إضافة منتج
                            </button>
                        </div>
                        <div className="items-grid" id="productsGrid"></div>
                        <div className="empty-state" id="productsEmpty" >
                            <i className="fa-solid fa-box-open"></i>
                            <p>لا توجد منتجات بعد</p>
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-plus"></i> إضافة أول منتج
                            </button>
                        </div>
                    </div>

                    
                    <div className="editor-panel" id="productEditor">
                        <div className="editor-header">
                            <button className="editor-back-btn" >
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                            <h2 className="editor-title" id="productEditorTitle">إضافة منتج جديد</h2>
                        </div>

                        <div className="form-panel">
                            <h3 className="form-panel-title"><i className="fa-solid fa-info-circle" ></i> المعلومات الأساسية</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">اسم المنتج *</label>
                                    <input type="text" className="form-input" id="pName" placeholder="مثال: سوفاج" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">التصنيف</label>
                                    <select className="form-select" id="pCategory">
                                        <option value="">بدون تصنيف</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">الشارة / Badge</label>
                                    <select className="form-select" id="pBadge">
                                        <option value="">بدون شارة</option>
                                        <option value="فاخر">فاخر</option>
                                        <option value="جديد">جديد</option>
                                        <option value="عرض خاص">عرض خاص</option>
                                        <option value="الأكثر مبيعاً">الأكثر مبيعاً</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="form-panel">
                            <h3 className="form-panel-title"><i className="fa-solid fa-images" ></i> الصور والطبقات النصية</h3>
                            <div className="images-list" id="pImagesList"></div>
                            <div className="upload-zone" id="pUploadZone" >
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <p>اسحب الصور هنا أو انقر للاختيار</p>
                                <span className="form-hint">يمكنك أيضاً إدخال مسار الملف</span>
                                <input type="file" id="pFileInput" accept="image/*" multiple  />
                            </div>
                            <div >
                                <div className="overlay-ctrl-row">
                                    <label>أو أدخل مسار:</label>
                                    <input type="text" id="pImagePath" placeholder="مثال: سوفاج.png"  />
                                    <button className="btn btn-sm btn-secondary" >إضافة</button>
                                </div>
                            </div>
                        </div>

                        <div className="form-panel">
                            <h3 className="form-panel-title"><i className="fa-solid fa-ruler" ></i> الأحجام والأسعار</h3>
                            <div className="size-price-rows" id="pSizePriceRows"></div>
                            <button className="btn btn-sm btn-secondary" >
                                <i className="fa-solid fa-plus"></i> إضافة حجم
                            </button>
                        </div>

                        <div className="form-actions">
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-floppy-disk"></i> حفظ المنتج
                            </button>
                            <button className="btn btn-secondary" >إلغاء</button>
                        </div>
                    </div>
                </div>

                
                <div className="page-section" id="sec-categories">
                    <div className="toolbar">
                        <span className="toolbar-title" id="categoriesCount"></span>
                        <button className="btn btn-primary" >
                            <i className="fa-solid fa-plus"></i> إضافة تصنيف
                        </button>
                    </div>
                    <div className="list-items" id="categoriesList"></div>
                    <div className="empty-state" id="categoriesEmpty" >
                        <i className="fa-solid fa-tags"></i>
                        <p>لا توجد تصنيفات بعد</p>
                        <button className="btn btn-primary" >
                            <i className="fa-solid fa-plus"></i> إضافة تصنيف
                        </button>
                    </div>
                </div>

                
                <div className="page-section" id="sec-hero">
                    <div className="form-panel">
                        <h3 className="form-panel-title"><i className="fa-solid fa-circle" ></i> صور الدوائر (Hero)</h3>
                        <p className="form-hint" >الصور الأربع التي تظهر حول الشعار في القسم الرئيسي</p>
                        <div className="hero-circles-grid" id="heroCirclesGrid"></div>
                    </div>
                    <div className="form-panel">
                        <h3 className="form-panel-title"><i className="fa-solid fa-heading" ></i> النصوص</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">نص الشارة</label>
                                <input type="text" className="form-input" id="heroBadge" placeholder="المجموعة الحصرية" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">العنوان الرئيسي</label>
                                <input type="text" className="form-input" id="heroTitle" placeholder="عطور فاخرة بجودة استثنائية" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">العنوان الفرعي</label>
                                <textarea className="form-textarea" id="heroSubtitle" placeholder="اكتشف مجموعتنا الحصرية..."></textarea>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">نص زر CTA</label>
                                <input type="text" className="form-input" id="heroCta" placeholder="تصفح المجموعة" />
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" >
                            <i className="fa-solid fa-floppy-disk"></i> حفظ التغييرات
                        </button>
                    </div>
                </div>

                
                <div className="page-section" id="sec-services">
                    <div id="servicesListView">
                        <div className="toolbar">
                            <span className="toolbar-title" id="servicesCount"></span>
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-plus"></i> إضافة خدمة
                            </button>
                        </div>
                        <div className="items-grid" id="servicesGrid"></div>
                        <div className="empty-state" id="servicesEmpty" >
                            <i className="fa-solid fa-concierge-bell"></i>
                            <p>لا توجد خدمات بعد</p>
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-plus"></i> إضافة خدمة
                            </button>
                        </div>
                    </div>

                    <div className="editor-panel" id="serviceEditor">
                        <div className="editor-header">
                            <button className="editor-back-btn" >
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                            <h2 className="editor-title" id="serviceEditorTitle">إضافة خدمة جديدة</h2>
                        </div>
                        <div className="form-panel">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">اسم الخدمة *</label>
                                    <input type="text" className="form-input" id="sName" placeholder="مثال: أصنع عطرك بنفسك" />
                                </div>
                            </div>
                            <div className="form-group" >
                                <label className="form-label">الوصف *</label>
                                <textarea className="form-textarea" id="sDesc" placeholder="وصف الخدمة..."></textarea>
                            </div>
                            <div className="form-group" >
                                <label className="form-label">الأيقونة</label>
                                <div className="icon-grid" id="sIconGrid"></div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">الصور</label>
                                <div className="images-list" id="sImagesList"></div>
                                <div >
                                    <div className="overlay-ctrl-row">
                                        <label>مسار الصورة:</label>
                                        <input type="text" id="sImagePath" placeholder="مثال: Customized.png"  />
                                        <button className="btn btn-sm btn-secondary" >إضافة</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-floppy-disk"></i> حفظ الخدمة
                            </button>
                            <button className="btn btn-secondary" >إلغاء</button>
                        </div>
                    </div>
                </div>

                
                <div className="page-section" id="sec-settings">
                    <div className="form-panel">
                        <h3 className="form-panel-title"><i className="fa-brands fa-whatsapp" ></i> واتساب</h3>
                        <div className="form-group">
                            <label className="form-label">رقم الواتساب (بالكود الدولي)</label>
                            <input type="text" className="form-input" id="setWhatsapp" placeholder="201555590004" />
                            <span className="form-hint">مثال: 201555590004 (بدون + أو 00)</span>
                        </div>
                    </div>
                    <div className="form-panel">
                        <h3 className="form-panel-title"><i className="fa-solid fa-share-nodes" ></i> روابط التواصل الاجتماعي</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">انستغرام</label>
                                <input type="text" className="form-input" id="setInstagram" placeholder="https://instagram.com/..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">فيسبوك</label>
                                <input type="text" className="form-input" id="setFacebook" placeholder="https://facebook.com/..." />
                            </div>
                        </div>
                    </div>
                    <div className="form-panel">
                        <h3 className="form-panel-title"><i className="fa-solid fa-font" ></i> النصوص</h3>
                        <div className="form-group" >
                            <label className="form-label">وصف الفوتر</label>
                            <textarea className="form-textarea" id="setFooterText" placeholder="وصف المتجر في الفوتر..."></textarea>
                        </div>
                        <div className="form-group">
                            <label className="form-label">نص حقوق النشر</label>
                            <input type="text" className="form-input" id="setCopyright" placeholder="© 2025 فخم - جميع الحقوق محفوظة" />
                        </div>
                    </div>
                    <div className="form-panel">
                        <h3 className="form-panel-title"><i className="fa-solid fa-crown" ></i> شارة فاخر</h3>
                        <div className="form-group">
                            <label className="form-label">الحد الأدنى لسعر شارة "فاخر" (ج.م)</label>
                            <input type="number" className="form-input" id="setPremiumThreshold" placeholder="700" />
                            <span className="form-hint">المنتجات التي يتجاوز أعلى سعر لها هذا المبلغ ستظهر بشارة "فاخر" تلقائياً (إذا لم تحدد شارة يدوياً)</span>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="btn btn-primary" >
                            <i className="fa-solid fa-floppy-disk"></i> حفظ الإعدادات
                        </button>
                    </div>
                </div>

                
                <div className="page-section" id="sec-backup">
                    <div className="backup-section">
                        <div className="backup-card">
                            <i className="fa-solid fa-file-export icon"></i>
                            <h3>تصدير البيانات</h3>
                            <p>تصدير جميع البيانات كملف JSON يمكنك حفظه كنسخة احتياطية</p>
                            <button className="btn btn-primary" >
                                <i className="fa-solid fa-download"></i> تصدير
                            </button>
                        </div>
                        <div className="backup-card">
                            <i className="fa-solid fa-file-import icon"></i>
                            <h3>استيراد البيانات</h3>
                            <p>استيراد بيانات من ملف JSON سبق تصديره. سيتم استبدال جميع البيانات الحالية</p>
                            <button className="btn btn-secondary" >
                                <i className="fa-solid fa-upload"></i> استيراد
                            </button>
                            <input type="file" id="importFile" accept=".json"   />
                        </div>
                        <div className="backup-card">
                            <i className="fa-solid fa-trash-can icon" ></i>
                            <h3>مسح جميع البيانات</h3>
                            <p>حذف جميع البيانات المحفوظة والعودة للوضع الافتراضي</p>
                            <button className="btn btn-danger" >
                                <i className="fa-solid fa-trash"></i> مسح الكل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    <div className="admin-modal-overlay" id="categoryModal">
        <div className="admin-modal">
            <div className="admin-modal-header">
                <h3 id="categoryModalTitle">إضافة تصنيف</h3>
                <button className="admin-modal-close" ><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="admin-modal-body">
                <div className="form-group">
                    <label className="form-label">اسم التصنيف</label>
                    <input type="text" className="form-input" id="catName" placeholder="مثال: عطور رجالية" />
                </div>
            </div>
            <div className="admin-modal-footer">
                <button className="btn btn-primary" >
                    <i className="fa-solid fa-floppy-disk"></i> حفظ
                </button>
                <button className="btn btn-secondary" >إلغاء</button>
            </div>
        </div>
    </div>

    
    <div className="admin-modal-overlay confirm-modal" id="confirmModal">
        <div className="admin-modal">
            <div className="admin-modal-body">
                <div className="confirm-text">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <p id="confirmText">هل أنت متأكد؟</p>
                </div>
            </div>
            <div className="admin-modal-footer">
                <button className="btn btn-danger" id="confirmYes">نعم، حذف</button>
                <button className="btn btn-secondary" >إلغاء</button>
            </div>
        </div>
    </div>

    
    <div className="toast-container" id="toastContainer"></div>
    </>
  );
}
