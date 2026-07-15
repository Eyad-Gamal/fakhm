import React from 'react';
import axios from 'axios';

export default function Dashboard({ products, categories, services }) {
  const handleLoadDefaults = async () => {
    // Basic implementation for loading defaults (we might not need it if they already have data)
    alert("Loading defaults is disabled in React migration for safety. Please add items manually.");
  };

  const totalImages = products.reduce((acc, p) => acc + (p.images?.length || 0), 0);

  return (
    <div className="page-section active" id="sec-dashboard">
      <div className="stats-grid" id="statsGrid">
        <div className="stat-card">
            <div className="stat-card-icon"><i className="fa-solid fa-box-open"></i></div>
            <div className="stat-card-number">{products.length}</div>
            <div className="stat-card-label">منتج</div>
        </div>
        <div className="stat-card">
            <div className="stat-card-icon"><i className="fa-solid fa-tags"></i></div>
            <div className="stat-card-number">{categories.length}</div>
            <div className="stat-card-label">تصنيف</div>
        </div>
        <div className="stat-card">
            <div className="stat-card-icon"><i className="fa-solid fa-concierge-bell"></i></div>
            <div className="stat-card-number">{services.length}</div>
            <div className="stat-card-label">خدمة</div>
        </div>
        <div className="stat-card">
            <div className="stat-card-icon"><i className="fa-solid fa-images"></i></div>
            <div className="stat-card-number">{totalImages}</div>
            <div className="stat-card-label">صورة</div>
        </div>
      </div>
    </div>
  );
}
