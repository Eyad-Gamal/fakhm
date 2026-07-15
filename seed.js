const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

const ProductSchema = new mongoose.Schema({
    name: String, category: String, badge: String, images: Array, sizes: Array, order: Number
}, { strict: false });

const ServiceSchema = new mongoose.Schema({
    name: String, desc: String, icon: String, images: Array, isCustom: Boolean, order: Number
}, { strict: false });

const Product = mongoose.model('Product', ProductSchema);
const Service = mongoose.model('Service', ServiceSchema);

const DEFAULT_PRODUCTS = [
    { name: "5 تيستير من أختيارك", images: ["5 تيستير من أختيارك.png"], prices: { "5عبوات 10ml": 395, "10عبوات 3ml": 390, "10عبوات 5ml": 420 } },
    { name: "دافى دوف شامبيون", images: ["دافى دوف شامبيون.png", "دافى دوف شامبيون 2.png", "فخم2.png"], prices: { "30ml": 220, "50ml": 350, "100ml": 600 } },
    { name: "بوص اورانج", images: ["بوص اورانج.png", "بوص اورانج2.png", "فخم2.png"], prices: { "30ml": 225, "50ml": 370, "100ml": 620 } }
    // Just a few for seeding
];

const DEFAULT_SERVICES = [
    { name: "أصنع عطرك بنفسك", images: ["Customized.png", "فخم2.png"], isCustom: true, desc: "عبر عن نفسك وأصنع نوتاتك بنفسك!", icon: "fa-solid fa-flask" },
    { name: "أطلب عطر مخصص", images: ["f0.png", "فخم2.png"], isCustom: true, desc: "يمكنك طلب أي عطر عالمي أو عربي أو مصري", icon: "fa-solid fa-wand-magic-sparkles" }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        await Service.deleteMany({});

        const products = DEFAULT_PRODUCTS.map((p, i) => ({
            name: p.name, category: '', badge: '',
            images: p.images.map(src => ({
                src: src, overlay: { text: '', bgColor: '#000000', bgOpacity: 0, textColor: '#ffffff', fontSize: 16, position: 'bottom' }
            })),
            sizes: Object.entries(p.prices).map(([size, price]) => ({ size, price })),
            order: i
        }));

        const services = DEFAULT_SERVICES.map((s, i) => ({
            name: s.name, images: s.images, desc: s.desc, icon: s.icon, isCustom: s.isCustom, order: i
        }));

        await Product.insertMany(products);
        await Service.insertMany(services);

        console.log('Data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
