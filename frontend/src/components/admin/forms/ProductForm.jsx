import PropTypes from "prop-types";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaTimes, FaPlus } from "react-icons/fa";

const ProductForm = ({ product, onSubmit, onCancel, isEditing = false }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      salePrice: "",
      sku: "",
      category: "",
      stock: "",
      images: [],
      featured: false,
      colors: [],
      sizes: [],
      brand: "",
      tags: [],
    },
  });

  const [newTag, setNewTag] = React.useState("");
  const watchedTags = watch("tags");
  const watchedImages = watch("images");

  useEffect(() => {
    if (product && isEditing) {
      Object.keys(product).forEach((key) => {
        setValue(key, product[key]);
      });

      // Handle numeric values
      setValue("price", product.price.toString());
      if (product.salePrice)
        setValue("salePrice", product.salePrice.toString());
      setValue("stock", product.stock.toString());
    }
  }, [product, isEditing, setValue]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = watchedImages || [];
    setValue("images", [
      ...currentImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    const updatedImages = [...watchedImages];
    updatedImages.splice(index, 1);
    setValue("images", updatedImages);
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      (!watchedTags || !watchedTags.includes(newTag.trim()))
    ) {
      const currentTags = watchedTags || [];
      setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onFormSubmit = (data) => {
    // Convert numeric string values to numbers
    const processedData = {
      ...data,
      price: parseFloat(data.price),
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      stock: parseInt(data.stock),
    };

    onSubmit(processedData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className={`w-full p-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      validate: (value) =>
                        !isNaN(parseFloat(value)) || "Price must be a number",
                    })}
                    className={`w-full p-2 pl-7 border rounded-md ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Price (optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    {...register("salePrice", {
                      validate: (value) =>
                        !value ||
                        !isNaN(parseFloat(value)) ||
                        "Sale price must be a number",
                    })}
                    className={`w-full p-2 pl-7 border rounded-md ${
                      errors.salePrice ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.salePrice && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.salePrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  {...register("sku", { required: "SKU is required" })}
                  className={`w-full p-2 border rounded-md ${
                    errors.sku ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.sku.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  {...register("brand")}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`w-full p-2 border rounded-md ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                  <option value="bags">Bags</option>
                  <option value="jewelry">Jewelry</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  {...register("stock", {
                    required: "Stock is required",
                    validate: (value) =>
                      !isNaN(parseInt(value)) || "Stock must be a number",
                  })}
                  className={`w-full p-2 border rounded-md ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-black focus:ring-black rounded"
                    />
                  )}
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured Product
                </span>
              </label>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Additional Information</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {watchedImages &&
                  watchedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded overflow-hidden border border-gray-300"
                    >
                      <img
                        src={image}
                        alt={`Product ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                      >
                        <FaTimes className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
              </div>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded cursor-pointer hover:bg-gray-300"
              >
                Upload Images
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {watchedTags &&
                  watchedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2"
                      >
                        <FaTimes className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-l-md"
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-md hover:bg-gray-300"
                >
                  <FaPlus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Colors
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  "Red",
                  "Black",
                  "White",
                  "Blue",
                  "Green",
                  "Yellow",
                  "Brown",
                  "Pink",
                ].map((color) => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      value={color.toLowerCase()}
                      {...register("colors")}
                      className="h-4 w-4 text-black focus:ring-black rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Sizes
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
                  (size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        {...register("sizes")}
                        className="h-4 w-4 text-black focus:ring-black rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{size}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
          >
            {isEditing ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

ProductForm.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sku: PropTypes.string,
    category: PropTypes.string,
    stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    featured: PropTypes.bool,
    colors: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    brand: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

export default ProductForm;
