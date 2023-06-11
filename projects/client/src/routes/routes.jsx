import { Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import { Register } from "../pages/register";

import { Verification } from "../pages/verification";

import { Login } from "../pages/Login";

import { TestImage } from "../pages/TestImage";

import ProductDetail from "../pages/ProductDetail";

import Test from "../pages/Test";
import ProtectedPage from "./protectedPage";

const routes = [
  <Route
    path="/"
    element={
      <ProtectedPage guestOnly={true}>
        <Homepage />
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
    path="/test"
    element={
      <ProtectedPage needLogin={true} adminOnly={true}>
        <Test />
      </ProtectedPage>
    }
  />,
];

export default routes;
