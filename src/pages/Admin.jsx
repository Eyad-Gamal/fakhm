import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../admin.css';
import Dashboard from '../components/admin/Dashboard';
import ProductsManager from '../components/admin/ProductsManager';
import CategoriesManager from '../components/admin/CategoriesManager';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [hero, setHero] = useState({});
  const [settings, setSettings] = useState({});

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className="fa-solid fa-bars"></i>
      </button>

      <div className="admin-layout">
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
          <a href="/" className="sidebar-brand">
              <img src="/فخم.jfif" alt="فخم" />
              <div>
                  <span className="sidebar-brand-text">فخم</span>
                  <small>لوحة التحكم</small>
              </div>
          </a>
          <nav className="sidebar-nav">
              <button className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavClick('dashboard')}>
                  <i className="fa-solid fa-gauge-high"></i> نظرة عامة
              </button>
              <button className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => handleNavClick('products')}>
                  <i className="fa-solid fa-box-open"></i> المنتجات
              </button>
              <button className={`sidebar-nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => handleNavClick('categories')}>
                  <i className="fa-solid fa-tags"></i> التصنيفات
              </button>
              <button className={`sidebar-nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => handleNavClick('hero')}>
                  <i className="fa-solid fa-image"></i> القسم الرئيسي
              </button>
              <button className={`sidebar-nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => handleNavClick('services')}>
                  <i className="fa-solid fa-concierge-bell"></i> الخدمات
              </button>
              <button className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => handleNavClick('settings')}>
                  <i className="fa-solid fa-gear"></i> الإعدادات
              </button>
          </nav>
          <div className="sidebar-footer">
              <a href="/" target="_blank"><i className="fa-solid fa-external-link"></i> عرض الموقع</a>
          </div>
        </aside>

        <div className="main-content">
          <div className="main-header">
              <h1 id="pageTitle">
                {activeTab === 'dashboard' && <><i className="fa-solid fa-gauge-high"></i> نظرة عامة</>}
                {activeTab === 'products' && <><i className="fa-solid fa-box-open"></i> المنتجات</>}
                {activeTab === 'categories' && <><i className="fa-solid fa-tags"></i> التصنيفات</>}
                {activeTab === 'hero' && <><i className="fa-solid fa-image"></i> القسم الرئيسي</>}
                {activeTab === 'services' && <><i className="fa-solid fa-concierge-bell"></i> الخدمات</>}
                {activeTab === 'settings' && <><i className="fa-solid fa-gear"></i> الإعدادات</>}
              </h1>
          </div>

          <div className="main-body">
            {activeTab === 'dashboard' && <Dashboard products={products} categories={categories} services={services} />}
            {activeTab === 'products' && <ProductsManager products={products} categories={categories} reloadData={fetchData} />}
            {activeTab === 'categories' && <CategoriesManager categories={categories} products={products} reloadData={fetchData} />}
            {activeTab === 'hero' && <div className="page-section active"><p>قسم الهيرو قيد البرمجة...</p></div>}
            {activeTab === 'services' && <div className="page-section active"><p>الخدمات قيد البرمجة...</p></div>}
            {activeTab === 'settings' && <div className="page-section active"><p>الإعدادات قيد البرمجة...</p></div>}
          </div>
        </div>
      </div>
    </>
  );
}
