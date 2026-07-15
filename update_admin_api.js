const fs = require('fs');

let html = fs.readFileSync('public/admin.html', 'utf8');

// Replace saveCategory
html = html.replace(/function saveCategory\(\) \{[\s\S]*?saveCategories\(\);[\s\S]*?toast.*?;\s*\}/, `async function saveCategory() {
    const name = document.getElementById('cName').value.trim();
    if (!name) return toast('يرجى إدخال اسم التصنيف', 'error');

    try {
        if (editingCategoryId) {
            await fetch('/api/categories/' + editingCategoryId, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name}) });
        } else {
            await fetch('/api/categories', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name, order: categories.length}) });
        }
        await loadData();
        cancelCategoryEdit();
        renderCategories();
        toast('تم الحفظ', 'success');
    } catch(e) { toast('خطأ', 'error'); }
}`);

// Replace confirmDeleteCategory
html = html.replace(/function confirmDeleteCategory\(id\) \{[\s\S]*?saveCategories\(\);[\s\S]*?\}\);\s*\}/, `function confirmDeleteCategory(id) {
    showConfirm('هل أنت متأكد من الحذف؟', async () => {
        try {
            await fetch('/api/categories/' + id, { method: 'DELETE' });
            await loadData();
            renderCategories();
            toast('تم الحذف', 'success');
        } catch(e) { toast('خطأ', 'error'); }
    });
}`);

// Replace saveService
html = html.replace(/function saveService\(\) \{[\s\S]*?saveServices\(\);[\s\S]*?toast.*?;\s*\}/, `async function saveService() {
    const name = document.getElementById('sName').value.trim();
    const desc = document.getElementById('sDesc').value.trim();
    if (!name || !desc) return toast('أدخل البيانات', 'error');

    const serviceData = { name, desc, icon: selectedServiceIcon, images: tempServiceImages, isCustom: true };

    try {
        if (editingServiceId) {
            await fetch('/api/services/' + editingServiceId, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(serviceData) });
        } else {
            serviceData.order = services.length;
            await fetch('/api/services', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(serviceData) });
        }
        await loadData();
        cancelServiceEdit();
        renderServices();
        toast('تم الحفظ', 'success');
    } catch(e) { toast('خطأ', 'error'); }
}`);

// Replace confirmDeleteService
html = html.replace(/function confirmDeleteService\(id\) \{[\s\S]*?saveServices\(\);[\s\S]*?\}\);\s*\}/, `function confirmDeleteService(id) {
    showConfirm('تأكيد الحذف؟', async () => {
        try {
            await fetch('/api/services/' + id, { method: 'DELETE' });
            await loadData();
            renderServices();
            toast('تم الحذف', 'success');
        } catch(e) { toast('خطأ', 'error'); }
    });
}`);

// Replace handleServiceImageUpload
html = html.replace(/function handleServiceImageUpload\(event\) \{[\s\S]*?event\.target\.value = '';\s*\}/, `async function handleServiceImageUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('images', file));
    try {
        toast('جاري الرفع...', 'info');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
            data.filePaths.forEach(p => tempServiceImages.push(p));
            renderServiceImages();
            toast('تم الرفع', 'success');
        }
    } catch(e) { toast('خطأ بالرفع', 'error'); }
    event.target.value = '';
}`);

// Replace saveHero
html = html.replace(/function saveHero\(\) \{[\s\S]*?saveHeroData\(\);[\s\S]*?toast.*?;\s*\}/, `async function saveHero() {
    hero.title = document.getElementById('hTitle').value.trim();
    hero.subtitle = document.getElementById('hSubtitle').value.trim();
    hero.badge = document.getElementById('hBadge').value.trim();
    hero.ctaText = document.getElementById('hCta').value.trim();
    await saveHeroData();
    toast('تم حفظ القسم الرئيسي', 'success');
}`);

// Replace saveSettings
html = html.replace(/function saveSettings\(\) \{[\s\S]*?saveSettingsData\(\);[\s\S]*?toast.*?;\s*\}/, `async function saveSettings() {
    settings.whatsapp = document.getElementById('setWhatsapp').value.trim();
    settings.instagram = document.getElementById('setInstagram').value.trim();
    settings.facebook = document.getElementById('setFacebook').value.trim();
    settings.footerText = document.getElementById('setFooterText').value.trim();
    settings.copyrightText = document.getElementById('setCopyright').value.trim();
    settings.premiumThreshold = parseInt(document.getElementById('setPremium').value) || 2000;
    await saveSettingsData();
    toast('تم حفظ الإعدادات', 'success');
}`);

fs.writeFileSync('public/admin.html', html);
console.log('admin.html updated successfully');
