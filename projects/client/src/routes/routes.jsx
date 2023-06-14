import { Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { Register } from "../pages/register";

import { Verification } from "../pages/verification";

import { Login } from "../pages/Login";

import { TestImage } from "../pages/TestImage";

import ProductDetail from "../pages/ProductDetail";

import Test from "../pages/Test";
import ProtectedPage from "./protectedPage";
import Cart2 from "../pages/Cart2";
import Checkout from "../pages/Checkout";
import ManageWarehouse from "../pages/admin/ManageWarehouse";

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
        <Cart2 />
      </ProtectedPage>
    }
  />,
  <Route
    key="checkout"
    path="/checkout"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
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
    key="test"
    path="/manage-warehouse"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <ManageWarehouse />
      </ProtectedPage>
    }
  />,
];

export default routes;
