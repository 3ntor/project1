# Nafsyetak Psychology Clinic Website

A full-stack bilingual (Arabic/English) psychology clinic website built with React.js, Node.js, Express.js, and MongoDB.

## 🌟 Features

### 🔐 User Authentication & Authorization
- **Guest Users**: Can browse all public pages (Home, Services, Blog, Doctor, Contact, FAQs)
- **Registered Users**: Can book appointments and view their own bookings
- **Admin**: Full system access with dashboard for managing users, bookings, and blog posts

### 🌍 Bilingual Support
- **Arabic (RTL)** and **English (LTR)** language support
- Dynamic language switching with i18next
- Proper RTL/LTR layout adjustments
- Localized content for all pages

### 📱 Pages & Components

#### Public Pages
- **Home Page**: Introduction, services overview, testimonials, and call-to-action
- **Services Page**: 5 psychological therapy services with detailed descriptions
- **Doctor Page**: Professional profile, certifications, and biography
- **Blog Page**: Mental health articles and resources
- **FAQ Page**: Common questions about mental health and services
- **Contact Page**: Contact form and clinic information

#### User-Specific Pages
- **Booking Page**: Appointment scheduling with service selection and time slots
- **Login/Signup**: User authentication with role-based access

#### Admin Features
- **Admin Dashboard**: Statistics and system overview
- **User Management**: View and manage all registered users
- **Booking Management**: View, confirm, or cancel all appointments
- **Blog Management**: Create, edit, and delete blog posts

### 🎨 Design Features
- **Modern UI/UX**: Clean, professional design with gradient backgrounds
- **Responsive Design**: Mobile-first approach with full responsiveness
- **RTL/LTR Support**: Proper layout adjustments for both languages
- **Accessibility**: WCAG compliant design principles

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **React i18next** - Internationalization
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Development Tools
- **Concurrently** - Run multiple commands
- **Nodemon** - Development server
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nafsyetak-clinic
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install --legacy-peer-deps
cd ..
```

4. **Environment Setup**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nafsyetak-clinic
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
JWT_EXPIRE=7d

# Admin credentials
ADMIN_EMAIL=admin@nafsyetak.com
ADMIN_PASSWORD=admin123

# Email configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

5. **Start the development server**
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

### Default Admin Account
- **Email**: admin@nafsyetak.com
- **Password**: admin123

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Booking Routes
- `POST /api/bookings` - Create new booking (authenticated users)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/all` - Get all bookings (admin only)
- `GET /api/bookings/available-times/:date` - Get available time slots
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Admin Routes
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings with pagination
- `PATCH /api/admin/bookings/:id/status` - Update booking status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/search` - Search users
- `GET /api/admin/bookings/search` - Search bookings

### Other Routes
- `GET /api/health` - Health check
- `GET /api/blog` - Get blog posts
- `GET /api/services` - Get services
- `GET /api/faqs` - Get FAQs
- `POST /api/contact` - Send contact message

## 🎯 Key Features Implementation

### Role-Based Access Control (RBAC)
- **Guests**: Public pages only
- **Users**: Public pages + booking functionality
- **Admin**: Full system access

### Booking System
- Service selection from 5 therapy types
- Date and time slot selection
- Real-time availability checking
- Booking status management (pending, confirmed, cancelled)

### Multilingual Support
- Dynamic language switching
- RTL/LTR layout support
- Localized content with i18next
- Arabic and English translations

### Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet security headers

## 📱 Services Offered

1. **Individual Therapy** (60 min - 500 EGP)
2. **Couples Therapy** (90 min - 800 EGP)
3. **Family Therapy** (90 min - 750 EGP)
4. **Anxiety Treatment** (60 min - 550 EGP)
5. **Depression Therapy** (60 min - 550 EGP)

## 🔧 Development Scripts

```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build

# Install client dependencies
npm run install-client
```

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Update the `.env` file with production values:
- Set `NODE_ENV=production`
- Use production MongoDB URI
- Update CORS origins
- Set secure JWT secret

### Deployment Platforms
- **Heroku**: Use provided `heroku-postbuild` script
- **Vercel**: Deploy frontend separately
- **DigitalOcean**: Use PM2 for process management
- **AWS**: Use EC2 with nginx reverse proxy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js community for excellent documentation
- i18next for internationalization support
- MongoDB for flexible data storage
- All contributors who helped improve this project

## 📞 Support

For support, email support@nafsyetak.com or create an issue in the repository.

---

**Nafsyetak Psychology Clinic** - Your journey to mental wellness starts here. 🌟