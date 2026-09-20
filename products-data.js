// محصولات از API بارگذاری می‌شوند
let products = [];

// تبدیل عدد به فرمت فارسی
function formatPrice(price) {
  return Number(price).toLocaleString('fa-IR') + ' تومان';
}

function getCategoryName(cat) {
  const names = { men: 'مردانه', women: 'زنانه', unisex: 'یونیسکس' };
  return names[cat] || cat;
}

function getColorName(color) {
  const names = {
    black: 'مشکی', white: 'سفید', gray: 'خاکستری',
    blue: 'آبی', red: 'قرمز', green: 'سبز'
  };
  return names[color] || color;
}

// بارگذاری محصولات از سرور
async function loadProductsFromAPI() {
  try {
    if (typeof fetchProducts === 'function') {
      products = await fetchProducts();
    } else {
      // fallback اگر api.js لود نشده
      const res = await fetch('/api/products');
      products = await res.json();
    }
    return products;
  } catch (err) {
    console.error('خطا در بارگذاری محصولات:', err);
    products = [];
    return [];
  }
}
