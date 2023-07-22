import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { TruckIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { api } from "../API/api";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Ekspedisi = ({ onSelectDeliveryMethod }) => {
  const [ekspedisi, setEkspedisi] = useState([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState([]);

  const fetchEkspedisi = async () => {
    try {
      const response = await api.get("/ekspedisi/user");
      setEkspedisi(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEkspedisi();
  }, []);
  return (
    <div>
      <div className="pt-6 border-t border-gray-200 ">
        <RadioGroup
          value={selectedDeliveryMethod}
          onChange={setSelectedDeliveryMethod}
        >
          <RadioGroup.Label className="text-lg font-medium text-gray-900">
            Delivery method
          </RadioGroup.Label>

          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            {ekspedisi.map((deliveryMethod) => (
              <RadioGroup.Option
                key={deliveryMethod.id}
                value={deliveryMethod}
                onFocus={() => onSelectDeliveryMethod(deliveryMethod)}
                className={({ checked, active }) =>
                  classNames(
                    checked ? "border-transparent" : "border-gray-300",
                    active ? "ring-2 ring-indigo-500" : "",
                    "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                  )
                }
              >
                {({ checked, active }) => (
                  <>
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <RadioGroup.Label
                          as="span"
                          className="text-sm flex gap-2 font-medium text-gray-900"
                        >
                          <TruckIcon className="h-4" />
                          {deliveryMethod.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-gray-500"
                        >
                          Shipping courier
                        </RadioGroup.Description>
                        <RadioGroup.Description
                          as="span"
                          className="mt-4 text-sm font-medium text-gray-900"
                        >
                          Available
                        </RadioGroup.Description>
                      </span>
                    </span>
                    {checked ? (
                      <CheckCircleIcon
                        className="h-5 w-5 text-indigo-600"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span
                      className={classNames(
                        active ? "border" : "border-2",
                        checked ? "border-indigo-500" : "border-transparent",
                        "pointer-events-none absolute -inset-px rounded-lg"
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
