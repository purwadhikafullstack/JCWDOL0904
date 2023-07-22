import { useRef, useState } from "react";
import { BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { api } from "../API/api";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AddAddressModal } from "../components/AddAddressModal";
import { PasswordChangeModal } from "../components/PasswordChangeModal";
import { login } from "../features/userSlice";
import DeleteAddressModal from "../components/DeleteAddressModal";
import { ChangeUsernameModal } from "../components/changeUsernameModal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import UserTransactionData from "../components/userTransaction";
import ProfileRender from "../components/profile/profileRender";
import Alert from "../components/SwallAlert";

export default function Profile() {
  const [isAddAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setPasswordChangeModalOpen] =
    useState(false);
  const [isSelectedDeleteAddress, setSelectedDeletedAddress] = useState(null);
  const [isDeleteAddressModalOpen, setDeleteAddressModalOpen] = useState(false);
  const [isChangeUsernameModalOpen, setChangeUsernameModalOpen] =
    useState(false);
  const inputFileRef = useRef("");
  const dispatch = useDispatch();

  const handleSubmitProfile = async (e) => {
    const token = JSON.parse(localStorage.getItem("auth"));
    const formData = new FormData();
    formData.append("user_image", e.target.files[0]);
    try {
      const response = await api.post("/upload", formData, {
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      userData();
    } catch (error) {
      console.log(error);
      Alert({
        title: "Failed!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };
  const userData = async () => {
    try {
      let token = JSON.parse(localStorage.getItem("auth"));
      const response = await api.get("/user/auth", {
        headers: {
          Authorization: token,
          Accept: "appplication/json",
          "Content-Type": "application/json",
        },
      });
      dispatch(login(response.data.user));
    } catch (error) {
      Alert({
        title: "Failed!",
        text: error.result.data.message,
        icon: "error",
      });
    }
  };

  const openAddAddressModal = () => {
    setAddAddressModalOpen(true);
  };
  const closeAddAddressModal = () => {
    setAddAddressModalOpen(false);
  };
  const openPasswordChangeModal = () => {
    setPasswordChangeModalOpen(true);
  };
  const closePasswordChangeModal = () => {
    setPasswordChangeModalOpen(false);
  };

  const openDeleteAddressModal = () => {
    setDeleteAddressModalOpen(true);
  };
  const closeDeleteAdressModal = () => {
    setDeleteAddressModalOpen(false);
  };

  const openChangeUsernameModal = () => {
    setChangeUsernameModalOpen(true);
  };
  const closeChangeUsernameModal = () => {
    setChangeUsernameModalOpen(false);
  };

  const handleSelectDeleteAddress = (address) => {
    setSelectedDeletedAddress(address);
    setDeleteAddressModalOpen(false);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

  const { username, user_image } = useSelector((state) => state.userSlice);

  const token = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const storedSelectedAddress = localStorage.getItem("selectedAddress");
        if (storedSelectedAddress) {
          setSelectedDeletedAddress(JSON.parse(storedSelectedAddress));
        } else {
          const response = await api.get("addresses/", {
            headers: {
              Authorization: token,
              Accept: "appplication/json",
              "Content-Type": "application/json",
            },
          });
          const addresses = response.data;
          if (addresses.length > 0) {
            const defaultAddress = addresses.find(
              (address) => address.is_default === true
            );
            if (defaultAddress) {
              setSelectedDeletedAddress(defaultAddress);
            } else {
              setSelectedDeletedAddress(addresses[0]);
            }
          } else {
            setSelectedDeletedAddress(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <>
      <ProfileRender
        user_image={user_image}
        inputFileRef={inputFileRef}
        handleSubmitProfile={handleSubmitProfile}
        username={username}
        openChangeUsernameModal={openChangeUsernameModal}
        isSelectedDeleteAddress={isSelectedDeleteAddress}
        openAddAddressModal={openAddAddressModal}
        openDeleteAddressModal={openDeleteAddressModal}
        openPasswordChangeModal={openPasswordChangeModal}
        isPasswordChangeModalOpen={isPasswordChangeModalOpen}
        PasswordChangeModal={PasswordChangeModal}
        closePasswordChangeModal={closePasswordChangeModal}
        isChangeUsernameModalOpen={isChangeUsernameModalOpen}
        closeChangeUsernameModal={closeChangeUsernameModal}
        isAddAddressModalOpen={isAddAddressModalOpen}
        AddAddressModal={AddAddressModal}
        closeAddAddressModal={closeAddAddressModal}
        isDeleteAddressModalOpen={isDeleteAddressModalOpen}
        DeleteAddressModal={DeleteAddressModal}
        handleSelectDeleteAddress={handleSelectDeleteAddress}
        closeDeleteAdressModal={closeDeleteAdressModal}
        setSelectedDeletedAddress={setSelectedDeletedAddress}
        UserTransactionData={UserTransactionData}
      />
    </>
  );
}
