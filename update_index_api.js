const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Remove hardcoded products and customServices arrays
html = html.replace(/\/\/ ========== PRODUCT DATA ==========[\s\S]*?(?=\/\/ ========== STATE ==========)/, `// ========== API DATA ==========
let products = [];
let customServices = [];
let allProducts = [];
let categories = [];
let hero = {};
let settings = {};

async function loadData() {
    try {
        const [p, c, s, h, set] = await Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/categories').then(r => r.json()),
            fetch('/api/services').then(r => r.json()),
            fetch('/api/hero').then(r => r.json()),
            fetch('/api/settings').then(r => r.json())
        ]);
        products = p || [];
        categories = c || [];
        customServices = s || [];
        hero = h || {};
        settings = set || {};
        allProducts = [...products, ...customServices];
        
        renderProducts();
        renderServices();
    } catch(err) {
        console.error('Failed to load data from API:', err);
    }
}

`);

// 2. Wrap product rendering in a function and update prices to sizes
html = html.replace(/\/\/ ========== RENDER PRODUCTS ==========[\s\S]*?(?=\/\/ ========== RENDER SERVICES ==========)/, `// ========== RENDER PRODUCTS ==========
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    products.forEach((p, idx) => {
        let minPrice = 0, maxPrice = 0;
        if (p.sizes && p.sizes.length > 0) {
            const prices = p.sizes.map(s => s.price);
            minPrice = Math.min(...prices);
            maxPrice = Math.max(...prices);
        }
        const isPremium = maxPrice >= premiumThreshold;
        
        const card = document.createElement('div');
        card.className = 'product-card animate-in';
        card.style.animationDelay = \`\${idx * 0.05}s\`;
        
        let imgHtml = '';
        if (p.images && p.images[0]) {
            const imgData = p.images[0];
            const src = typeof imgData === 'string' ? imgData : imgData.src;
            const o = (typeof imgData === 'object' && imgData.overlay) ? imgData.overlay : null;
            
            imgHtml = \`<img src="\${src}" alt="\${p.name}" loading="lazy">\`;
            if (o && o.text) {
                // simple hexToRgba
                function h2r(hex, alpha) {
                    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
                    return \`rgba(\${r},\${g},\${b},\${alpha})\`;
                }
                const bgRgba = h2r(o.bgColor, o.bgOpacity / 100);
                imgHtml += \`<div class="image-overlay-preview pos-\${o.position}" style="background:\${bgRgba};color:\${o.textColor};font-size:\${o.fontSize}px;">\${o.text}</div>\`;
            }
        } else {
            imgHtml = \`<img src="فخم.jfif" alt="بدون صورة">\`;
        }

        card.innerHTML = \`
            \${isPremium ? '<span class="product-badge"><i class="fa-solid fa-crown" style="margin-left:3px;"></i> فاخر</span>' : ''}
            <div class="product-card-image-wrapper">
                \${imgHtml}
            </div>
            <h3 class="product-card-name">\${p.name}</h3>
            <p class="product-card-price">يبدأ من <span>\${minPrice}</span> ج.م</p>
        \`;
        card.onclick = () => openModal(p);
        productsGrid.appendChild(card);
    });
}

`);

// 3. Wrap service rendering in a function
html = html.replace(/\/\/ ========== RENDER SERVICES ==========[\s\S]*?(?=\/\/ ========== MODAL ==========)/, `// ========== RENDER SERVICES ==========
function renderServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    servicesGrid.innerHTML = '';
    customServices.forEach((s, idx) => {
        const card = document.createElement('div');
        card.className = 'service-card animate-in';
        card.innerHTML = \`
            <div class="service-card-icon"><i class="\${s.icon}"></i></div>
            <img src="\${s.images && s.images[0] ? s.images[0] : ''}" alt="\${s.name}" class="service-card-image" loading="lazy">
            <h3 class="service-card-title">\${s.name}</h3>
            <p class="service-card-desc">\${s.desc}</p>
        \`;
        card.onclick = () => openModal(s);
        servicesGrid.appendChild(card);
    });
}

`);

// 4. Update Modal to use p.sizes and handle new images format
html = html.replace(/document\.getElementById\('modalImg'\)\.src = p\.images\[0\];[\s\S]*?document\.getElementById\('modalImg'\)\.alt = p\.name;/g, `
    let firstImg = p.images && p.images[0] ? p.images[0] : 'فخم.jfif';
    document.getElementById('modalImg').src = typeof firstImg === 'string' ? firstImg : firstImg.src;
    document.getElementById('modalImg').alt = p.name;
`);

html = html.replace(/p\.images\.forEach\(\(img, idx\) => \{[\s\S]*?thumbContainer\.appendChild\(thumb\);\s*\}\);/g, `
    (p.images || []).forEach((imgObj, idx) => {
        const imgSrc = typeof imgObj === 'string' ? imgObj : imgObj.src;
        const thumb = document.createElement('img');
        thumb.src = imgSrc;
        thumb.alt = \`\${p.name} - صورة \${idx + 1}\`;
        thumb.className = \`modal-thumb \${idx === 0 ? 'active' : ''}\`;
        thumb.onclick = () => {
            const mainImg = document.getElementById('modalImg');
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = imgSrc;
                mainImg.style.opacity = '1';
            }, 150);
            document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbContainer.appendChild(thumb);
    });
`);

html = html.replace(/Object\.keys\(p\.prices\)\.forEach\(\(size, idx\) => \{[\s\S]*?\}\);[\s\S]*?\}\);/g, `
    (p.sizes || []).forEach((sObj, idx) => {
        const size = sObj.size;
        const price = sObj.price;
        const btn = document.createElement('button');
        btn.innerText = size;
        btn.className = \`size-btn \${idx === 0 ? 'active' : ''}\`;
        btn.onclick = () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = size;
            selectedPrice = price;
            priceEl.innerHTML = \`\${selectedPrice} <span class="currency">ج.م</span>\`;
        };
        container.appendChild(btn);
        if (idx === 0) {
            selectedSize = size;
            selectedPrice = price;
            priceEl.innerHTML = \`\${selectedPrice} <span class="currency">ج.م</span>\`;
        }
    });
`);

// 5. Add loadData() to the end of the script block
html = html.replace(/<\/script>/, `
        loadData();
    </script>`);

fs.writeFileSync('public/index.html', html);
console.log('index.html updated successfully');
