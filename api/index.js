const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

<<<<<<< HEAD
// Import routes
const uploadRoutes = require('./routes/upload.routes');

// Register API routes
app.use('/api', uploadRoutes);
=======
// Cloudinary Configuration
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// The CLOUDINARY_URL is automatically picked up from process.env by the cloudinary SDK
// but we can ensure it's loaded explicitly if needed, although standard practice is:
// cloudinary.config() will automatically read process.env.CLOUDINARY_URL

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'fakhem',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'jfif', 'svg']
  }
});
const upload = multer({ storage: storage });

// Upload Endpoint - Uploads to Cloudinary
app.post('/api/upload', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        
        const filePaths = req.files.map(file => file.path);
        
        res.json({ filePaths });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
>>>>>>> d1b128a0f5b568b4c112ca812cd6cb3ec886b324

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file');
} else {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Connected to MongoDB Atlas'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// ==========================================
// Mongoose Models
// ==========================================

<<<<<<< HEAD
const { Product, Category, Service, Hero, Settings } = require('./models');
=======
const ImageSchema = new mongoose.Schema({
    src: String,
    overlay: {
        text: String,
        bgColor: String,
        bgOpacity: Number,
        textColor: String,
        fontSize: Number,
        position: String
    }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: '' },
    badge: { type: String, default: '' },
    images: [ImageSchema],
    sizes: [{
        size: String,
        price: Number
    }],
    order: { type: Number, default: 0 }
});

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    order: { type: Number, default: 0 }
});

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, default: '' },
    images: [String],
    isCustom: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
});

const HeroSchema = new mongoose.Schema({
    circles: [String],
    title: String,
    subtitle: String,
    badge: String,
    ctaText: String
});

const SettingsSchema = new mongoose.Schema({
    whatsapp: String,
    instagram: String,
    facebook: String,
    footerText: String,
    copyrightText: String,
    premiumThreshold: Number,
    logo: String
});

const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const Service = mongoose.model('Service', ServiceSchema);
const Hero = mongoose.model('Hero', HeroSchema);
const Settings = mongoose.model('Settings', SettingsSchema);
>>>>>>> d1b128a0f5b568b4c112ca812cd6cb3ec886b324

// ==========================================
// API Routes
// ==========================================

// --- Products ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ order: 1 });
        res.json(products);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/products/reorder', async (req, res) => {
    try {
        const { orderedIds } = req.body;
        for (let i = 0; i < orderedIds.length; i++) {
            await Product.findByIdAndUpdate(orderedIds[i], { order: i });
        }
        res.json({ message: 'Reordered' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Categories ---
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        res.json(categories);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(category);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/categories/reorder', async (req, res) => {
    try {
        const { orderedIds } = req.body;
        for (let i = 0; i < orderedIds.length; i++) {
            await Category.findByIdAndUpdate(orderedIds[i], { order: i });
        }
        res.json({ message: 'Reordered' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Services ---
app.get('/api/services', async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json(services);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/services', async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.put('/api/services/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (err) { res.status(400).json({ message: err.message }); }
});

app.delete('/api/services/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- Hero ---
app.get('/api/hero', async (req, res) => {
    try {
        const hero = await Hero.findOne();
        res.json(hero || {});
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/hero', async (req, res) => {
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

// --- Settings ---
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings || {});
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/settings', async (req, res) => {
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

// Global error handler middleware for consistent error responses
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);

    // Default error response
    const statusCode = error.statusCode || 500;
    const message = error.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// Export app for Serverless
module.exports = app;
