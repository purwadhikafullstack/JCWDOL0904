import {useState} from "react";
import {RadioGroup, Tab, Transition} from "@headlessui/react";

import {CheckCircleIcon} from "@heroicons/react/20/solid";
import {useEffect} from "react";
import {api} from "../API/api";

const deliveryMethods = [
  {id: 1, title: "Standard", turnaround: "4–10 business days", price: "$5.00"},
  {id: 2, title: "Express", turnaround: "2–5 business days", price: "$16.00"},
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [ekspedisi, setEkspedisi] = useState([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    deliveryMethods[0]
  );
  console.log(selectedDeliveryMethod);

  useEffect(() => {
    const fetchEkspedisi = async () => {
      try {
        const response = await api.get("ekspedisi");
        setEkspedisi(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEkspedisi();
  }, []);
  return (
    <div className="bg-gray-50">
      {/* Mobile menu */}

      <div className="mt-10 border-t border-gray-200 pt-10">
        <RadioGroup
          value={selectedDeliveryMethod}
          onChange={setSelectedDeliveryMethod}>
          <RadioGroup.Label className="text-lg font-medium text-gray-900">
            Delivery method
          </RadioGroup.Label>

          <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
            {ekspedisi.map((deliveryMethod) => (
              <RadioGroup.Option
                key={deliveryMethod.id}
                value={deliveryMethod}
                className={({checked, active}) =>
                  classNames(
                    checked ? "border-transparent" : "border-gray-300",
                    active ? "ring-2 ring-indigo-500" : "",
                    "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                  )
                }>
                {({checked, active}) => (
                  <>
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <RadioGroup.Label
                          as="span"
                          className="block text-sm font-medium text-gray-900">
                          {deliveryMethod.name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as="span"
                          className="mt-1 flex items-center text-sm text-gray-500">
                          {deliveryMethod.turnaround}
                        </RadioGroup.Description>
                        <RadioGroup.Description
                          as="span"
                          className="mt-6 text-sm font-medium text-gray-900">
                          {deliveryMethod.price}
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
}
