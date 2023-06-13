import { Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { Register } from "../pages/register";
import { Verification } from "../pages/verification";
import { Login } from "../pages/Login";
import { ResetPassword } from "../pages/resetPassword";
import { InputPassword } from "../pages/inputPassword";
import { TestImage } from "../pages/TestImage";
import ProductDetail from "../pages/ProductDetail";
import Test from "../pages/Test";
import ProtectedPage from "./protectedPage";
import Cart2 from "../pages/Cart2";
import Checkout from "../pages/Checkout";
import Example from "../pages/Example";
import Error from "../pages/Error";

const routes = [
  //home
  <Route
    path="/"
    element={
      <ProtectedPage guestOnly={true}>
        <Homepage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/cart"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <Cart2 />
      </ProtectedPage>
    }
  />,
  <Route
    path="/checkout"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <Checkout />
      </ProtectedPage>
    }
  />,
  <Route path="/register" element={<Register />} />,
  <Route path="/verification/:token" element={<Verification />} />,

  <Route
    path="/login"
    element={
      <ProtectedPage guestOnly={true}>
        <Login />
      </ProtectedPage>
    }
  />,
  <Route path="/image" element={<TestImage />} />,
  <Route
    path="/detail"
    element={
      <ProtectedPage>
        <ProductDetail />
      </ProtectedPage>
    }
  />,
  <Route
    path="/detail"
    element={
      <ProtectedPage>
        <ProductDetail />
      </ProtectedPage>
    }
  />,
  <Route
    path="/request"
    element={
      <ProtectedPage>
        <ResetPassword />
      </ProtectedPage>
    }
  />,
  <Route
    path="/inputpassword/:token"
    element={
      <ProtectedPage>
        <InputPassword />
      </ProtectedPage>
    }
  />,
  <Route
    path="/example"
    element={
      <ProtectedPage>
        <Example />
      </ProtectedPage>
    }
  />,
  <Route
    path="/404"
    element={
      <ProtectedPage>
        <Error />
      </ProtectedPage>
    }
  />,

  // admin
  <Route
    path="/test"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <Test />
      </ProtectedPage>
    }
  />,
];

export default routes;
