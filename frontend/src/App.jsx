import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import CheckoutNavbar from "./components/CheckOutNavbar";
import Checkout from "./pages/Checkout";
import ShoppingBag from "./components/ShoppingBag";
import ContactUs from "./pages/ContactUs";
import AlreadyInCartModal from "./components/AlreadyInCartModal";
import CartDrawer from "./components/CartDrawer";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import UserAccount from "./auth/UserAccount";
import ProtectedRoute from "./auth/ProtectedRoute";
import { RecentlyViewedProvider } from "./context/RecentlyViewedProducts";
import NewsletterModal from "./components/NewsLetterModal";
import SearchResults from "./pages/SearchResults";
import CollectionsPage from "./pages/CollectionsPage";
import DynamicCollectionPage from "./pages/DynamicCollectionPage";

//nav
import BlackDresses from "./pages/navpages/dresses/BlackDresses";
import BlueDresses from "./pages/navpages/dresses/BlueDresses";
import BrownDresses from "./pages/navpages/dresses/BrownDresses";
import BubblehemDresses from "./pages/navpages/dresses/BubblehemDresses";
import CorsetDresses from "./pages/navpages/dresses/CorsetDresses";
import EmbelishmentDresses from "./pages/navpages/dresses/EmbelishmentDresses";
import FlowyDresses from "./pages/navpages/dresses/FlowyDresses";
import FormalDresses from "./pages/navpages/dresses/FormalDresses";
import GreenDresses from "./pages/navpages/dresses/GreenDresses";
import MaxiDresses from "./pages/navpages/dresses/MaxiDresses";
import MidiDresses from "./pages/navpages/dresses/MidiDresses";
import MiniDresses from "./pages/navpages/dresses/MiniDresses";
import PartyDresses from "./pages/navpages/dresses/PartyDresses";
import PinkDresses from "./pages/navpages/dresses/PinkDresses";
import PromDresses from "./pages/navpages/dresses/PromDresses";
import RedDresses from "./pages/navpages/dresses/RedDresses";
import WeddingGuestDresses from "./pages/navpages/dresses/WeddingGuestDresses";
import WhiteDresses from "./pages/navpages/dresses/WhiteDresses";
import YellowDresses from "./pages/navpages/dresses/YellowDresses";
import Dresses from "./pages/navpages/dresses/Dresses";

// Admin CMS imports
import Dashboard from "./admin/Dashboard";
import SectionForm from "./admin/forms/SectionForm";
import BannerForm from "./admin/forms/BannerForm";
import NavImageForm from "./admin/forms/NavImageForm";
import LayoutForm from "./admin/forms/LayoutForm";
import MediaForm from "./admin/forms/MediaForm";
import ProductRelationshipForm from "./admin/forms/ProductRelationshipForm";
import FeaturedProductsForm from "./admin/forms/FeaturedProductsForm";
import ShopBannerForm from "./admin/forms/ShopBannerForm";
import PromoSectionForm from "./admin/forms/PromoSectionForm";
import ShopHeaderForm from "./admin/forms/ShopHeaderForm";
import ServicesPage from "./pages/ServicesPage";
import CollectionHeroForm from "./admin/forms/CollectionHeroForm";
import CollectionForm from "./admin/forms/CollectionForm";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetailsPage";
import NotFound from "./pages/NotFound";
import HeroForm from "./admin/forms/HeroForm";

// Admin Authentication imports
import { AdminAuthProvider } from "./admin/AdminAuthProvider";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminSignIn from "./admin/AdminSignIn";

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  // Check if current route is an admin route (but not the login page)
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";

  // Check if current route is a checkout route
  const checkoutPaths = ["/Checkout"];
  const isCheckoutRoute = checkoutPaths.includes(path);

  // Handle admin login route separately (no protection needed)
  if (path === "/admin/login") {
    return (
      <>
        <Toaster />
        <Routes>
          <Route path="/admin/login" element={<AdminSignIn />} />
        </Routes>
      </>
    );
  }

  // Handle protected admin routes
  if (isAdminRoute) {
    return (
      <>
        <Toaster />
        <Routes>
          {/* Protected Admin routes */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/sections/new" element={
            <AdminProtectedRoute>
              <SectionForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/sections/edit/:id" element={
            <AdminProtectedRoute>
              <SectionForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/banners/new" element={
            <AdminProtectedRoute>
              <BannerForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/banners/edit/:id" element={
            <AdminProtectedRoute>
              <BannerForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/shop-banner/new" element={
            <AdminProtectedRoute>
              <ShopBannerForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/shop-banner/edit/:id" element={
            <AdminProtectedRoute>
              <ShopBannerForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/featured-products/new" element={
            <AdminProtectedRoute>
              <FeaturedProductsForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/featured-products/edit/:sectionId" element={
            <AdminProtectedRoute>
              <FeaturedProductsForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/nav-images/new" element={
            <AdminProtectedRoute>
              <NavImageForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/nav-images/edit/:id" element={
            <AdminProtectedRoute>
              <NavImageForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/layouts/new" element={
            <AdminProtectedRoute>
              <LayoutForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/layouts/edit/:id" element={
            <AdminProtectedRoute>
              <LayoutForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/media/new" element={
            <AdminProtectedRoute>
              <MediaForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/media/edit/:id" element={
            <AdminProtectedRoute>
              <MediaForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/product-relationships/new" element={
            <AdminProtectedRoute>
              <ProductRelationshipForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/product-relationships/edit/:id" element={
            <AdminProtectedRoute>
              <ProductRelationshipForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/promo-section/new" element={
            <AdminProtectedRoute>
              <PromoSectionForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/promo-section/edit/:id" element={
            <AdminProtectedRoute>
              <PromoSectionForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/shop-header/new" element={
            <AdminProtectedRoute>
              <ShopHeaderForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/shop-header/edit/:id" element={
            <AdminProtectedRoute>
              <ShopHeaderForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/collection-hero/new" element={
            <AdminProtectedRoute>
              <CollectionHeroForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/collection-hero/edit/:id" element={
            <AdminProtectedRoute>
              <CollectionHeroForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/collections/new" element={
            <AdminProtectedRoute>
              <CollectionForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/collections/edit/:id" element={
            <AdminProtectedRoute>
              <CollectionForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/hero/new" element={
            <AdminProtectedRoute>
              <HeroForm />
            </AdminProtectedRoute>
          } />
          <Route path="/admin/hero/edit/:id" element={
            <AdminProtectedRoute>
              <HeroForm />
            </AdminProtectedRoute>
          } />
        </Routes>
      </>
    );
  }

  // Handle regular user routes
  return (
    <>
      {isCheckoutRoute ? <CheckoutNavbar /> : <Navbar />}
      <Toaster />
      <CartDrawer />
      <AlreadyInCartModal />
      <NewsletterModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/order-confirmation/:reference" element={<OrderConfirmation />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/shopping-bag" element={<ShoppingBag />} />
        <Route path="/shop/dresses" element={<Dresses />} />

        {/* Color-based Dress Routes */}
        <Route path="/shop/black-dresses" element={<BlackDresses />} />
        <Route path="/shop/white-dresses" element={<WhiteDresses />} />
        <Route path="/shop/red-dresses" element={<RedDresses />} />
        <Route path="/shop/blue-dresses" element={<BlueDresses />} />
        <Route path="/shop/green-dresses" element={<GreenDresses />} />
        <Route path="/shop/pink-dresses" element={<PinkDresses />} />
        <Route path="/shop/yellow-dresses" element={<YellowDresses />} />
        <Route path="/shop/brown-dresses" element={<BrownDresses />} />

        {/* Style-based Dress Routes */}
        <Route path="/shop/maxi-dresses" element={<MaxiDresses />} />
        <Route path="/shop/midi-dresses" element={<MidiDresses />} />
        <Route path="/shop/mini-dresses" element={<MiniDresses />} />
        <Route path="/shop/party-dresses" element={<PartyDresses />} />
        <Route path="/shop/formal-dresses" element={<FormalDresses />} />
        <Route path="/shop/wedding-guest-dresses" element={<WeddingGuestDresses />} />
        <Route path="/shop/prom-dresses" element={<PromDresses />} />
        <Route path="/shop/corset-dresses" element={<CorsetDresses />} />
        <Route path="/shop/bubblehem-dresses" element={<BubblehemDresses />} />
        <Route path="/shop/flowy-dresses" element={<FlowyDresses />} />
        <Route path="/shop/embelishment-dresses" element={<EmbelishmentDresses />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="*" element={<NotFound />} />

        {/* Protected routes that require authentication */}
        <Route path="/user-account" element={
          <ProtectedRoute>
            <UserAccount />
          </ProtectedRoute>
        } />

        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <Router>
                <AppContent />
              </Router>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}