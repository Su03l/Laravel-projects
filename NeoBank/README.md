# نظام المحفظة البنكية الذكي (NeoBank Core API)

نظام مالي متكامل (Fintech Backend) مبني باستخدام **Laravel**. يحاكي الأنظمة البنكية الحقيقية من حيث توليد أرقام الحسابات الدولية (IBAN)، إدارة العمليات المالية الآمنة (ACID Transactions)، ومنع تضارب البيانات (Race Conditions).

يتميز النظام بـ **"محرك تحويل ذكي"** يسمح بإجراء المدفوعات عبر البريد، الهاتف، رقم الحساب، أو الآيبان.

## أبرز المميزات التقنية (Key Features)

### 1. الهوية البنكية التلقائية (Auto-Banking Identity)

بمجرد تسجيل العميل، يقوم النظام تلقائياً عبر `Model Events` بـ:

-   إنشاء محفظة مالية خاصة.
-   توليد **رقم حساب فريد** (10 أرقام).
-   توليد **رقم آيبان دولي (SA IBAN)** متوافق مع المعايير السعودية.

### 2. محرك التحويل الذكي (Smart Transfer Engine)

لا يحتاج المرسل لمعرفة نوع بيانات المستلم. الـ API ذكي كفاية لاستقبال أي معرف:

-   البريد الإلكتروني (Email)
-   رقم الجوال (Phone)
-   رقم الحساب (Account Number)
-   رقم الآيبان (IBAN)

سيقوم النظام بالبحث عن المستلم تلقائياً وإتمام العملية.

### 3. الأمان المالي (Financial Integrity & Locking)

-   **Database Transactions:** ضمان تنفيذ العملية بالكامل أو إلغائها بالكامل (All-or-Nothing).
-   **Atomic Locks (`lockForUpdate`):** قفل سجلات المرسل والمستلم لحظياً لمنع "الإنفاق المزدوج" (Double Spending) في حال وصول طلبين في نفس الملي ثانية.

### 4. تقارير مفصلة (Detailed Resources)

استخدام `API Resources` لتقديم بيانات JSON مهيكلة:

-   **بطاقة الحساب:** تعرض الاسم، الآيبان، والفرع البنكي.
-   **كشف الحساب:** سجل دقيق لكل عملية إيداع، سحب، أو تحويل مع الأرقام المرجعية (UUID).

---

## التقنيات المستخدمة (Tech Stack)

-   **Framework:** Laravel 11
-   **Language:** PHP 8.2+
-   **Database:** SQLite
-   **Authentication:** Laravel Sanctum
-   **Concepts:** ACID, Pessimistic Locking, Polymorphic Logic, Observers

---

## هيكلة قاعدة البيانات (Database Schema)

-   **Users:** (id, name, email, phone, password)
-   **Wallets:**
    -   `user_id`: مالك المحفظة.
    -   `balance`: الرصيد (Decimal 16,2).
    -   `account_number`: رقم حساب محلي فريد.
    -   `iban`: رقم دولي فريد (SA...).
-   **Transactions:** (uuid, type, amount, related_wallet_id)

---

## دليل الروابط (API Endpoints)

### 1. المصادقة والملف الشخصي (Auth & Profile)

| Method | Endpoint                | الوصف                                        |
| :----- | :---------------------- | :------------------------------------------- |
| `POST` | `/api/register`         | تسجيل جديد (يطلب الاسم، الإيميل، **الجوال**) |
| `POST` | `/api/login`            | تسجيل الدخول                                 |
| `GET`  | `/api/profile`          | عرض بيانات المستخدم والمحفظة                 |
| `PUT`  | `/api/profile`          | تحديث البيانات الشخصية                       |
| `PUT`  | `/api/profile/password` | تغيير كلمة المرور                            |

### 2. الخدمات البنكية (Banking Services)

| Method | Endpoint               | الوصف                                                    |
| :----- | :--------------------- | :------------------------------------------------------- |
| `GET`  | `/api/wallet`          | **بطاقة الحساب:** تعرض الآيبان، الرصيد، ومعلومات البنك   |
| `GET`  | `/api/wallet/balance`  | فحص سريع للرصيد فقط                                      |
| `GET`  | `/api/wallet/history`  | كشف حساب بالعمليات السابقة                               |
| `POST` | `/api/wallet/deposit`  | إيداع رصيد (محاكاة للصراف الآلي)                         |
| `POST` | `/api/wallet/transfer` | **التحويل الذكي:** يقبل (email, phone, iban, account_no) |

---

## كود التحويل الذكي (Logic Snippet)

كيف يتعرف النظام على المستلم؟ إليك المنطق المستخدم في `WalletController`:

```php
$receiver = User::where('email', $input)
    ->orWhere('phone', $input)
    ->orWhereHas('wallet', function ($q) use ($input) {
        $q->where('account_number', $input)->orWhere('iban', $input);
    })
    ->first();
```

---

## طريقة التثبيت والتشغيل (Installation)

1. **نسخ المستودع:**

    ```bash
    git clone https://github.com/your-username/neobank-api.git
    ```

2. **تثبيت الحزم:**

    ```bash
    composer install
    ```

3. **إعداد البيئة:**

    - قم بنسخ ملف `.env.example` إلى `.env`.
    - قم بإعداد اتصال قاعدة البيانات.

4. **تجهيز قاعدة البيانات:**

    ```bash
    php artisan migrate
    ```

5. **تشغيل السيرفر:**
    ```bash
    php artisan serve
    ```
