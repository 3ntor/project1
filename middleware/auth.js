const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'يحتاج تسجيل الدخول' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.adminId) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(403).json({ message: 'غير مصرح' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'خطأ في التحقق من الصلاحيات' });
  }
};

module.exports = {
  requireAdmin
};
