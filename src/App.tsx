// src/App.tsx

import "./app.css";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store.js";

import CartPage from "./Pages/CartPage.js";
import Login from "./Pages/Login.js";
import SingUp from "./Pages/SingUp.js";
import Home from "./Pages/Home.js";
import ProductList from "./Pages/ProductList.js";
import ProductPage from "./Pages/ProductPage.js";
import ForgotPassword from "./Pages/ForgotPassword.js";
import ResetPassword from "./Pages/ResetPassword.js";
import PaymentSuccess from "./Pages/PaymentSuccess.js";
import MessageComponent from "./Component/MessageComponent.js";
import ScrollToTop from "./Component/ScrollToTop.js";
import OrdersPage from "./Pages/OrdersPage.js";
import UserSettings from "./Pages/UserSettings.js";

const IsNotLogin: React.FC = () => {
  const user = useSelector((state: RootState) => state.user?.currentUser);
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

const IsLogin: React.FC = () => {
  const user = useSelector((state: RootState) => state.user?.currentUser);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Routes for unauthenticated users */}
        <Route element={<IsNotLogin />}>
          <Route path="/login" element={<Login title="Login" />} />
          <Route path="/signup" element={<SingUp title="Sign up" />} />
          <Route
            path="/forgotpassword"
            element={<ForgotPassword title="Forgot Password" />}
          />
          <Route
            path="/resetpassword/:token"
            element={<ResetPassword title="Reset Password" />}
          />
        </Route>

        {/* Routes for authenticated users */}
        <Route element={<IsLogin />}>
          <Route path="/cart" element={<CartPage title="Cart" />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/paymentSuccess"
            element={<PaymentSuccess title="Payment Success" />}
          />
          <Route path="/setting" element={<UserSettings />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<Home title="Home" />} />
        <Route
          path="/products/:category"
          element={<ProductList title="Products" />}
        />
        <Route path="/product/:id" element={<ProductPage title="Product" />} />
      </Routes>

      <MessageComponent />
    </BrowserRouter>
  );
};

export default App;
