import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './i18n';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment';
import DoctorProfile from './pages/DoctorProfile';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogPostForm from './components/BlogPostForm';
import Loading from './components/Loading';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Public Routes - Accessible to all users (Guest, Registered, Admin) */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/doctor" element={<DoctorProfile />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                
                {/* Authentication Routes - Accessible to non-authenticated users */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Protected Routes - Registered Users Only (NOT Guests) */}
                <Route 
                  path="/booking" 
                  element={
                    <ProtectedRoute requireAuth={true}>
                      <BookAppointment />
                    </ProtectedRoute>
                  } 
                />
                
                                       {/* Admin Only Routes - Admin Users Only */}
                       <Route 
                         path="/admin" 
                         element={
                           <ProtectedRoute requireAdmin={true}>
                             <Admin />
                           </ProtectedRoute>
                         } 
                       />
                       <Route 
                         path="/admin/blog/new" 
                         element={
                           <ProtectedRoute requireAdmin={true}>
                             <BlogPostForm />
                           </ProtectedRoute>
                         } 
                       />
                       <Route 
                         path="/admin/blog/edit/:id" 
                         element={
                           <ProtectedRoute requireAdmin={true}>
                             <BlogPostForm />
                           </ProtectedRoute>
                         } 
                       />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
