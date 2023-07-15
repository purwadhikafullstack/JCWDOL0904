import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data } from "../../../features/warehouseSlice";
import { api } from "../../../API/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CardAndInput from "./sendRequestMutationR/CardAndInput";

const SRMPcScreen = () => {
  const value = useSelector((state) => state.warehouseSlice.value);
  const adminWarehouseReceive = useSelector((state) => state.userSlice);

  const [valueSender, setValueSender] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [product, setProduct] = useState({});
  const [stocks, setStocks] = useState([]);
  const [stock, setStock] = useState("");
  const [wSender, setWSender] = useState("");
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
    } catch (error) {}
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
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <h2 className="text-lg font-medium text-gray-500 mt-4">
        Send Mutation Request
      </h2>
      <form onSubmit={handleSubmit}>
        <CardAndInput
          responsif={"pc"}
          product={product}
          wSender={wSender}
          setWSender={setWSender}
          valueSender={valueSender}
          quantity={quantity}
          setQuantity={setQuantity}
          stock={stock}
        />
        <button
          type="submit"
          className="mt-6 w-auto rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Submits
        </button>
      </form>
    </div>
  );
};

export default SRMPcScreen;
