import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Chatbot from './components/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AppAdminLayout from './components/AppAdminLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MyOrdersPage from './pages/MyOrdersPage'
import LocationPage from './pages/LocationPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEvents from './pages/admin/AdminEvents'
import EventForm from './pages/admin/EventForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AppAdminDashboard from './pages/app-admin/AppAdminDashboard'
import AppAdminUsers from './pages/app-admin/AppAdminUsers'
import AppAdminEvents from './pages/app-admin/AppAdminEvents'
import AppAdminOrders from './pages/app-admin/AppAdminOrders'
import AppAdminAnalytics from './pages/app-admin/AppAdminAnalytics'
import AppAdminCategories from './pages/app-admin/AppAdminCategories'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Event Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute roles={['event_admin', 'app_admin']}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="events" element={<AdminEvents />} />
                    <Route path="events/create" element={<EventForm />} />
                    <Route path="events/edit/:id" element={<EventForm />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* App Admin Routes */}
            <Route path="/app-admin/*" element={
              <ProtectedRoute roles={['app_admin']}>
                <AppAdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AppAdminDashboard />} />
                    <Route path="users" element={<AppAdminUsers />} />
                    <Route path="categories" element={<AppAdminCategories />} />
                    <Route path="events" element={<AppAdminEvents />} />
                    <Route path="events/edit/:id" element={<EventForm />} />
                    <Route path="orders" element={<AppAdminOrders />} />
                    <Route path="analytics" element={<AppAdminAnalytics />} />
                  </Routes>
                </AppAdminLayout>
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="*" element={
              <div className="min-h-screen bg-[#0B0D1A]">
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/event/:id" element={<EventDetailPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/location" element={<LocationPage />} />
                </Routes>
                <Footer />
                <Chatbot />
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
