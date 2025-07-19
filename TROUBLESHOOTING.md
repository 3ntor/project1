# دليل حل المشاكل - Troubleshooting Guide

## المشاكل الشائعة - Common Issues

### 1. مشكلة قاعدة البيانات - Database Connection Issues

#### الأعراض - Symptoms:
- صفحة الحجز لا تعمل
- لا يمكن إنشاء حساب جديد
- لا يمكن تسجيل الدخول

#### الحل - Solution:

**الخيار الأول: تشغيل MongoDB محلياً**
```bash
# تشغيل سكريبت الإعداد التلقائي
./setup-mongodb.sh

# أو تشغيل MongoDB يدوياً
sudo apt install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**الخيار الثاني: استخدام Docker**
```bash
# تثبيت Docker
sudo apt install docker.io

# تشغيل MongoDB في حاوية Docker
docker run -d --name mongodb-nafsyetak -p 27017:27017 mongo:latest
```

**الخيار الثالث: استخدام MongoDB Atlas (السحابة)**
1. اذهب إلى https://cloud.mongodb.com
2. أنشئ حساب مجاني
3. أنشئ cluster جديد
4. احصل على connection string
5. حدث ملف `.env` بـ connection string الجديد

---

### 2. مشكلة تسجيل الدخول للمدير - Admin Login Issues

#### بيانات المدير الافتراضية - Default Admin Credentials:
```
البريد الإلكتروني: admin@nafsyetak.com
كلمة المرور: admin123
```

#### إذا لم تعمل بيانات المدير - If Admin Credentials Don't Work:
```bash
# تشغيل سكريبت إنشاء المدير
node seedAdmin.js

# أو إعادة تشغيل الخادم لإنشاء المدير تلقائياً
npm start
```

---

### 3. مشاكل تثبيت الحزم - Package Installation Issues

#### مشكلة تعارض الحزم في العميل - Client Package Conflicts:
```bash
cd client
npm install --legacy-peer-deps
```

#### مشكلة الحزم المفقودة - Missing Dependencies:
```bash
# في المجلد الرئيسي
npm install

# في مجلد العميل
cd client
npm install --legacy-peer-deps
```

---

### 4. مشاكل تشغيل التطبيق - Application Startup Issues

#### تشغيل الخادم فقط - Server Only:
```bash
npm start
# أو
node server.js
```

#### تشغيل العميل فقط - Client Only:
```bash
cd client
npm start
```

#### تشغيل كامل (خادم + عميل) - Full Stack:
```bash
npm run dev
```

---

### 5. فحص حالة الخدمات - Service Health Check

#### فحص حالة الخادم - Check Server Status:
```bash
curl http://localhost:5000/api/health
```

#### فحص حالة MongoDB:
```bash
# فحص العملية
ps aux | grep mongod

# فحص الاتصال
mongo --eval "db.adminCommand('ismaster')"
```

---

### 6. رسائل الخطأ الشائعة - Common Error Messages

#### "قاعدة البيانات غير متاحة حالياً"
**الحل:** تأكد من تشغيل MongoDB
```bash
./setup-mongodb.sh
```

#### "المستخدم موجود بالفعل"
**الحل:** استخدم بريد إلكتروني مختلف للتسجيل

#### "البريد الإلكتروني أو كلمة المرور غير صحيحة"
**الحل:** تأكد من البيانات أو أعد إنشاء حساب المدير

---

### 7. إعادة تعيين التطبيق - Reset Application

#### إعادة تعيين قاعدة البيانات - Reset Database:
```bash
# حذف قاعدة البيانات
mongo nafsyetak-clinic --eval "db.dropDatabase()"

# إعادة إنشاء المدير
node seedAdmin.js
```

#### إعادة تثبيت الحزم - Reinstall Packages:
```bash
# حذف node_modules
rm -rf node_modules client/node_modules

# إعادة التثبيت
npm install
cd client && npm install --legacy-peer-deps
```

---

## الدعم الفني - Technical Support

إذا لم تحل المشاكل أعلاه المشكلة:

1. تأكد من إصدار Node.js (يفضل 16+ أو 18+)
2. تحقق من logs الخادم للحصول على تفاصيل الخطأ
3. تأكد من أن جميع المنافذ (5000, 3000, 27017) متاحة
4. فحص إعدادات الشبكة والـ firewall

### فحص المنافذ - Check Ports:
```bash
# فحص المنافذ المستخدمة
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000
netstat -tulpn | grep :27017
```