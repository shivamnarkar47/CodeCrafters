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
        method:"GET",
        url:"getWallet",
      });
      setWallet(response.data.wallet);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch wallet");
    }
  };

  const addWallet = async () => {
    try {
      const response = await request({
        method:"POST",
        url:"addWallet",
        data:{amount},
      })
      setMessage(response.data.message);
      setAmount("");
      fetchWallet();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to add amount");
    }
  };

  return (
    <div className="wallet-container">
      <h2>Wallet Balance</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <p>Balance: {wallet !== null ? `₹${wallet}` : "Loading..."}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={addWallet}>Add Money</button>
    </div>
  );
};

export default Wallet;