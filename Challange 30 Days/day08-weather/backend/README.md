# نظام الطقس والتحليلات - الخادم الخلفي

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel) ![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php) ![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite) ![Scramble](https://img.shields.io/badge/Scramble-API_Docs-orange?style=for-the-badge)

**تحدي 30 يوم 30 مشروع - اليوم 8**

</div>

---

## نظرة عامة

خادم خلفي متطور يعمل كـ **وكيل آمن (Secure Proxy)** بين الواجهة الأمامية وواجهة OpenWeatherMap API. يطبق نظام تخزين مؤقت ذكي وتحليلات بحث متقدمة.

## المشكلات التي يحلها

| المشكلة        | الحل                                  |
| -------------- | ------------------------------------- |
| كشف مفاتيح API | الخادم الخلفي يحتفظ بالمفتاح بشكل آمن |
| بطء الاستجابة  | تخزين مؤقت لمدة 60 دقيقة              |
| غياب التحليلات | نظام تتبع للمدن الأكثر بحثاً          |
| استنزاف الحصة  | تقليل الطلبات للـ API الخارجي         |

## المميزات التقنية

`Secure Proxy` `Smart Caching` `Search Analytics` `Trending Cities` `Arabic Support`

## توثيق الـ API

### جلب طقس مدينة

```http
GET /api/weather/{city}
```

**الاستجابة:**

```json
{
    "city": "London",
    "search_stats": {
        "total_searches": 15,
        "is_trending": true
    },
    "weather": {
        "temp": "12°C",
        "description": "غائم جزئي",
        "humidity": "81%",
        "wind_speed": "4.1 m/s",
        "icon": "https://openweathermap.org/img/wn/03d@4x.png"
    },
    "cached": true
}
```

### المدن الرائجة

```http
GET /api/weather/top
```

**الاستجابة:**

```json
[
    { "name": "london", "count": 25 },
    { "name": "paris", "count": 18 },
    { "name": "tokyo", "count": 12 }
]
```

## هيكل المشروع

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   └── WeatherController.php    # المتحكم الرئيسي
│   └── Models/
│       └── CitySearch.php           # نموذج تتبع البحث
├── config/
│   └── services.php                 # إعدادات OpenWeather
├── database/
│   └── migrations/                  # جداول قاعدة البيانات
└── routes/
    └── api.php                      # مسارات الـ API
```

## التثبيت والإعداد

### 1. تثبيت الحزم

```bash
composer install
```

### 2. إعداد البيئة

```bash
cp .env.example .env
php artisan key:generate
```

### 3. إضافة مفتاح OpenWeather

```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 4. إعداد قاعدة البيانات

```bash
php artisan migrate
```

### 5. تشغيل الخادم

```bash
php artisan serve
```

> الخادم يعمل على: `http://127.0.0.1:8000`

## الإعدادات المهمة

**config/services.php:**

```php
'openweather' => [
    'key' => env('OPENWEATHER_API_KEY'),
],
```

## أفضل الممارسات الأمنية

- استخدام `config()` بدلاً من `env()` في المتحكمات
- حماية مفتاح API في الخادم الخلفي
- التحقق من صحة المدخلات
- معالجة الأخطاء بشكل صحيح

---

<div align="center">

**صُنع ضمن تحدي 30 يوم 30 مشروع**

</div>
