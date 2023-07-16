import React, { useState, useEffect } from "react";
import { apiro } from "../API/apiro";
import { api } from "../API/api";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export const AddAddressModal = ({ closeAddressModal }) => {
  const [provinces, setProvinces] = useState([]);
  const [provincess, setProvincess] = useState([]);
  const [cities, setCities] = useState([]);
  console.log(cities);
  console.log(provincess.province);

  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState([]);
  const [subdistrict, setSubdistrict] = useState("");
  const [zip, setZip] = useState("");

  console.log(recipientName);
  console.log(city.type + " " + city.city);
  console.log(provinces);
  console.log(provincess);
  console.log(parseInt(city.id));

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
      const token = JSON.parse(localStorage.getItem("auth"));
      let response = await api.post(
        "/addresses/create-address",
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
      console.log(response);
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      setRecipientName("");
      setPhoneNumber("");
      setProvincess([]);
      setCity([]);
      setSubdistrict("");
      setZip("");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "warning",
        confirmButtonText: "Ok",
      });
      console.log(error);
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
  const handleClose = () => {
    closeAddressModal();
  };

  return (
    <div className="fixed  inset-0 flex pt-20 items-center justify-center z-10 bg-gray-800 bg-opacity-50">
      <div className="border-t relative pt-5 bg-white px-4 sm:px-6 md:px-8 py-16 rounded-xl max-w-lg w-full">
        <XMarkIcon
          className="top-2 absolute right-2 h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out cursor-pointer"
          aria-hidden="true"
          onClick={handleClose}
        />

        <h2 className="text-lg font-medium text-gray-500 mt-4">
          Create New Address
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            <div>
              <label
                htmlFor="recipient-name"
                className="block text-sm font-medium text-gray-500 text-center"
              >
                Recipient Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="recipient-name"
                  name="recipient-name"
                  autoComplete="given-name"
                  value={recipientName}
                  className="block w-full h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                  onChange={(e) => setRecipientName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-500"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={phoneNumber}
                  autoComplete="family-name"
                  className="block w-full border text-center h-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-500"
              >
                Province
              </label>
              <div className="mt-1">
                <select
                  id="province"
                  name="province"
                  value={provincess.province}
                  className="block w-full border border-gray-300 h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    console.log(JSON.parse(e.target.value));
                    setProvincess(JSON.parse(e.target.value));
                  }}
                >
                  <option
                    value={provincess.province}
                    className="text-gray-800 font-medium"
                  >
                    {provincess ? provincess.province : "Select a province"}
                  </option>
                  {provinces.map((province) => (
                    <option
                      className="text-gray-500"
                      key={province.province_id}
                      value={JSON.stringify({
                        id: province.province_id,
                        province: province.province,
                      })}
                    >
                      {province.province}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="province"
                className="block text-sm font-medium text-gray-500"
              >
                City
              </label>
              <div className="mt-1">
                <select
                  id="province"
                  name="province"
                  autoComplete="province"
                  className="block w-full pl-2 h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    setCity(JSON.parse(e.target.value));
                  }}
                >
                  <option value={city}>
                    {city ? city.city : "Select a City"}
                  </option>
                  {cities.map((city) => (
                    <option
                      className="text-gray-500"
                      key={city.id}
                      value={JSON.stringify({
                        city: city.city_name,
                        id: city.city_id,
                        type: city.type,
                      })}
                    >
                      <p>{city.type}</p>
                      <span> </span>
                      <p>{city.city_name}</p>
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="subdistrict"
                className="block text-sm font-medium text-gray-500"
              >
                Subdistrict
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="subdistrict"
                  value={subdistrict}
                  id="subdistrict"
                  autoComplete="subdistrict"
                  className="block w-full border text-center h-7 text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => setSubdistrict(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-5">
            <label
              htmlFor="postal-code"
              className="block text-sm font-medium text-gray-500"
            >
              Postal code
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="postal-code"
                value={zip}
                id="postal-code"
                autoComplete="postal-code"
                className="block w-full border h-7 rounded-md text-center border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setZip(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Submits
          </button>
        </form>
      </div>
    </div>
  );
};
