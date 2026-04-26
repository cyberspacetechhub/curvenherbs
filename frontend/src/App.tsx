import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import PageLoader from '@/components/PageLoader';
import { Routes, Route, Outlet } from 'react-router-dom';

// ── Public Pages ──────────────────────────────────────────────────────────────
const HomePage           = lazy(() => import('@/pages/public/home'));
const ShopPage           = lazy(() => import('@/pages/public/shop'));
const ProductDetailPage  = lazy(() => import('@/pages/public/product'));
const CheckoutPage       = lazy(() => import('@/pages/public/checkout'));
const TrackOrderPage     = lazy(() => import('@/pages/public/track'));
const OrderTrackingPage  = lazy(() => import('@/pages/public/order'));
const AboutPage          = lazy(() => import('@/pages/public/about'));
const ContactPage        = lazy(() => import('@/pages/public/contact'));
const TestimonyPage      = lazy(() => import('@/pages/public/testimony'));
const { LoginPage, RegisterPage } = {
  LoginPage:    lazy(() => import('@/pages/public/auth').then(m => ({ default: m.LoginPage }))),
  RegisterPage: lazy(() => import('@/pages/public/auth').then(m => ({ default: m.RegisterPage }))),
};

// ── Admin Pages ───────────────────────────────────────────────────────────────
const DashboardPage        = lazy(() => import('@/pages/admin/dashboard'));
const AdminProductsPage    = lazy(() => import('@/pages/admin/products'));
const AdminOrdersPage      = lazy(() => import('@/pages/admin/orders'));
const AdminReviewsPage     = lazy(() => import('@/pages/admin/reviews'));
const AdminTestimoniesPage = lazy(() => import('@/pages/admin/testimonies'));
const AdminNewsletterPage  = lazy(() => import('@/pages/admin/newsletter'));
const AdminMessagesPage    = lazy(() => import('@/pages/admin/messages'));
const AdminAdminsPage      = lazy(() => import('@/pages/admin/admins'));
const AdminCouponsPage     = lazy(() => import('@/pages/admin/coupons'));

function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration to handle it manually
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Save scroll position before leaving the page
    const handleRouteChange = () => {
      sessionStorage.setItem(`scroll-pos-${window.location.pathname}`, window.scrollY.toString());
    };

    // Restore scroll position on initial load for current path
    const savedScrollPos = sessionStorage.getItem(`scroll-pos-${window.location.pathname}`);
    if (savedScrollPos) {
      const pos = parseInt(savedScrollPos, 10);
      window.scrollTo({ top: pos, behavior: 'auto' });
    }

    // Scroll to top on navigation (except when going back/forward)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.addEventListener('beforeunload', handleRouteChange);
    return () => {
      handleRouteChange();
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, [location]);

  return null;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ScrollRestoration />
      <Routes>
        {/* ── Public ── */}
        <Route element={<PublicLayout><Outlet /></PublicLayout>}>
          <Route path="/"                      element={<HomePage />} />
          <Route path="/shop"                  element={<ShopPage />} />
          <Route path="/shop/:slug"            element={<ProductDetailPage />} />
          <Route path="/checkout"              element={<CheckoutPage />} />
          <Route path="/orders/track"          element={<TrackOrderPage />} />
          <Route path="/orders/:id/tracking"   element={<OrderTrackingPage />} />
          <Route path="/about"                 element={<AboutPage />} />
          <Route path="/contact"               element={<ContactPage />} />
          <Route path="/testimony"             element={<TestimonyPage />} />
        </Route>

        {/* ── Auth (no layout) ── */}
        <Route path="/login"                   element={<LoginPage />} />
        <Route path="/register"                element={<RegisterPage />} />

        {/* ── Admin ── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin"                 element={<DashboardPage />} />
          <Route path="/admin/products"        element={<AdminProductsPage />} />
          <Route path="/admin/orders"          element={<AdminOrdersPage />} />
          <Route path="/admin/reviews"         element={<AdminReviewsPage />} />
          <Route path="/admin/testimonies"     element={<AdminTestimoniesPage />} />
          <Route path="/admin/newsletter"      element={<AdminNewsletterPage />} />
          <Route path="/admin/messages"        element={<AdminMessagesPage />} />
          <Route path="/admin/admins"          element={<AdminAdminsPage />} />
          <Route path="/admin/coupons"          element={<AdminCouponsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
