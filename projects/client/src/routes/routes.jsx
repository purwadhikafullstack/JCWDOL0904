import {Route} from "react-router-dom";
import Homepage from "../pages/Homepage";
import {Register} from "../pages/register";
import {Verification} from "../pages/verification";
import {Login} from "../pages/Login";
import {ResetPassword} from "../pages/resetPassword";
import {InputPassword} from "../pages/inputPassword";
import {TestImage} from "../pages/TestImage";
import ProductDetail from "../pages/ProductDetail";

import {Transaction} from "../pages/Transactions";

import Test from "../pages/Test";
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
import {PaymentProofModal} from "../components/admin/PaymentProofModal";
import OrderList from "../pages/admin/OrderList";

const routes = [
  //home
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
  <Route key="register" path="/register" element={<Register />} />,
  <Route
    key="verification"
    path="/verification/:token"
    element={<Verification />}
  />,

  <Route
    key="login"
    path="/login"
    element={
      <ProtectedPage guestOnly={true}>
        <Login />
      </ProtectedPage>
    }
  />,
  <Route key="image" path="/image" element={<TestImage />} />,
  <Route
    key="detail"
    path="/detail"
    element={
      <ProtectedPage>
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
      <ProtectedPage>
        <ResetPassword />
      </ProtectedPage>
    }
  />,
  <Route
    key="input-password"
    path="/inputpassword/:token"
    element={
      <ProtectedPage>
        <InputPassword />
      </ProtectedPage>
    }
  />,
  <Route
    key="profile"
    path="/profile"
    element={
      <ProtectedPage>
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
      <ProtectedPage>
        <OrderDetailModal />
      </ProtectedPage>
    }
  />,
  // admin
  <Route
    key="test"
    path="/test"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <Test />
      </ProtectedPage>
    }
  />,
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
    key="cek"
    path="/cek"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <TestImage />
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
];

export default routes;
