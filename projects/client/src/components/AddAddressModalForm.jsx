import React from "react";

export const AddAddressModalForm = ({
  provincess,
  phoneNumber,
  handlePhoneNumberChange,
  handleProvinceChange,
  handleRecipientNameChange,
  handleCityChange,
  handleSubmit,
  recipientName,
  provinces,
  city,
  cities,
  isLoading,
  spinnerStyles,
  PulseLoader,
  handleZipChange,
  zip,
  subdistrict,
  handleSubdistrictChange,
}) => {
  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit}>
        <div className="mt-4 grid grid-cols-1 gap-y-0 sm:grid-cols-2 sm:gap-x-4">
          <div>
            <label
              htmlFor="recipient-name"
              className="block text-sm font-medium text-gray-500 text-center"
            >
              Recipient Name
            </label>
            <div className="mt-1 text-gray-600">
              <input
                type="text"
                id="recipient-name"
                name="recipient-name"
                autoComplete="given-name"
                value={recipientName}
                className="block w-full h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-center"
                onChange={handleRecipientNameChange}
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
            <div className="mt-1 text-gray-600">
              <input
                type="number"
                id="phone"
                name="phone"
                value={phoneNumber}
                autoComplete="family-name"
                className="block w-full border text-center h-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handlePhoneNumberChange}
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
            <div className="mt-1 text-gray-600">
              <select
                id="province"
                name="province"
                value={provincess.province}
                className="block w-full border border-gray-300 h-7 pl-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleProvinceChange}
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
            <div className="mt-1 text-gray-600">
              <select
                id="province"
                name="province"
                autoComplete="province"
                className="block w-full pl-2 h-7 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={handleCityChange}
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
                onChange={handleSubdistrictChange}
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
          <div className="mt-1 text-gray-600">
            <input
              type="number"
              name="postal-code"
              value={zip}
              id="postal-code"
              autoComplete="postal-code"
              className="block w-full border h-7 rounded-md text-center border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={handleZipChange}
            />
          </div>
        </div>
        {isLoading ? (
          <button
            type="submit"
            className="mt-6 w-full rounded-full border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled
          >
            <span className="inline-flex items-center">
              <PulseLoader
                size={10}
                css={spinnerStyles}
                color="currentColor"
                loading={true}
              />
              <span className="ml-2">Loading</span>
            </span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-md border border-transparent bg-gray-950 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Submits
          </button>
        )}
      </form>
    </div>
  );
};
