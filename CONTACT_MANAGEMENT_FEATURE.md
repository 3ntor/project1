# تم إضافة ميزة إدارة رسائل التواصل للأدمن! 📧

## الميزة الجديدة
تم إضافة نظام متكامل لإدارة رسائل التواصل في لوحة تحكم الأدمن، حيث يمكن للأدمن:
- عرض جميع رسائل التواصل
- إدارة حالة الرسائل (جديد، مقروء، تم الرد، مؤرشف)
- إضافة ملاحظات للرسائل
- الرد على الرسائل
- حذف الرسائل
- عرض إحصائيات الرسائل

## التحديثات المطبقة

### 1. تحديث نموذج Contact
```javascript
// في models/Contact.js
const contactSchema = new mongoose.Schema({
  // الحقول الأساسية
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  
  // الحقول الجديدة لإدارة الرسائل
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 2. إضافة API Routes جديدة
```javascript
// في routes/contact.js

// عرض جميع الرسائل (أدمن فقط)
GET /api/contact/admin

// عرض رسالة واحدة (أدمن فقط)
GET /api/contact/admin/:id

// تحديث حالة الرسالة (أدمن فقط)
PUT /api/contact/admin/:id/status

// الرد على الرسالة (أدمن فقط)
PUT /api/contact/admin/:id/reply

// حذف الرسالة (أدمن فقط)
DELETE /api/contact/admin/:id

// إحصائيات الرسائل (أدمن فقط)
GET /api/contact/admin/stats/overview
```

### 3. تحديث واجهة الأدمن
تم إضافة تبويب جديد "رسائل التواصل" في لوحة تحكم الأدمن مع:

#### أ. إحصائيات الرسائل
- إجمالي الرسائل
- الرسائل الجديدة
- الرسائل التي تم الرد عليها
- رسائل الأسبوع الحالي

#### ب. جدول الرسائل
- عرض اسم المرسل
- البريد الإلكتروني
- رقم الهاتف
- موضوع الرسالة
- حالة الرسالة
- تاريخ الإرسال
- ملاحظات الأدمن

#### ج. إجراءات الرسائل
- عرض تفاصيل الرسالة
- تحديد كمقروء
- الرد على الرسالة
- حذف الرسالة

## حالات الرسائل

### 1. **جديد (new)**
- الحالة الافتراضية للرسائل الجديدة
- لون أحمر للتمييز
- يمكن تحديدها كمقروء أو الرد عليها

### 2. **مقروء (read)**
- الرسائل التي تم قراءتها
- لون أصفر للتمييز
- يمكن الرد عليها أو أرشفتها

### 3. **تم الرد (replied)**
- الرسائل التي تم الرد عليها
- لون أخضر للتمييز
- تحتوي على تاريخ الرد واسم الرد

### 4. **مؤرشف (archived)**
- الرسائل المؤرشفة
- لون رمادي للتمييز
- للرسائل القديمة أو المكتملة

## كيفية الاستخدام

### 1. **عرض الرسائل**
```bash
# تسجيل دخول كأدمن
curl -X GET http://localhost:5000/api/contact/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. **تحديث حالة رسالة**
```bash
curl -X PUT http://localhost:5000/api/contact/admin/MESSAGE_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "read",
    "adminNotes": "تم قراءة الرسالة"
  }'
```

### 3. **الرد على رسالة**
```bash
curl -X PUT http://localhost:5000/api/contact/admin/MESSAGE_ID/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "adminNotes": "تم التواصل مع المريض وتم حجز موعد"
  }'
```

### 4. **عرض الإحصائيات**
```bash
curl -X GET http://localhost:5000/api/contact/admin/stats/overview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## الرسائل التجريبية المنشأة

### 1. **أحمد محمد**
- **البريد**: ahmed@test.com
- **الموضوع**: استفسار عن الخدمات
- **الحالة**: مقروء
- **الملاحظات**: تم قراءة الرسالة وسيتم الرد عليها قريباً

### 2. **فاطمة علي**
- **البريد**: fatima@test.com
- **الموضوع**: حجز موعد
- **الحالة**: تم الرد
- **الملاحظات**: تم التواصل مع المريضة وتم حجز موعد لها مع د. أحمد في يوم الأحد القادم

### 3. **محمد أحمد**
- **البريد**: mohamed@test.com
- **الموضوع**: استفسار عن الأسعار
- **الحالة**: جديد

## الميزات المتقدمة

### 1. **تصفية الرسائل**
- تصفية حسب الحالة (جديد، مقروء، تم الرد، مؤرشف)
- ترقيم الصفحات للرسائل الكثيرة

### 2. **البحث والتصفية**
- البحث في الرسائل حسب الاسم أو الموضوع
- تصفية حسب التاريخ

### 3. **الإشعارات**
- عرض عدد الرسائل الجديدة في لوحة التحكم
- تمييز الرسائل الجديدة بلون مختلف

### 4. **التتبع**
- تتبع من رد على كل رسالة
- تاريخ ووقت الرد
- ملاحظات مفصلة لكل رسالة

## الأمان

### 1. **Middleware حماية**
- جميع routes الرسائل محمية بـ `adminAuth`
- التحقق من صلاحيات الأدمن

### 2. **التحقق من البيانات**
- التحقق من صحة معرف الرسالة
- التحقق من حالة الرسالة

### 3. **التسجيل**
- تسجيل جميع الإجراءات على الرسائل
- تتبع من قام بالإجراء

## الواجهة الأمامية

### 1. **تصميم متجاوب**
- يعمل على جميع الأجهزة
- دعم RTL للغة العربية

### 2. **ألوان مميزة**
- ألوان مختلفة لكل حالة
- تمييز بصري للرسائل الجديدة

### 3. **سهولة الاستخدام**
- أزرار واضحة للإجراءات
- رسائل تأكيد للحذف
- تحديث فوري للواجهة

## اختبار سريع

```bash
# 1. إنشاء رسالة جديدة
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "اسم تجريبي",
    "email": "test@example.com",
    "phone": "+201234567890",
    "subject": "موضوع تجريبي",
    "message": "رسالة تجريبية"
  }'

# 2. عرض الرسائل (أدمن)
curl -X GET http://localhost:5000/api/contact/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# 3. عرض الإحصائيات
curl -X GET http://localhost:5000/api/contact/admin/stats/overview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## حالة النظام الآن
✅ **نموذج Contact محدث**  
✅ **API Routes جديدة مضافة**  
✅ **واجهة الأدمن محدثة**  
✅ **رسائل تجريبية موجودة**  
✅ **إحصائيات تعمل**  
✅ **إدارة الحالات تعمل**  
✅ **الرد على الرسائل يعمل**  
✅ **CSS مضاف**  
✅ **RTL مدعوم**  

الأدمن الآن يمكنه إدارة جميع رسائل التواصل بسهولة! 🚀