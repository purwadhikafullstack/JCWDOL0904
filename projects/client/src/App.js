import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { TestImage } from "./pages/TestImage";
import Sidebar from "./components/admin/Sidebar";
import { Cek } from "./components/admin/Cek";
import { useState, useEffect } from "react";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import Test from "./pages/Test";
import Checkout from "./pages/Checkout";
import { Ekspedisi } from "./components/Ekspedisi";
import { Verification } from "./pages/verification";
import { Register } from "./pages/register";
import { ResetPassword } from "./pages/resetPassword";
import { InputPassword } from "./pages/inputPassword";
import Profile from "./pages/Profile";
import routes from "./routes/routes";
import { api } from "./API/api";
import { login } from "./features/userSlice";
import { data } from "./features/warehouseSlice";
import { Flex, Spinner } from "@chakra-ui/react";
import { AllCategory } from "./features/categorySlice";

function App() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  async function getUser(id) {
    await api
      .get("/user/auth/" + id)
      .then((res) => dispatch(login(res.data.user)));
  }

  async function getWarehouse() {
    await api
      .get("/warehouses/data")
      .then((res) => dispatch(data(res.data.result)));
  }

  const getAllCategory = async () => {
    try {
      const response = await api.get("/category");
      console.log(response);
      dispatch(AllCategory(response.data.result));
    } catch (error) {
      console.log(error);
    }
  };
  //app js > useEffect => localstorage => api request user by id => dispatch => globalstate => routes => protectedPage => cek redux => kalau sesaui return login

  useEffect(() => {
    let user = null;
    let userId = null;
    if (localStorage.getItem("auth")) {
      user = JSON.parse(localStorage.getItem("auth")); //token
      userId = user.id;
    }
    console.log(user);

    getWarehouse();
    getAllCategory();
    if (userId) {
      getUser(userId);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // const
  // const { role } = useSelector((state) => state.userSlice.value);
  // console.log(role);
  const role = "";

  // useEffect(() => {
  //   (async () => {
  //     const {data} = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/greetings`
  //     );
  //     setMessage(data?.message || "");
  //   })();
  // }, []);
  return (
    <>
      {/* {role == "user" ? (
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/home" element={<Homepage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification/:token" element={<Verification />} />
            <Route path="/request" element={<ResetPassword />} />
            <Route path="/inputpassword/:token" element={<InputPassword />} />
            <Route path="/" element={<Login />} />
            <Route path="/image" element={<TestImage />} />
            <Route path="/detail" element={<ProductDetail />} />
            <Route path="/test" element={<Test />} />
            <Route path="/cart2" element={<Cart />} />
            <Route path="/cart" element={<Cart2 />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tr" element={<Example />} />
            <Route path="/trans" element={<Transaction />} />
          </Routes>
          {/* <Footer /> */}
      {/* </div >
      ) : (
        <div className="App">
          <Sidebar />
          <Routes>
            <Route path="/cek" element={<Cek />} />
          </Routes>
        </div>
      )
      } */}
      {isLoading ? (
        <div
          style={{
            display: "Flex",
            height: "100vh",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`${process.env.REACT_APP_API_BASE}/logo_galaxy_2.png`}
            className="w-32 h-28 align-middle rounded-full animate-bounce"
          />
        </div>
      ) : (
        <Routes>{routes.map((route) => route)}</Routes>
      )}
    </>
  );
}

export default App;
