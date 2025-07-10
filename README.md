# Lyna Psychology Clinic Website

A modern, responsive website for a psychology clinic built with React.js, Node.js, Express.js, and MongoDB.

## Features

- **Modern Design**: Beautiful, responsive design with smooth animations
- **Appointment Booking**: Online appointment booking system
- **Service Management**: Display and manage psychological services
- **Contact Forms**: Contact and inquiry forms with email notifications
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Admin Dashboard**: Manage appointments and contact messages
- **MongoDB Database**: Store appointments, contacts, and services data

## Tech Stack

### Frontend
- **React.js** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lynapsychology
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Start the server**
   ```bash
   npm run server
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

### Running Both (Development)

From the root directory:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Project Structure

```
lynapsychology-clone/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── models/                 # MongoDB models
│   ├── Appointment.js
│   └── Contact.js
├── routes/                 # API routes
│   ├── appointments.js
│   ├── contact.js
│   └── services.js
├── server.js              # Express server
├── package.json
└── README.md
```

## API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PATCH /api/appointments/:id` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment

### Contact
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit contact form
- `DELETE /api/contact/:id` - Delete contact message

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get specific service

## Pages

1. **Home** (`/`) - Landing page with hero section, features, and testimonials
2. **Services** (`/services`) - Display all psychological services
3. **About** (`/about`) - Team information and clinic details
4. **Contact** (`/contact`) - Contact form and information
5. **Book Appointment** (`/book-appointment`) - Appointment booking form

## Features in Detail

### Appointment Booking System
- Select service type
- Choose preferred date and time
- Personal information collection
- Form validation
- Success/error handling

### Contact Management
- Contact form with validation
- Message storage in database
- Admin access to view messages

### Service Management
- Display services with pricing
- Service descriptions and durations
- Dynamic service loading from API

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Smooth animations and transitions

## Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy using Git:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify/Vercel)
1. Build the project:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact:
- Email: info@lynapsychology.com
- Phone: +1 (555) 123-4567

## Screenshots

[Add screenshots of your application here]

---

**Note**: This is a clone/educational project. For production use, ensure proper security measures, data validation, and error handling are implemented.