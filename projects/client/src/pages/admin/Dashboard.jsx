import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../API/api";
import DashboardContent from "../../components/admin/dashboard/dashboardContent";

const Dashboard = () => {
  const [warehousePlace, setWarehousePlace] = useState("All Warehouse");
  const [warehouseprice, setWarehousePrice] = useState("All Warehouse");
  const [product, setProduct] = useState([]);
  const [tCount, setTCount] = useState(0);
  const [mCount, setMCount] = useState(0);
  const [pCount, setPCount] = useState([]);

  const [warehouses, setWarehouses] = useState("All Warehouse");
  const adminData = useSelector((state) => state.userSlice);
  const warehouse = useSelector((state) => state.warehouseSlice.value);
  useEffect(() => {
    const findWarehouse = warehouse.find((el) => {
      return adminData.id_warehouse === el.id;
    });
    if (findWarehouse) setWarehousePlace(findWarehouse.warehouse);
  }, [warehouse]);

  const getUserBuyer = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.post(
        "/dashboard/user-count",
        { warehouseprice },
        {
          headers: {
            Authorization: token,
            Accept: "appplication/json",
            "Content-Type": "application/json",
          },
        }
      );
      setPCount(response.data.userPrice);
    } catch (error) {
      console.log({ message: "Something went wrong" });
    }
  };

  const getFavoriteProduct = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/product/favorite", {
        params: {
          warehouses,
        },
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      setProduct(response.data.productFavoriteData);
    } catch (error) {
      console.log({ message: "Something went wrong" });
    }
  };
  const getCountTransactionOngoing = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/dashboard/transaction-count", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      setTCount(response.data.result);
    } catch (error) {
      console.log({ message: "Something went wrong" });
    }
  };
  const getCountMutatioinOngoing = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/dashboard/mutation-count", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      setMCount(response.data.result);
    } catch (error) {
      console.log({ message: "Something went wrong" });
    }
  };
  useEffect(() => {
    getFavoriteProduct();
    getCountTransactionOngoing();
    getCountMutatioinOngoing();
  }, [warehouses, warehouseprice]);
  useEffect(() => {
    getUserBuyer();
  }, [warehouseprice]);
  return (
    <div className="min-h-screen px-7 py-5">
      <DashboardContent
        adminData={adminData}
        warehousePlace={warehousePlace}
        mCount={mCount}
        warehouses={warehouses}
        setWarehouses={setWarehouses}
        product={product}
        warehouseprice={warehouseprice}
        pCount={pCount}
        setWarehousePrice={setWarehousePrice}
        tCount={tCount}
        warehouse={warehouse}
      />
    </div>
  );
};

export default Dashboard;
