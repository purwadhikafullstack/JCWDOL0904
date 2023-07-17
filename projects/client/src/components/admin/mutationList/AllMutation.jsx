import React from "react";

const AllMutation = (props) => {
  return (
    <>
      <tr key={props.el.id}>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {props.el.status}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {props.el.quantity}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {props.el.Product.product_name}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {props.el.senderWarehouse.warehouse}
        </td>
        <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
          {props.el.receiverWarehouse.warehouse}
        </td>
        {props.request === "in" ? (
          props.el.status === "pending" ? (
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              <button
                type="submit"
                className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
                // onClick={() => navigation("/manage-mutation")}
                onClick={() => props.rejectMutation(props.el.id)}
              >
                Reject
              </button>
            </td>
          ) : props.el.status === "migration" ? (
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              <button
                type="submit"
                className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
                onClick={() =>
                  props.proceedMutation(
                    props.el.id,
                    props.el.senderWarehouse.id,
                    props.el.receiverWarehouse.id,
                    props.el.quantity,
                    props.el.Product.id
                  )
                }
              >
                Confirm
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
                // onClick={() => navigation("/manage-mutation")}
                onClick={() => props.rejectMutation(props.el.id)}
              >
                Reject
              </button>
            </td>
          ) : (
            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
              No Action
            </td>
          )
        ) : props.el.status === "approved" || props.el.status === "rejected" ? (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            No Action
          </td>
        ) : props.el.status === "migration" ? (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <button
              type="submit"
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              // onClick={() => navigation("/manage-mutation")}
              onClick={() => props.rejectMutation(props.el.id)}
            >
              Reject
            </button>
          </td>
        ) : (
          <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
            <button
              type="submit"
              className="rounded-md border border-transparent bg-gray-950 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              onClick={() =>
                props.proceedMutation(
                  props.el.id,
                  props.el.senderWarehouse.id,
                  props.el.receiverWarehouse.id,
                  props.el.quantity,
                  props.el.Product.id
                )
              }
            >
              Confirm
            </button>
            <button
              type="submit"
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-xs font-medium text-white shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mx-1"
              onClick={() => props.rejectMutation(props.el.id)}
            >
              Reject
            </button>
          </td>
        )}
      </tr>
    </>
  );
};

export default AllMutation;
