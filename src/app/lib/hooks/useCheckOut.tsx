import { useState } from "react";
import { useCartContext } from "@/context/CartContext";
import { useProductContext } from "@/context/ProductContext";

interface UseCheckoutReturn {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    additionalNotes: string;
  };
  isSubmitting: boolean;
  submitStatus: "idle" | "success" | "error";
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (
    e: React.FormEvent,
    isBuyNow?: boolean,
    selectedProductId?: string,
    selectedColor?: string | number,
    formData?: FormData
  ) => Promise<void>;
}

const useCheckout = (): UseCheckoutReturn => {
  const { cart, getCartTotal, emptyCart } = useCartContext();
  const { products } = useProductContext();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    additionalNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e?: React.FormEvent,
    isBuyNow: boolean = false,
    selectedProductId?: string,
    selectedColor?: string | number,
    formData?: FormData
  ) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    console.log("Selected product Id: ", selectedProductId);
    console.log("Selected color: ", selectedColor);
    console.log("Is Buy Now: ", isBuyNow);

    try {
      const response = await fetch("/api/send-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerDetails: formData,
          orderDetails: {
            items: isBuyNow
              ? [
                  {
                    product: products?.find(
                      (item) => item._id === selectedProductId
                    ),
                    selectedColorImage: {
                      asset: products
                        ?.find((item) => item._id === selectedProductId)
                        ?.colorImageMap.find(
                          (colorImage) => colorImage.color.hex === selectedColor
                        )?.images[0].asset.url,
                    },
                    
                  },
                  
                ]
              : cart,
            total: isBuyNow
              ?  products?.find(product => product._id === selectedProductId)?.price ?? 0 
              : getCartTotal(),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to submit order");

      setSubmitStatus("success");
      emptyCart();
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
      setSubmitStatus("error");
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleSubmit,
  };
};

export default useCheckout;
