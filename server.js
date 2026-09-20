const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ========== Helpers ==========
function readJSON(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2), 'utf8');
      return fallback;
    }
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading', file, err.message);
    return fallback;
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ========== Default Products ==========
const defaultProducts = [
  {
    id: 1,
    name: "تی‌شرت کلاسیک مشکی",
    category: "men",
    price: 289000,
    oldPrice: 350000,
    colors: ["black", "white", "gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "پرفروش",
    description: "تی‌شرت کلاسیک مردانه از جنس پنبه ۱۰۰٪ با دوخت باکیفیت. مناسب استفاده روزمره و استایل کژوال."
  },
  {
    id: 2,
    name: "تی‌شرت اورسایز سفید",
    category: "unisex",
    price: 320000,
    oldPrice: null,
    colors: ["white", "black", "gray"],
    sizes: ["M", "L", "XL", "XXL"],
    badge: "جدید",
    description: "تی‌شرت اورسایز یونیسکس با برش آزاد و راحت. ایده‌آل برای استایل‌های مدرن و مینیمال."
  },
  {
    id: 3,
    name: "تی‌شرت زنانه گل‌دار",
    category: "women",
    price: 275000,
    oldPrice: 320000,
    colors: ["white", "red", "blue"],
    sizes: ["S", "M", "L", "XL"],
    badge: "تخفیف",
    description: "تی‌شرت زنانه با طرح گل ظریف و پارچه نرم. مناسب بهار و تابستان."
  },
  {
    id: 4,
    name: "تی‌شرت ورزشی آبی",
    category: "men",
    price: 345000,
    oldPrice: null,
    colors: ["blue", "black", "green"],
    sizes: ["M", "L", "XL", "XXL"],
    badge: null,
    description: "تی‌شرت ورزشی با پارچه تنفس‌پذیر و خشک‌شونده سریع. مناسب باشگاه و فعالیت‌های ورزشی."
  },
  {
    id: 5,
    name: "تی‌شرت یقه گرد خاکستری",
    category: "unisex",
    price: 259000,
    oldPrice: 299000,
    colors: ["gray", "black", "white"],
    sizes: ["S", "M", "L", "XL"],
    badge: "تخفیف",
    description: "تی‌شرت ساده یقه گرد با کیفیت عالی. قابل ست شدن با هر لباسی."
  },
  {
    id: 6,
    name: "تی‌شرت زنانه صورتی",
    category: "women",
    price: 295000,
    oldPrice: null,
    colors: ["red", "white", "blue"],
    sizes: ["S", "M", "L"],
    badge: "جدید",
    description: "تی‌شرت زنانه با رنگ شاد و طراحی مدرن. پارچه نرم و سبک."
  },
  {
    id: 7,
    name: "تی‌شرت چاپ‌دار مشکی",
    category: "men",
    price: 380000,
    oldPrice: 450000,
    colors: ["black", "white"],
    sizes: ["M", "L", "XL", "XXL"],
    badge: "پرفروش",
    description: "تی‌شرت با چاپ اختصاصی و باکیفیت. طراحی گرافیکی منحصر به فرد."
  },
  {
    id: 8,
    name: "تی‌شرت لینن سبز",
    category: "unisex",
    price: 410000,
    oldPrice: null,
    colors: ["green", "white", "gray"],
    sizes: ["S", "M", "L", "XL"],
    badge: null,
    description: "تی‌شرت لینن طبیعی با بافت سبک و خنک. بهترین انتخاب برای تابستان."
  },
  {
    id: 9,
    name: "تی‌شرت زنانه راه راه",
    category: "women",
    price: 310000,
    oldPrice: 360000,
    colors: ["blue", "white", "gray"],
    sizes: ["S", "M", "L", "XL"],
    badge: "تخفیف",
    description: "تی‌شرت راه راه زنانه با استایل کلاسیک و شیک. مناسب محیط کار و بیرون."
  },
  {
    id: 10,
    name: "تی‌شرت اورسایز مشکی",
    category: "men",
    price: 335000,
    oldPrice: null,
    colors: ["black", "gray"],
    sizes: ["L", "XL", "XXL"],
    badge: "جدید",
    description: "تی‌شرت اورسایز مردانه با شانه افتاده و قد بلند. استایل استریت و مدرن."
  },
  {
    id: 11,
    name: "تی‌شرت یونیسکس قرمز",
    category: "unisex",
    price: 270000,
    oldPrice: 310000,
    colors: ["red", "black", "white"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: null,
    description: "تی‌شرت ساده قرمز با رنگ زنده و پارچه درجه یک. برای همه مناسب است."
  },
  {
    id: 12,
    name: "تی‌شرت زنانه یقه هفت",
    category: "women",
    price: 285000,
    oldPrice: null,
    colors: ["white", "black", "blue"],
    sizes: ["S", "M", "L"],
    badge: null,
    description: "تی‌شرت یقه هفت زنانه با طراحی ظریف و زنانه. پارچه نرم و کشی."
  }
];

// Init data
ensureDataDir();
if (!fs.existsSync(DATA_FILE)) {
  writeJSON(DATA_FILE, defaultProducts);
}
if (!fs.existsSync(ORDERS_FILE)) {
  writeJSON(ORDERS_FILE, []);
}

// ========== Auth Middleware (simple) ==========
function requireAdmin(req, res, next) {
  const password = req.headers['x-admin-password'] || req.query.password;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'دسترسی غیرمجاز. رمز عبور اشتباه است.' });
  }
  next();
}

// ========== API Routes ==========

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'تی‌شرت استور API آماده است' });
});

// GET all products (public)
app.get('/api/products', (req, res) => {
  const products = readJSON(DATA_FILE, defaultProducts);
  res.json(products);
});

// GET single product (public)
app.get('/api/products/:id', (req, res) => {
  const products = readJSON(DATA_FILE, defaultProducts);
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'محصول پیدا نشد' });
  res.json(product);
});

// POST create product (admin)
app.post('/api/products', requireAdmin, (req, res) => {
  const products = readJSON(DATA_FILE, defaultProducts);
  const { name, category, price, oldPrice, colors, sizes, badge, description } = req.body;

  if (!name || !category || !price || !colors || !sizes) {
    return res.status(400).json({ error: 'فیلدهای ضروری ناقص است' });
  }

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = {
    id: newId,
    name: name.trim(),
    category,
    price: parseInt(price),
    oldPrice: oldPrice ? parseInt(oldPrice) : null,
    colors: Array.isArray(colors) ? colors : [],
    sizes: Array.isArray(sizes) ? sizes : [],
    badge: badge || null,
    description: description || 'توضیحات این محصول به زودی اضافه می‌شود.'
  };

  products.push(newProduct);
  writeJSON(DATA_FILE, products);
  res.status(201).json(newProduct);
});

// PUT update product (admin)
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const products = readJSON(DATA_FILE, defaultProducts);
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'محصول پیدا نشد' });

  const { name, category, price, oldPrice, colors, sizes, badge, description } = req.body;

  products[idx] = {
    ...products[idx],
    name: name !== undefined ? name.trim() : products[idx].name,
    category: category || products[idx].category,
    price: price !== undefined ? parseInt(price) : products[idx].price,
    oldPrice: oldPrice !== undefined ? (oldPrice ? parseInt(oldPrice) : null) : products[idx].oldPrice,
    colors: colors || products[idx].colors,
    sizes: sizes || products[idx].sizes,
    badge: badge !== undefined ? (badge || null) : products[idx].badge,
    description: description !== undefined ? description : products[idx].description
  };

  writeJSON(DATA_FILE, products);
  res.json(products[idx]);
});

// DELETE product (admin)
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  let products = readJSON(DATA_FILE, defaultProducts);
  const id = parseInt(req.params.id);
  const exists = products.some(p => p.id === id);
  if (!exists) return res.status(404).json({ error: 'محصول پیدا نشد' });

  products = products.filter(p => p.id !== id);
  writeJSON(DATA_FILE, products);
  res.json({ success: true, message: 'محصول حذف شد' });
});

// Reset to default products (admin)
app.post('/api/products/reset', requireAdmin, (req, res) => {
  writeJSON(DATA_FILE, defaultProducts);
  res.json({ success: true, message: 'محصولات به حالت پیش‌فرض بازگشتند', products: defaultProducts });
});

// ========== Orders ==========
app.post('/api/orders', (req, res) => {
  const orders = readJSON(ORDERS_FILE, []);
  const { items, customer, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'سبد خرید خالی است' });
  }

  const order = {
    id: Date.now(),
    items,
    customer: customer || {},
    total: total || 0,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  writeJSON(ORDERS_FILE, orders);
  res.status(201).json({ success: true, orderId: order.id, message: 'سفارش ثبت شد' });
});

app.get('/api/orders', requireAdmin, (req, res) => {
  const orders = readJSON(ORDERS_FILE, []);
  res.json(orders.reverse());
});

// ========== SPA Fallback ==========
app.get('*', (req, res) => {
  // If API route not found
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'مسیر پیدا نشد' });
  }
  // Serve index for frontend routes
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 سرور تی‌شرت استور روی پورت ${PORT} اجرا شد`);
  console.log(`📦 محصولات: ${DATA_FILE}`);
  console.log(`🔑 رمز ادمین: ${ADMIN_PASSWORD}`);
});
