import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import SearchModal from './components/SearchModal';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import NotFoundPage from './pages/NotFoundPage';
import DocumentMeta from './components/common/DocumentMeta';

// Admin Architecture - Client Admin
import { AuthProvider } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import CartDrawer from './components/cart/CartDrawer';
import WishlistDrawer from './components/wishlist/WishlistDrawer';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminDiscountsPage from './pages/admin/AdminDiscountsPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminStoreSettingsPage from './pages/admin/AdminStoreSettingsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Admin Architecture - Super Admin (Developer)
import SuperAdminLayout from './components/superAdmin/SuperAdminLayout';
import SuperAdminLoginPage from './pages/superAdmin/SuperAdminLoginPage';
import SuperAdminDashboardPage from './pages/superAdmin/SuperAdminDashboardPage';
import SuperAdminHomepagePage from './pages/superAdmin/SuperAdminHomepagePage';
import SuperAdminPagesPage from './pages/superAdmin/SuperAdminPagesPage';
import SuperAdminBrandingPage from './pages/superAdmin/SuperAdminBrandingPage';
import SuperAdminNavigationPage from './pages/superAdmin/SuperAdminNavigationPage';
import SuperAdminConfigPage from './pages/superAdmin/SuperAdminConfigPage';
import SuperAdminProfilePage from './pages/superAdmin/SuperAdminProfilePage';

import { X, Shield, FileText, AlertTriangle } from 'lucide-react';

// Public Customer-Facing Layout Wrapper
function PublicLayout({ onOpenPrivacy, onOpenTerms }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { content } = useContent();
  const { openCart } = useCart();

  const maintenanceMode = content?.settings?.maintenanceMode;

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F4F2] flex flex-col font-body selection:bg-[#C8202B] selection:text-[#F5F4F2]">
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

      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar />

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

      {/* Dedicated Route Views */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 3. Global Footer */}
      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenTerms={onOpenTerms}
      />
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
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/faq" element={<FAQPage />} />
                      <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-of-service" element={<TermsPage />} />
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

            {/* Privacy Policy Modal */}
          {privacyModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-lg bg-[#161616] border border-[#2E2E2E] p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
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

                <div className="pt-4 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setPrivacyModalOpen(false)}
                    className="w-full py-3 bg-[#242424] hover:bg-[#2C2C2C] text-[#F5F4F2] font-heading uppercase text-sm tracking-widest transition-colors"
                  >
                    Close
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
              <div className="w-full max-w-lg bg-[#161616] border border-[#2E2E2E] p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C8202B]">
                    <FileText className="w-4 h-4" />
                    <span>Terms & Conditions</span>
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
                    Terms of Service
                  </h3>
                  <p>
                    Welcome to the official digital platform of RK Nutrition. By exploring this website, you agree to these terms.
                  </p>
                  <div className="space-y-2">
                    <span className="font-heading text-base text-[#F5F4F2] uppercase block">
                      1. Brand Content & Intellectual Property
                    </span>
                    <p className="text-xs">
                      All formulations, visual branding, typography, and trade copy are the property of RK Nutrition. Unauthorized duplication is strictly prohibited.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="font-heading text-base text-[#F5F4F2] uppercase block">
                      2. Product Specifications
                    </span>
                    <p className="text-xs">
                      Informational specifications are intended for guidance and athlete education. Individuals should review ingredient listings for personal dietary compatibility before undertaking intense supplementation.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(false)}
                    className="w-full py-3 bg-[#242424] hover:bg-[#2C2C2C] text-[#F5F4F2] font-heading uppercase text-sm tracking-widest transition-colors"
                  >
                    Close
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
