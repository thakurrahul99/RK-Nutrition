import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';

import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/common/FloatingWhatsApp';
import DocumentMeta from './components/common/DocumentMeta';

// Core public landing page directly imported for instant First Contentful Paint
import HomePage from './pages/HomePage';

// Lazy loaded public pages
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy loaded Customer Authentication & Account Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));

// Admin Architecture - Client Admin
import { AuthProvider } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './components/cart/CartDrawer';
import WishlistDrawer from './components/wishlist/WishlistDrawer';

const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProductListPage = lazy(() => import('./pages/admin/AdminProductListPage'));
const AdminProductFormPage = lazy(() => import('./pages/admin/AdminProductFormPage'));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage'));
const AdminInventoryPage = lazy(() => import('./pages/admin/AdminInventoryPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminDiscountsPage = lazy(() => import('./pages/admin/AdminDiscountsPage'));
const AdminInquiriesPage = lazy(() => import('./pages/admin/AdminInquiriesPage'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage'));
const AdminStoreSettingsPage = lazy(() => import('./pages/admin/AdminStoreSettingsPage'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));

// Admin Architecture - Super Admin (Developer)
const SuperAdminLayout = lazy(() => import('./components/superAdmin/SuperAdminLayout'));
const SuperAdminLoginPage = lazy(() => import('./pages/superAdmin/SuperAdminLoginPage'));
const SuperAdminDashboardPage = lazy(() => import('./pages/superAdmin/SuperAdminDashboardPage'));
const SuperAdminHomepagePage = lazy(() => import('./pages/superAdmin/SuperAdminHomepagePage'));
const SuperAdminPagesPage = lazy(() => import('./pages/superAdmin/SuperAdminPagesPage'));
const SuperAdminBrandingPage = lazy(() => import('./pages/superAdmin/SuperAdminBrandingPage'));
const SuperAdminNavigationPage = lazy(() => import('./pages/superAdmin/SuperAdminNavigationPage'));
const SuperAdminConfigPage = lazy(() => import('./pages/superAdmin/SuperAdminConfigPage'));
const SuperAdminProfilePage = lazy(() => import('./pages/superAdmin/SuperAdminProfilePage'));

import { X, Shield, AlertTriangle } from 'lucide-react';

// Subtle dark spinner fallback for lazy-loaded routes
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E11D2E] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Public Customer-Facing Layout Wrapper
function PublicLayout({ onOpenPrivacy, onOpenTerms }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { content } = useContent();
  const { openCart } = useCart();

  const maintenanceMode = content?.settings?.maintenanceMode;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F4F2] flex flex-col font-body selection:bg-[#E11D2E] selection:text-[#F5F4F2] w-full max-w-full overflow-x-hidden">
      {/* Dynamic SEO Meta Injection */}
      <DocumentMeta />

      {/* Cart Drawer Slide-Over */}
      <CartDrawer />

      {/* Wishlist Drawer Slide-Over */}
      <WishlistDrawer />

      {/* Optional Maintenance Notice if enabled from Admin Settings */}
      {maintenanceMode && (
        <aside 
          aria-label="Maintenance Notice"
          className="bg-[#EAB308] text-black text-xs font-mono font-bold uppercase tracking-wider py-1.5 px-4 text-center flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Notice: Website maintenance mode is currently active. Public catalogue is in review status.</span>
        </aside>
      )}

      {/* 2. Global Navigation Header */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onCartClick={openCart}
      />

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onCartClick={openCart}
      />

      {/* Search Modal Interface */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Dedicated Route Views with Suspense */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* 3. Global Footer */}
      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenTerms={onOpenTerms}
      />

      {/* 4. Floating WhatsApp Support Desk */}
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  return (
    <AuthProvider>
      <ContentProvider>
        <ProductProvider>
          <CategoryProvider>
            <CartProvider>
              <WishlistProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public Customer Routes */}
                      <Route 
                        element={
                          <PublicLayout 
                            onOpenPrivacy={() => setPrivacyModalOpen(true)}
                            onOpenTerms={() => setTermsModalOpen(true)}
                          />
                        }
                      >
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/categories/:categoryId" element={<CategoryDetailPage />} />
                        <Route path="/product/:productId" element={<ProductDetailsPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/learn" element={<LearnPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-of-service" element={<TermsPage />} />

                        {/* Customer Authentication & Dashboard */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signin" element={<Navigate to="/login" replace />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/signup" element={<Navigate to="/register" replace />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/account" element={<AccountPage />} />
                      </Route>

                      {/* Client Admin Authentication (Standalone) */}
                      <Route path="/admin/login" element={<AdminLoginPage />} />

                      {/* Client Admin Console Routes (Store Operations) */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="products" element={<AdminProductListPage />} />
                        <Route path="products/new" element={<AdminProductFormPage />} />
                        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="inventory" element={<AdminInventoryPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="payments" element={<AdminPaymentsPage />} />
                        <Route path="discounts" element={<AdminDiscountsPage />} />
                        <Route path="inquiries" element={<AdminInquiriesPage />} />
                        <Route path="reports" element={<AdminReportsPage />} />
                        <Route path="store-settings" element={<AdminStoreSettingsPage />} />
                        <Route path="profile" element={<AdminProfilePage />} />
                      </Route>

                      {/* Super Admin Authentication (Standalone Developer Login) */}
                      <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />

                      {/* Super Admin Console Routes (Developer Technical & Content Management) */}
                      <Route path="/super-admin" element={<SuperAdminLayout />}>
                        <Route index element={<SuperAdminDashboardPage />} />
                        <Route path="homepage" element={<SuperAdminHomepagePage />} />
                        <Route path="pages" element={<SuperAdminPagesPage />} />
                        <Route path="branding" element={<SuperAdminBrandingPage />} />
                        <Route path="navigation" element={<SuperAdminNavigationPage />} />
                        <Route path="config" element={<SuperAdminConfigPage />} />
                        <Route path="profile" element={<SuperAdminProfilePage />} />
                      </Route>

                      {/* Dedicated 404 Route */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>

                  {/* Privacy Policy Modal */}
                  {privacyModalOpen && (
                    <div 
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div className="w-full max-w-lg bg-[#141414] border border-[#242424] p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
                            <Shield className="w-4 h-4" />
                            <span>Legal & Privacy</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPrivacyModalOpen(false)}
                            className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2]"
                            aria-label="Close dialog"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="py-6 space-y-4 overflow-y-auto font-body text-sm text-[#8C8C8C] leading-relaxed pr-2">
                          <h3 className="font-heading text-2xl text-[#F5F4F2] uppercase font-bold">
                            Privacy Policy
                          </h3>
                          <p>
                            At RK Nutrition, we value the privacy of our athletes and visitors. This informational platform does not collect, sell, or monetize personal tracking profiles.
                          </p>
                          <div className="space-y-2">
                            <span className="font-heading text-base text-[#F5F4F2] uppercase block">
                              1. Information Collection
                            </span>
                            <p className="text-xs">
                              Information provided via contact inquiries is utilized exclusively to respond to relevant correspondence regarding our athletic formulations.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="font-heading text-base text-[#F5F4F2] uppercase block">
                              2. Commercial Data Protection
                            </span>
                            <p className="text-xs">
                              No payment card details or financial transactions are captured on this site prior to full commercial rollout.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#222222]">
                          <button
                            type="button"
                            onClick={() => setPrivacyModalOpen(false)}
                            className="w-full py-3 bg-[#1C1C1C] hover:bg-[#262626] text-[#F5F4F2] font-heading uppercase text-sm tracking-widest transition-colors cursor-pointer"
                          >
                            Acknowledge & Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions Modal */}
                  {termsModalOpen && (
                    <div 
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div className="w-full max-w-lg bg-[#141414] border border-[#242424] p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
                        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E11D2E]">
                            <Shield className="w-4 h-4" />
                            <span>Terms of Service</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setTermsModalOpen(false)}
                            className="p-1 text-[#8C8C8C] hover:text-[#F5F4F2]"
                            aria-label="Close dialog"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="py-6 space-y-4 overflow-y-auto font-body text-sm text-[#8C8C8C] leading-relaxed pr-2">
                          <h3 className="font-heading text-2xl text-[#F5F4F2] uppercase font-bold">
                            Terms & Conditions
                          </h3>
                          <p>
                            Welcome to RK Nutrition. By using this website, you agree to comply with our terms regarding informational content and product usage standards.
                          </p>
                          <div className="space-y-2">
                            <span className="font-heading text-base text-[#F5F4F2] uppercase block">
                              1. Educational Purpose
                            </span>
                            <p className="text-xs">
                              All nutritional metrics and supplement education provided herein are for general informational purposes only. Consult a qualified sports physician before initiating intensive supplement regimens.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <span className="font-heading text-base text-[#F5F4F2] uppercase block">
                              2. Formulation Integrity
                            </span>
                            <p className="text-xs">
                              We guarantee honest labeling and unadulterated ingredient profiles in compliance with Indian dietary supplement regulations.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-[#222222]">
                          <button
                            type="button"
                            onClick={() => setTermsModalOpen(false)}
                            className="w-full py-3 bg-[#1C1C1C] hover:bg-[#262626] text-[#F5F4F2] font-heading uppercase text-sm tracking-widest transition-colors cursor-pointer"
                          >
                            Acknowledge & Close
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </CategoryProvider>
        </ProductProvider>
      </ContentProvider>
    </AuthProvider>
  );
}
