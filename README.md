# تی‌شرت استور - نسخه کامل (Frontend + Backend)

فروشگاه آنلاین تی‌شرت با بک‌اند واقعی. محصولات روی سرور ذخیره می‌شوند و برای همه کاربران دائمی هستند.

## ساختار

```
tshirt-store-full/
├── backend/
│   ├── server.js          # سرور Express
│   ├── package.json
│   └── data/
│       ├── products.json  # دیتابیس محصولات
│       └── orders.json    # سفارش‌ها
└── frontend/
    ├── index.html
    ├── products.html
    ├── product.html
    ├── admin.html         # پنل مدیریت
    ├── about.html
    ├── contact.html
    ├── css/
    └── js/
```

## اجرای محلی

```bash
cd backend
npm install
npm start
```

سپس برو به: http://localhost:3000

پنل ادمین: http://localhost:3000/admin.html  
رمز پیش‌فرض: `admin123`

## استقرار رایگان روی Render.com

1. حساب در [render.com](https://render.com) بساز
2. New → Web Service
3. ریپازیتوری GitHub رو وصل کن (یا این پوشه رو آپلود کن)
4. تنظیمات:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Environment Variable (اختیاری):
   - `ADMIN_PASSWORD` = رمز دلخواهت
6. Deploy بزن و لینک بگیر!

## استقرار روی Railway.app

1. برو به [railway.app](https://railway.app)
2. New Project → Deploy from folder / GitHub
3. پوشه `backend` رو انتخاب کن
4. متغیر محیطی `ADMIN_PASSWORD` رو تنظیم کن

## API Endpoints

| Method | Path | توضیح |
|--------|------|--------|
| GET | /api/products | لیست محصولات |
| GET | /api/products/:id | یک محصول |
| POST | /api/products | افزودن (نیاز به رمز) |
| PUT | /api/products/:id | ویرایش (نیاز به رمز) |
| DELETE | /api/products/:id | حذف (نیاز به رمز) |
| POST | /api/orders | ثبت سفارش |
| GET | /api/orders | لیست سفارش‌ها (ادمین) |

رمز ادمین از طریق هدر `x-admin-password` ارسال می‌شود.

## نکات

- دیتابیس به صورت فایل JSON است (ساده و بدون نیاز به نصب دیتابیس جدا)
- برای پروژه بزرگ‌تر می‌توان به PostgreSQL یا MongoDB ارتقا داد
- رمز ادمین را حتماً تغییر دهید
