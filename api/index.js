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

// Import routes
const uploadRoutes = require('./routes/upload.routes');

// Register API routes
app.use('/api', uploadRoutes);

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

const { Product, Category, Service, Hero, Settings } = require('./models');

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
