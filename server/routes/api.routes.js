import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Hero from '../models/Hero.js';
import Settings from '../models/Settings.js';
import PromoCode from '../models/PromoCode.js';

const router = express.Router();

// --- Products ---
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ order: 1 });
        res.json(products);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Categories ---
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json(categories);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Services ---
router.get('/services', async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/services', async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/services/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- PromoCodes ---
router.get('/promocodes', async (req, res) => {
    try {
        const promocodes = await PromoCode.find().sort({ createdAt: -1 });
        res.json(promocodes);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/promocodes', async (req, res) => {
    try {
        const promo = new PromoCode(req.body);
        await promo.save();
        res.status(201).json(promo);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/promocodes/:id', async (req, res) => {
    try {
        const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(promo);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/promocodes/:id', async (req, res) => {
    try {
        await PromoCode.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Validate Promo Code
router.post('/promocodes/validate', async (req, res) => {
    try {
        const { code, orderValue } = req.body;
        const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
        
        if (!promo) return res.status(404).json({ valid: false, message: 'كود الخصم غير صحيح أو غير مفعل' });
        
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
            return res.status(400).json({ valid: false, message: 'كود الخصم منتهي الصلاحية' });
        }
        if (promo.maxUses && promo.currentUses >= promo.maxUses) {
            return res.status(400).json({ valid: false, message: 'تم تجاوز الحد الأقصى لاستخدام الكود' });
        }
        if (orderValue < promo.minOrderValue) {
            return res.status(400).json({ valid: false, message: `الحد الأدنى للطلب لاستخدام هذا الكود هو ${promo.minOrderValue}` });
        }

        let discountAmount = 0;
        if (promo.type === 'percentage') {
            discountAmount = (orderValue * promo.value) / 100;
        } else {
            discountAmount = promo.value;
        }

        res.json({ valid: true, discountAmount, promoCode: promo.code });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Settings & Hero ---
router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings || {});
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (settings) {
            settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
        } else {
            settings = new Settings(req.body);
            await settings.save();
        }
        res.json(settings);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/hero', async (req, res) => {
    try {
        const hero = await Hero.findOne();
        res.json(hero || {});
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/hero', async (req, res) => {
    try {
        let hero = await Hero.findOne();
        if (hero) {
            hero = await Hero.findByIdAndUpdate(hero._id, req.body, { new: true });
        } else {
            hero = new Hero(req.body);
            await hero.save();
        }
        res.json(hero);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

// --- Upload ---
router.post('/upload', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ message: 'لم يتم توفير صورة' });
        
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'fakhem'
        });
        
        res.json({ url: uploadResponse.secure_url });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: err.message || 'فشل في رفع الصورة' });
    }
});

export default router;
