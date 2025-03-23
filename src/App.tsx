import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Keys from './pages/Keys';
import Games from './pages/Games';
import Balance from './pages/Balance';
import FAQ from './pages/FAQ';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/profile/Profile';
import ProductForm from './pages/profile/ProductForm';
import MyProducts from './pages/profile/MyProducts';
import Notifications from './pages/profile/Notifications';
import Cart from './pages/cart/Cart';
import AccountDetail from './pages/account/AccountDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRoute from './components/admin/AdminRoute';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import ProductDetail from './pages/product/ProductDetail';
import AdminProductCategories from './pages/admin/AdminProductCategories';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminUserCredentials from './pages/admin/AdminUserCredentials';
import AdminAddProduct from './pages/admin/AdminAddProduct';

// Wrapper component for admin routes
const AdminRouteWrapper = () => {
  return (
    <AdminRoute>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<AdminUserDetail />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/add" element={<AdminAddProduct />} />
        <Route path="categories" element={<AdminProductCategories />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="site-settings" element={<AdminSiteSettings />} />
        <Route path="user-credentials" element={<AdminUserCredentials />} />
      </Routes>
    </AdminRoute>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="accounts/:accountId" element={<AccountDetail />} />
        <Route path="keys" element={<Keys />} />
        <Route path="keys/:keyId" element={<ProductDetail />} />
        <Route path="games" element={<Games />} />
        <Route path="games/:gameId" element={<ProductDetail />} />
        <Route path="balance" element={<Balance />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/products" element={<MyProducts />} />
        <Route path="profile/products/new" element={<ProductForm />} />
        <Route path="profile/products/edit/:productId" element={<ProductForm />} />
        <Route path="profile/notifications" element={<Notifications />} />
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/adminpaneel" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminRouteWrapper />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
