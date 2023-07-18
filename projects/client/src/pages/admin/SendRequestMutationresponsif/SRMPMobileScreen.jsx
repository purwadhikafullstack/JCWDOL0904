import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data } from "../../../features/warehouseSlice";
import { api } from "../../../API/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CardAndInput from "./sendRequestMutationR/CardAndInput";

const SRMPMobileSreen = () => {
  const value = useSelector((state) => state.warehouseSlice.value);
  const adminWarehouseReceive = useSelector((state) => state.userSlice);

  const [valueSender, setValueSender] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [product, setProduct] = useState({});
  const [stocks, setStocks] = useState([]);
  const [stock, setStock] = useState("");
  const [wSender, setWSender] = useState("");
  const [wReceiver, setReceiver] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Send Request!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const id = product.id;
            const warehouse_sender_id = wSender.id;
            const warehouse_receive_id = adminWarehouseReceive.id_warehouse;
            const status = "pending";
            const qty = parseInt(quantity);
            const response = await api.post("/mutation/manual-mutation", {
              id,
              warehouse_sender_id,
              warehouse_receive_id,
              qty,
              status,
            });
            Swal.fire(
              "Sended!",
              "Your request has been sended.",
              "success"
            ).then(() => {
              navigation("/mutation-list");
            });
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text: error.response.data.message,
              icon: "error",
            });
          }
        }
      });
    } catch (error) {}
  };

  const getWarehouseData = async () => {
    await api
      .get("/warehouses/data")
      .then((result) => {
        dispatch(data(result.data.result));
      })
      .catch((err) => {});
  };

  const getOneProduct = async (idP) => {
    try {
      const result = await api.post("/product/detail", { idP });
      setStocks(result.data.productById.Stocks);
      setProduct(result.data.productById);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
      });
      navigation("/mutation-list");
    }
  };

  useEffect(() => {
    getWarehouseData();
    const idProduct = localStorage.getItem("idProductM");
    if (idProduct && parseInt(idProduct) > 0) {
      getOneProduct(JSON.parse(idProduct));
      window.scrollTo(0, 0);
    } else {
      navigation("/manage-mutation");
    }
  }, []);

  useEffect(() => {
    let warehouseFiltered;
    if (adminWarehouseReceive && value) {
      console.log(value);
      console.log(wReceiver);
      warehouseFiltered = value.filter(
        (el) => el.id !== adminWarehouseReceive.id_warehouse
      );
      setValueSender(warehouseFiltered);
    }
  }, []);

  useEffect(() => {
    let filteredStock = null;
    if (stocks) {
      filteredStock = stocks?.filter((obj) => obj.id_warehouse === wSender.id);
    }
    if (filteredStock.length > 0) {
      setStock(filteredStock[0].stock);
    } else {
      setStock(0);
    }
  }, [wSender]);

  return (
    <div className="flex justify-center w-full flex-col">
      <h2 className="text-lg font-medium text-gray-500 my-4 flex justify-center">
        Send Mutation Request
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center flex-col w-full "
      >
        <CardAndInput
          responsif={"mobile"}
          product={product}
          wSender={wSender}
          setWSender={setWSender}
          valueSender={valueSender}
          quantity={quantity}
          setQuantity={setQuantity}
          stock={stock}
        />
        <div className="-300 w-full flex justify-center px-10">
          <button
            type="submit"
            className="my-6 w-96 rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Submits
          </button>
        </div>
      </form>
    </div>
  );
};

export default SRMPMobileSreen;
