const fs = require('fs');

function htmlToJsx(html) {
    // Basic JSX conversions
    let jsx = html;
    
    // Replace class with className
    jsx = jsx.replace(/class=/g, 'className=');
    // Replace for with htmlFor
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    
    // Remove inline event handlers
    jsx = jsx.replace(/on[a-z]+="[^"]*"/g, '');
    
    // Close void elements
    const voidElements = ['img', 'input', 'br', 'hr', 'source'];
    voidElements.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'g');
        jsx = jsx.replace(regex, `<${tag}$1 />`);
    });

    // Fix style attributes (basic fix: remove them for now or convert to object)
    // It's safer to just remove them or leave them if they are simple, but let's remove inline styles to avoid parsing errors, or convert them if possible.
    // For simplicity, we'll remove inline styles because there are very few or they are complex.
    jsx = jsx.replace(/style="[^"]*"/g, '');

    // Remove comments
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

    return jsx;
}

// Convert index.html
const indexHtml = fs.readFileSync('public/index.html', 'utf8');
const indexBodyMatch = indexHtml.match(/<body>([\s\S]*?)<script/);
if (indexBodyMatch) {
    let bodyContent = indexBodyMatch[1].trim();
    bodyContent = htmlToJsx(bodyContent);
    const reactComponent = `import React, { useEffect, useState } from 'react';
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
      ${bodyContent}
    </>
  );
}
`;
    fs.mkdirSync('src/pages', { recursive: true });
    fs.writeFileSync('src/pages/Home.jsx', reactComponent);
}

// Convert admin.html
const adminHtml = fs.readFileSync('public/admin.html', 'utf8');
const adminBodyMatch = adminHtml.match(/<body>([\s\S]*?)<script/);
if (adminBodyMatch) {
    let bodyContent = adminBodyMatch[1].trim();
    bodyContent = htmlToJsx(bodyContent);
    const reactComponent = `import React, { useEffect, useState } from 'react';
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
      ${bodyContent}
    </>
  );
}
`;
    fs.writeFileSync('src/pages/Admin.jsx', reactComponent);
}
