import React from "react";

const ProductCategoryDropdown = ({
  user,
  handleCategoryChange,
  selectedCategory,
  category,
}) => {
  return (
    <div>
      <select
        id="category"
        name="category"
        // disabled={user.role === "adminWarehouse"}
        onChange={handleCategoryChange}
        value={selectedCategory}
        className="block w-36 py-2 px-3 border border-gray-300 bg-white rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select Category</option>
        {category &&
          category.map((categoryId) => (
            <option
              key={categoryId.id}
              value={categoryId.category}
              // disabled={
              //   user.role === "adminWarehouse" &&
              //   categoryId.id !== user.id_warehouse
              // }
            >
              {categoryId.category}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ProductCategoryDropdown;
