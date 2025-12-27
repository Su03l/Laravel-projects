# تطبيق قائمة المهام - Laravel API

هذا هو الواجهة الخلفية (Backend API) لتطبيق قائمة المهام، مبني باستخدام Laravel. يوفر واجهة RESTful لمصادقة المستخدمين وإدارة المهام.

يستخدم API نظام Laravel Sanctum للمصادقة المستندة إلى الكوكيز للتطبيقات أحادية الصفحة (SPA).

## إعداد البيئة

لإعداد المشروع، انسخ ملف `.env.example` إلى ملف جديد باسم `.env` وقم بتكوين المتغيرات اللازمة.

```sh
cp .env.example .env
```

### مثال على تكوين `.env`

هذه هي المتغيرات الأساسية التي تحتاج إلى تكوينها لكي يعمل هذا التطبيق بشكل صحيح مع تطبيق SPA الأمامي.

```dotenv
APP_NAME="Laravel"
APP_ENV=local
APP_KEY=base64:your-app-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# يجب أن يكون هذا عنوان URL لتطبيق الواجهة الأمامية
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DOMAIN=localhost
SESSION_LIFETIME=120

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

---

## نقاط النهاية (API Endpoints)

عنوان URL الأساسي لجميع نقاط النهاية هو `http://127.0.0.1:8000`، أو `http://localhost:8000` حسب بيئتك.

### المصادقة

هذه النقاط تتعامل مع تسجيل المستخدمين، تسجيل الدخول، وإدارة الجلسات.

| الطريقة | النقطة                 | الوصف                                       | المصادقة   |
| :------ | :--------------------- | :------------------------------------------ | :--------- |
| `GET`   | `/sanctum/csrf-cookie` | يبدأ حماية CSRF للجلسة.                     | غير مطلوبة |
| `POST`  | `/register`            | ينشئ حساب مستخدم جديد.                      | غير مطلوبة |
| `POST`  | `/login`               | يصادق على المستخدم ويبدأ جلسة.              | غير مطلوبة |
| `POST`  | `/logout`              | يدمر الجلسة المصادق عليها.                  | مطلوبة     |
| `GET`   | `/api/user`            | يسترجع بيانات المستخدم المصادق عليه حالياً. | مطلوبة     |

---

### الملف الشخصي للمستخدم

هذه النقاط لإدارة الملف الشخصي للمستخدم المصادق عليه.

| الطريقة | النقطة               | الوصف                                | المصادقة |
| :------ | :------------------- | :----------------------------------- | :------- |
| `PUT`   | `/api/user/profile`  | تحديث معلومات الملف الشخصي للمستخدم. | مطلوبة   |
| `PUT`   | `/api/user/password` | تحديث كلمة مرور المستخدم.            | مطلوبة   |

#### محتوى تحديث الملف الشخصي

```json
{
    "fname": "Jane",
    "lname": "Doe",
    "username": "janedoe",
    "email": "jane.doe@example.com"
}
```

_(ملاحظة: جميع الحقول اختيارية. أرسل فقط الحقول التي تريد تحديثها.)_

#### محتوى تغيير كلمة المرور

```json
{
    "current_password": "their-old-password",
    "password": "their-new-secure-password",
    "password_confirmation": "their-new-secure-password"
}
```

---

### المهام

هذه النقاط لإدارة المهام وتتطلب المصادقة.

| الطريقة  | النقطة            | الوصف                      |
| :------- | :---------------- | :------------------------- |
| `GET`    | `/api/todos`      | يسترجع قائمة بجميع المهام. |
| `POST`   | `/api/todos`      | ينشئ مهمة جديدة.           |
| `PUT`    | `/api/todos/{id}` | يحدث مهمة موجودة.          |
| `DELETE` | `/api/todos/{id}` | يحذف مهمة محددة.           |

#### محتوى المهمة

```json
{
    "title": "My New Todo",
    "description": "A detailed description of the task.",
    "is_completed": false
}
```
