import { useEffect, useState } from "react";
import axios from "axios";
import { request } from "@/lib/axiosRequest";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "getWallet",
      });
      setWallet(response.data.wallet);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Failed to fetch wallet");
      } else {
        setError("Failed to fetch wallet");
      }
    }
  };

  const addWallet = async () => {
    try {
      const response = await request({
        method: "POST",
        url: "addWallet",
        data: { amount },
      });
      if (response?.data?.message === "Amount added to wallet successfully") {
        setMessage("Amount added to wallet successfully");
        setError("");
      } else {
        setError("Failed to add amount");
      }
      setAmount("");
      fetchWallet();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add amount");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-4">
      <div className="bg-gray-100/50 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-left text-gray-800 mb-2">Wallet Balance</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center">{message}</p>}
        <p className="text-lg font-bold text-left text-gray-700 mt-8 mb-2">
          Balance: {wallet !== null ? `₹${wallet}` : "Loading..."}
        </p>
        <div className="">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addWallet}
            className="w-full mt-3 bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
