import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data } from "../../../features/warehouseSlice";
import { api } from "../../../API/api";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Card,
  Heading,
  CardBody,
  Image,
  Stack,
  Grid,
} from "@chakra-ui/react";
import Swal from "sweetalert2";

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

            console.log(response);
            Swal.fire(
              "Sended!",
              "Your request has been sended.",
              "success"
            ).then(() => {
              navigation("/mutation-list");
            });
          } catch (error) {
            // console.log(error.response.data.message);
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
        console.log(result);
        // setWarehouses(result.data);
        dispatch(data(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOneProduct = async (idP) => {
    try {
      const result = await api.post("/product/detail", { idP });
      console.log(result.data);
      setStocks(result.data.productById.Stocks);
      setProduct(result.data.productById);
      console.log(result);
    } catch (error) {
      console.log(error);
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
      //   console.log(warehouseFiltered);
      setValueSender(warehouseFiltered);
    }
  }, []);

  useEffect(() => {
    let filteredStock = null;
    if (stocks) {
      filteredStock = stocks?.filter((obj) => obj.id_warehouse === wSender.id);
      console.log(stock);
    }
    if (filteredStock.length > 0) {
      setStock(filteredStock[0].stock);
      console.log(filteredStock[0].stock);
    } else {
      setStock(0);
      console.log("null");
    }
    console.log(wSender);
  }, [wSender]);

  useEffect(() => {
    console.log(stock);
  }, [stock]);

  return (
    <div className="px-4 mt-5 sm:px-6 lg:px-8">
      <h2 className="text-lg font-medium text-gray-500 mt-4">
        Send Mutation Request
      </h2>
      <form onSubmit={handleSubmit}>
        <Stack direction="row">
          <div className="w-96">
            <div className="p-5">
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-500"
                >
                  Warehouse Sender
                </label>
                <div className="mt-1">
                  <select
                    id="province"
                    name="province"
                    value={wSender}
                    autoComplete="province"
                    className="block w-full border h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    // placeholder={wSender}
                    onChange={(e) => {
                      // console.log(JSON.parse(e.target.value));
                      setWSender(JSON.parse(e.target.value));
                    }}
                  >
                    <option className="text-gray-800 font-medium">
                      {wSender
                        ? `selecting ${wSender.warehouse}`
                        : "Select a warehouse"}
                    </option>
                    {valueSender?.map((el) => (
                      <option
                        className="text-gray-500"
                        key={el.id}
                        value={JSON.stringify({
                          id: el.id,
                          warehouse: el.warehouse,
                        })}
                      >
                        {el.warehouse}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div>
                <label
                  htmlFor="recipient-name"
                  className="block text-sm font-medium text-gray-500"
                >
                  Stock Request
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="recipient-name"
                    name="recipient-name"
                    autoComplete="given-name"
                    value={quantity}
                    className="block w-full h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <p>stock available</p>
                {stock} piece
              </div>
            </div>
          </div>

          <div>
            <Card width="200px" height="250pxpx">
              <CardBody>
                <Image
                  src={`${product.product_image}`}
                  alt={`${product.product_name}`}
                  borderRadius="lg"
                  width="150px"
                  height="150px"
                />
                <Stack mt="6" spacing="3" alignItems="center">
                  <Heading fontSize="12px" className="text-center">
                    {product.product_name}
                  </Heading>
                  <Text fontSize="sm">
                    Price: Rp.{parseInt(product.price).toLocaleString("id-ID")}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </div>
        </Stack>

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
