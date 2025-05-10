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

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  // Check if current route is an admin route
  const isAdminRoute = path.startsWith("/admin");

  // Check if current route is a checkout route
  const checkoutPaths = ["/Checkout"];
  const isCheckoutRoute = checkoutPaths.includes(path);

  // Don't show any navigation for admin routes
  if (isAdminRoute) {
    return (
      <>
        <Toaster />
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/sections/new" element={<SectionForm />} />
          <Route path="/admin/sections/edit/:id" element={<SectionForm />} />
          <Route path="/admin/banners/new" element={<BannerForm />} />
          <Route path="/admin/banners/edit/:id" element={<BannerForm />} />
           <Route path="/admin/shop-banner/new" element={<ShopBannerForm />} />
          <Route path="/admin/shop-banner/edit/:id" element={<ShopBannerForm />} />
          <Route
            path="/admin/featured-products/new"
            element={<FeaturedProductsForm />}
          />
          <Route
            path="/admin/featured-products/edit/:sectionId"
            element={<FeaturedProductsForm />}
          />
          <Route path="/admin/nav-images/new" element={<NavImageForm />} />
          <Route path="/admin/nav-images/edit/:id" element={<NavImageForm />} />
          <Route path="/admin/layouts/new" element={<LayoutForm />} />
          <Route path="/admin/layouts/edit/:id" element={<LayoutForm />} />
          <Route path="/admin/media/new" element={<MediaForm />} />
          <Route path="/admin/media/edit/:id" element={<MediaForm />} />
          <Route
            path="/admin/product-relationships/new"
            element={<ProductRelationshipForm />}
          />
          <Route
            path="/admin/product-relationships/edit/:id"
            element={<ProductRelationshipForm />}
          />
          <Route path="/admin/shop-banner/new" element={<ShopBannerForm />} />
          <Route
            path="/admin/shop-banner/edit/:id"
            element={<ShopBannerForm />}
          />
          <Route
            path="/admin/promo-section/new"
            element={<PromoSectionForm />}
          />
          <Route
            path="/admin/promo-section/edit/:id"
            element={<PromoSectionForm />}
          />
          <Route path="/admin/shop-header/new" element={<ShopHeaderForm />} />
          <Route
            path="/admin/shop-header/edit/:id"
            element={<ShopHeaderForm />}
          />
          <Route
            path="/admin/collection-hero/new"
            element={<CollectionHeroForm />}
          />
          <Route
            path="/admin/collection-hero/edit/:id"
            element={<CollectionHeroForm />}
          />
          <Route path="/admin/collections/new" element={<CollectionForm />} />
          <Route
            path="/admin/collections/edit/:id"
            element={<CollectionForm />}
          />
        </Routes>
      </>
    );
  }

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

        <Route
          path="/order-confirmation/:reference"
          element={<OrderConfirmation />}
        />
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
        <Route
          path="/shop/wedding-guest-dresses"
          element={<WeddingGuestDresses />}
        />
        <Route path="/shop/prom-dresses" element={<PromDresses />} />
        <Route path="/shop/corset-dresses" element={<CorsetDresses />} />
        <Route path="/shop/bubblehem-dresses" element={<BubblehemDresses />} />
        <Route path="/shop/flowy-dresses" element={<FlowyDresses />} />
        <Route
          path="/shop/embelishment-dresses"
          element={<EmbelishmentDresses />}
        />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="*" element={<NotFound />} />

        {/* Protected routes that require authentication */}
        <Route
          path="/user-account"
          element={
            <ProtectedRoute>
              <UserAccount />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <Router>
              <AppContent />
            </Router>
          </RecentlyViewedProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
