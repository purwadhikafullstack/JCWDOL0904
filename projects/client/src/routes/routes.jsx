import { Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { Register } from "../pages/register";
import { Verification } from "../pages/verification";
import { ResetPassword } from "../pages/resetPassword";
import { InputPassword } from "../pages/inputPassword";
import ProductDetail from "../pages/ProductDetail";

import { Transaction } from "../pages/Transactions";

import ProtectedPage from "./protectedPage";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ManageWarehouse from "../pages/admin/ManageWarehouse";
import OrderDetailModal from "../components/admin/OrderDetailModal";
import SendRequestMutation from "../pages/admin/SendRequestMutation";
import ManageMutation from "../pages/admin/ManageMutation";
import Profile from "../pages/Profile";
import Error from "../pages/Error";
import ManageCategory from "../pages/admin/ManageCategory";
import MutationList from "../pages/admin/MutationList";
import ManageProduct from "../pages/admin/ManageProduct";
import ManageUser from "../pages/admin/ManageUser";
import { PaymentProofModal } from "../components/admin/PaymentProofModal";
import OrderList from "../pages/admin/OrderList";
import Notification from "../pages/Notification";
import NotificationDetailModal from "../components/NotificationDetailModal";
import AdminNotification from "../pages/admin/AdminNotification";
import ManageStock from "../pages/admin/ManageStock";
import SalesReport from "../pages/admin/SalesReport";
import { EkspedisiAdmin } from "../pages/admin/EkspedisiAdmin";
import StockHistory from "../pages/admin/StockHistory";
import Dashboard from "../pages/admin/Dashboard";

const routes = [
  <Route
    key="home"
    path="/"
    element={
      <ProtectedPage guestOnly={true}>
        <Homepage />
      </ProtectedPage>
    }
  />,
  <Route
    key="cart"
    path="/cart"
    element={
      <ProtectedPage needLogin={true}>
        <Cart />
      </ProtectedPage>
    }
  />,
  <Route
    key="checkout"
    path="/checkout"
    element={
      <ProtectedPage needLogin={true}>
        <Checkout />
      </ProtectedPage>
    }
  />,
  <Route
    key="register"
    path="/register"
    element={
      <ProtectedPage guestOnly={true}>
        <Register />
      </ProtectedPage>
    }
  />,
  <Route
    key="verification"
    path="/verification/:token"
    element={
      <ProtectedPage guestOnly={true}>
        <Verification />
      </ProtectedPage>
    }
  />,
  <Route
    key="detail"
    path="/detail"
    element={
      <ProtectedPage guestOnly={true}>
        <ProductDetail />
      </ProtectedPage>
    }
  />,
  <Route
    key="transactions"
    path="/transactions"
    element={
      <ProtectedPage needLogin={true}>
        <Transaction />
      </ProtectedPage>
    }
  />,
  <Route
    key="requset"
    path="/request"
    element={
      <ProtectedPage guestOnly={true}>
        <ResetPassword />
      </ProtectedPage>
    }
  />,
  <Route
    key="input-password"
    path="/inputpassword/:token"
    element={
      <ProtectedPage guestOnly={true}>
        <InputPassword />
      </ProtectedPage>
    }
  />,
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedPage needLogin={true}>
        <Profile />
      </ProtectedPage>
    }
  />,
  <Route
    key="404"
    path="/404"
    element={
      <ProtectedPage>
        <Error />
      </ProtectedPage>
    }
  />,

  <Route
    key="car"
    path="/car"
    element={
      <ProtectedPage needLogin={true}>
        <OrderDetailModal />
      </ProtectedPage>
    }
  />,
  <Route
    key="notification"
    path="/notification"
    element={
      <ProtectedPage needLogin={true}>
        <Notification />
      </ProtectedPage>
    }
  />,
  <Route
    key="nd"
    path="/nd"
    element={
      <ProtectedPage needLogin={true}>
        <NotificationDetailModal />
      </ProtectedPage>
    }
  />,
  // admin
  <Route
    key="manage-warehouse"
    path="/manage-warehouse"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageWarehouse />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-mutation"
    path="/manage-mutation"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageMutation />
      </ProtectedPage>
    }
  />,
  <Route
    key="send-request-mutation"
    path="/send-request-mutation"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <SendRequestMutation />
      </ProtectedPage>
    }
  />,
  <Route
    key="mutation-list"
    path="/mutation-list"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <MutationList />
      </ProtectedPage>
    }
  />,
  <Route
    key="order"
    path="/order"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <OrderList />
      </ProtectedPage>
    }
  />,
  <Route
    key="proof"
    path="/proof"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <PaymentProofModal />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-category"
    path="/manage-category"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageCategory />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-product"
    path="/manage-product"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageProduct />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-user"
    path="/manage-user"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageUser />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-category"
    path="/manage-category"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageCategory />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-product"
    path="/manage-product"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageProduct />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-user"
    path="/manage-user"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageUser />
      </ProtectedPage>
    }
  />,
  <Route
    key="admin-notification"
    path="/admin-notification"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <AdminNotification />
      </ProtectedPage>
    }
  />,
  <Route
    key="manage-stock"
    path="/manage-stock"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageStock />
      </ProtectedPage>
    }
  />,
  <Route
    key="sales-report"
    path="/sales-report"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <SalesReport />
      </ProtectedPage>
    }
  />,
  <Route
    key="stock-history"
    path="/stock-history"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <StockHistory />
      </ProtectedPage>
    }
  />,
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <Dashboard />
      </ProtectedPage>
    }
  />,
  <Route
    key="ekspedisi"
    path="/ekspedisi"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <EkspedisiAdmin />
      </ProtectedPage>
    }
  />,
];

export default routes;
