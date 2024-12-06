"use client"
import React, { useEffect, useState } from "react";
import { useProductContext } from "@/context/ProductContext";
import { ShoppingCart, Heart, Share2, X } from "lucide-react";
import Image from "next/image";
import { useCartContext } from "@/context/CartContext";
import { ColorImage } from "@/app/types";
import useCheckout from "@/app/lib/hooks/useCheckOut";

export default function Product({ params }: { params: { categoryName: string; productId: string } }) {
  const { products } = useProductContext();
  const { addToCart } = useCartContext();
  const { handleSubmit } = useCheckout();

  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    additionalNotes: "",
  });

  const product = products?.find((p) => p._id === params.productId);
  const colors = product?.colorImageMap?.map((ele) => ele.color.hex);
  const sizes = ["S", "M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);


  const [selectedColor, setSelectedColor] = useState((colors?.length ?? 0) > 0 ? colors ? colors[0] : 0 : "");
  const [selectedImage, setSelectedImage] = useState(product?.colorImageMap[0]?.images[0]?.asset?.url);
  const [imgMap, setImgMap] = useState<ColorImage["images"]>([]);

  useEffect(() => {
    const img = product?.colorImageMap.find((ele) => ele.color.hex === selectedColor);
    setSelectedImage(img?.images[0]?.asset?.url);
    setImgMap(img?.images ?? []);
  }, [selectedColor]);

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {

      await handleSubmit(e, true, product?._id, selectedColor, formData);
      setShowCheckout(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        additionalNotes: "",
      });
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: `Here is some interesting content to share: ${window.location.href}`, // Include the full URL in text
          url: window.location.href, // Full URL to share
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  function formatDescriptionToArray(description: any) {
    return description
      .split(",")
      .map((line: any) => line.trim())
      .filter((line: any) => line);
  }


  const descriptionArray = formatDescriptionToArray(
    product?.description || "No description available."
  );

  console.log('descriptionArray', descriptionArray);


  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product?.name ?? "product"}
                  className="object-cover w-full h-full"
                  width={500}
                  height={500}
                />
              ) : (
                <div className="animate-pulse bg-gray-300 h-full w-full" />
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {imgMap?.map((ele, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer">
                  <Image
                    src={ele?.asset?.url}
                    className="object-cover w-full h-full"
                    width={100}
                    height={100}
                    onClick={() => handleThumbnailClick(ele?.asset?.url)}
                    alt="product"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product?.name}</h1>
              <p className="text-gray-600 mt-2">{product?.type}</p>
            </div>


            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">₹{product?.price}</p>
                <p className="text-green-600 text-sm">In Stock</p>
              </div>
              <div className="flex gap-4">
                {/* <button className="p-2 rounded-full hover:bg-gray-100">
                  <Heart className="w-6 h-6" />
                  </button> */}
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={handleShare}
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              {colors?.map((ele, index) => (
                <button
                  key={index}
                  style={{
                    background: ele,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                  }}
                  onClick={() => handleColorClick(ele)}
                ></button>
              ))}
            </div>

            <div className="text-gray-600">
              <p className="font-semibold mb-2">Select Size:</p>
              <div className="flex gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`py-2 px-4 border rounded-md ${selectedSize === size ? "bg-black text-white" : "bg-white"
                      }`}
                    onClick={() => handleSizeClick(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>


            <div className="text-gray-600">
              <p className="font-semibold mb-2">Product Description:</p>
              <ul className="list-disc ml-5 space-y-1">
                {descriptionArray.map((line: any, index: number) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <button
                className="w-full bg-black text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800"
                onClick={() => addToCart(product?._id, selectedColor, products, selectedSize)}
              >
                <ShoppingCart />
                Add to Cart
              </button>

              <button
                className="w-full border border-black py-3 px-6 rounded-md hover:bg-gray-50"
                onClick={() => setShowCheckout(true)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Slide-in Panel */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Summary */}
              <div className="flex items-center gap-4 p-4 bg-gray-50">
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt={product?.name || "Product"}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium">{product?.name}</h3>
                  <p className="text-sm text-gray-600">₹{product?.price}</p>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="border-t p-4">
                <button
                  type="submit"
                  onClick={handleCheckoutSubmit}
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Complete Purchase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}