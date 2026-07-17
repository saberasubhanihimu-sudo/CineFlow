import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
    const { axios, getToken } = useAppContext();
    const amount = location.state?.amount || 0;
    const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = value.replace(/\D/g, "");
      value = value.substring(0, 16);
      value = value.replace(/(.{4})/g, "$1 ").trim();
    }

    if (name === "expiry") {
      value = value.replace(/\D/g, "");

      if (value.length > 2) {
        value =
          value.substring(0, 2) +
          "/" +
          value.substring(2, 4);
      }
    }

    if (name === "cvv") {
      value = value.replace(/\D/g, "");
      value = value.substring(0, 3);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.cardName ||
      !formData.cardNumber ||
      !formData.expiry ||
      !formData.cvv
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/confirm-payment",
        {
          bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success("Payment Successful");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Payment Failed");
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-10 flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-xl p-8 shadow-2xl border border-gray-800">
     <h1 className="text-3xl font-bold text-center text-white">
          Payment
        </h1>
        <p className="text-center text-gray-400 mt-2 mb-8">
          Complete your booking securely
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <label className="text-gray-300 text-sm">
              Card Holder Name
            </label>

            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full mt-2 p-3 rounded-lg bg-[#2b2b2b] border border-gray-700 text-white outline-none focus:border-primary"
            />
          </div>
        <div>
            <label className="text-gray-300 text-sm">
              Card Number
            </label>

            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="w-full mt-2 p-3 rounded-lg bg-[#2b2b2b] border border-gray-700 text-white outline-none focus:border-primary"
            />
          </div>
         <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-gray-300 text-sm">
                Expiry
              </label>

              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full mt-2 p-3 rounded-lg bg-[#2b2b2b] border border-gray-700 text-white outline-none focus:border-primary"
              />
            </div>


            <div>
              <label className="text-gray-300 text-sm">
                CVV
              </label>

              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                className="w-full mt-2 p-3 rounded-lg bg-[#2b2b2b] border border-gray-700 text-white outline-none focus:border-primary"
              />
            </div>

          </div>
        <div className="border-t border-gray-700 pt-5">
         <div className="flex justify-between text-lg">
            <span className="text-gray-300">
                Total Amount
              </span>
            <span className="text-white font-semibold">
                ${amount}
              </span>
        </div>
  </div>
          <button
            type="submit"
            className="w-full bg-primary py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
          >
            Confirm Payment
          </button>

        </form>

      </div>
    </div>
  );
};

export default Payment;