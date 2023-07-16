import React, {useState, useEffect} from "react";
import {apiro} from "../API/apiro";
import {api} from "../API/api";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import AddAddressModalRender from "./AddAddressModalRender";

export const AddAddressModal = ({closeAddressModal}) => {
  const [provinces, setProvinces] = useState([]);
  const [provincess, setProvincess] = useState([]);
  const [cities, setCities] = useState([]);
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState([]);
  const [subdistrict, setSubdistrict] = useState("");
  const [zip, setZip] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const fetchAddressesProvince = async () => {
    try {
      const response = await apiro.get("rajaongkir/province");
      setProvinces(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAddressesCity = async () => {
    try {
      const response = await apiro.get(
        `rajaongkir/city?province_id=${provincess.id}`
      );
      setCities(response.data.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsloading(true);
      const token = JSON.parse(localStorage.getItem("auth"));
      let response = await api.post(
        "addresses",
        {
          recipient_name: recipientName,
          phone_number: parseInt(phoneNumber),
          province: provincess.province,
          city: city.city,
          address_city_id: parseInt(city.id),
          subdistrict,
          zip: parseInt(zip),
        },
        {
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      setRecipientName("");
      setPhoneNumber("");
      setProvincess({});
      setCity({});
      setSubdistrict("");
      setZip("");
      closeAddressModal();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "warning",
        confirmButtonText: "Ok",
      });
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchAddressesProvince();
  }, []);

  useEffect(() => {
    if (provincess.id) {
      fetchAddressesCity();
    }
  }, [provinces, provincess]);

  const handleProvinceChange = (e) => {
    const selectedProvince = JSON.parse(e.target.value);
    setProvincess(selectedProvince);
  };

  const handleCityChange = (e) => {
    const selectedCity = JSON.parse(e.target.value);
    setCity(selectedCity);
  };

  const handleRecipientNameChange = (e) => {
    setRecipientName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubdistrictChange = (e) => {
    setSubdistrict(e.target.value);
  };

  const handleZipChange = (e) => {
    setZip(e.target.value);
  };

  return (
    <AddAddressModalRender
      closeAddressModal={closeAddressModal}
      provinces={provinces}
      provincess={provincess}
      cities={cities}
      recipientName={recipientName}
      phoneNumber={phoneNumber}
      city={city}
      subdistrict={subdistrict}
      zip={zip}
      handleSubmit={handleSubmit}
      handleProvinceChange={handleProvinceChange}
      handleCityChange={handleCityChange}
      handleRecipientNameChange={handleRecipientNameChange}
      handlePhoneNumberChange={handlePhoneNumberChange}
      handleSubdistrictChange={handleSubdistrictChange}
      handleZipChange={handleZipChange}
      isLoading={isLoading}
    />
  );
};
