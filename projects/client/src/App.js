import "./App.css";
import {useSelector} from "react-redux";
import {Navbar} from "./components/Navbar";
import {Footer} from "./components/Footer";
import {Login} from "./pages/Login";
import {Routes, Route} from "react-router-dom";
import {TestImage} from "./pages/TestImage";
import Sidebar from "./components/admin/Sidebar";
import {Cek} from "./components/admin/Cek";
import {useState, useEffect} from "react";
import Homepage from "./pages/Homepage";
import ProductDetail from "./pages/ProductDetail";
import Test from "./pages/Test";
import Cart from "./pages/Cart";
import Cart2 from "./pages/Cart2";
import Checkout from "./pages/Checkout";
import {Ekspedisi} from "./components/Ekspedisi";
import {Verification} from "./pages/verification";
import {Register} from "./pages/register";
import Example from "./components/Transaction";
import {Transaction} from "./pages/Transactions";

function App() {
  const [message, setMessage] = useState("");

  const {role} = useSelector((state) => state.userSlice.value);
  console.log(role);

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
      {role == "user" ? (
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/home" element={<Homepage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification/:token" element={<Verification />} />
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
        </div>
      ) : (
        <div className="App">
          <Sidebar />
          <Routes>
            <Route path="/cek" element={<Cek />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
