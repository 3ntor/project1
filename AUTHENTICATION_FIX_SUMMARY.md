# إصلاح مشكلة "المستخدم غير موجود" في نظام الحجز

## المشكلة
كان المستخدمون يحصلون على رسالة "المستخدم غير موجود" عند محاولة حجز موعد بعد تسجيل الحساب وتسجيل الدخول.

## السبب الجذري
كانت المشكلة في ملف `routes/bookings.js` حيث كان الكود يحاول الوصول إلى `req.user.userId` بدلاً من `req.user._id`. 

في middleware المصادقة (`middleware/auth.js`)، يتم تعيين `req.user` إلى كامل كائن المستخدم من قاعدة البيانات، وليس فقط معرف المستخدم.

## الإصلاحات المطبقة

### 1. إصلاح routes/bookings.js
تم تغيير جميع الحالات التي تستخدم:
```javascript
const user = await User.findById(req.user.userId);
```

إلى:
```javascript
const user = req.user; // User is already fetched in auth middleware
```

هذا يحل المشكلة لأن:
- المستخدم تم جلبه بالفعل في middleware المصادقة
- لا حاجة لاستعلام إضافي في قاعدة البيانات
- يتجنب خطأ `req.user.userId` غير المحدد

### 2. إضافة حقل role إلى نموذج User
تم إضافة حقل `role` إلى `models/User.js`:
```javascript
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
```

### 3. إصلاح إنشاء حساب الأدمن
تم إصلاح منطق إنشاء حساب الأدمن في `server.js` ليسمح لنموذج User بالتعامل مع تشفير كلمة المرور.

### 4. إضافة ملف البيئة
تم إنشاء ملف `.env` مع المتغيرات المطلوبة:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nafsyetak-clinic
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@nafsyetak.com
ADMIN_PASSWORD=admin123
```

## الملفات المعدلة
1. `routes/bookings.js` - إصلاح مراجع المستخدم
2. `models/User.js` - إضافة حقل role
3. `server.js` - إصلاح إنشاء حساب الأدمن
4. `.env` - إعدادات البيئة

## كيفية اختبار الإصلاح

### الطريقة 1: اختبار يدوي
1. قم بتشغيل الخادم: `npm start`
2. قم بتشغيل التطبيق الأمامي: `cd client && npm start`
3. سجل حساب جديد
4. حاول حجز موعد - يجب أن يعمل الآن بدون خطأ

### الطريقة 2: اختبار API
```bash
# تسجيل مستخدم جديد
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"+20 123 456 789"}'

# استخدام الـ token المُرجع لحجز موعد
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN_HERE]" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+20 123 456 789","service":"individual","date":"2024-07-21","time":"10:00"}'
```

## ملاحظات مهمة
- تأكد من تشغيل MongoDB قبل تشغيل الخادم
- إذا كنت تستخدم قاعدة بيانات موجودة، قد تحتاج لإضافة حقل `role` للمستخدمين الحاليين
- تأكد من تحديث JWT_SECRET في الإنتاج

## الحالة
✅ تم إصلاح المشكلة - المستخدمون يمكنهم الآن حجز المواعيد بنجاح بعد التسجيل