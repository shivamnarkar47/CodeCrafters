import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/axiosRequest";

const AutoBot = () => {
  const { id } = useParams();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [gridCount, setGridCount] = useState("");
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const fetchInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`);
        const data = await response.json();
        setCryptoData({
        stock_symbol: "AAPL",
        //   stock_symbol: data.symbol.toUpperCase(),
          stock_name: "Apple Inc.",
          exchange: "Stocks",
          btn: data.market_data?.current_price?.usd || 0,
          investment: 200,
          brokerage_fee: 5,
          taxes: 2,
          other_charges: 1,
        });
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };
    fetchCryptoData();
  }, [id]);

  const fetchSubmissionResponse = async () => {
    try {
      const response = await request({
        url:"api/grid-trading/bot",
        method: "GET",
      });
      const result = await response.data;
      console.log("API Response:", result);
    } catch (error) {
      console.error("Error fetching submission response:", error);
    }
  };

  const handleSubmit = async () => {
    if (!minPrice || !maxPrice || !gridCount) {
      alert("Please fill all fields!");
      return;
    }

    if (!cryptoData) {
        alert("Fetching crypto data, please wait...");
        return;
    }

    const data = {
      ...cryptoData,
      min_price: parseFloat(minPrice),
      max_price: parseFloat(maxPrice),
      grid_count: parseInt(gridCount, 10),
    };

    console.log("Submitting Data:", data); 

    try {
      const response = await request({ 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url:"api/grid-trading/bot",
        data: JSON.stringify(data),
      });


      const result = await response.data;
      console.log("AutoBot Created:", result);
      alert("AutoBot created successfully!");

      setIsFetching(true);

      // Clear previous interval before starting a new one
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
      }

      fetchInterval.current = setInterval(fetchSubmissionResponse, 30000);
    } catch (error) {
      console.error("Error creating AutoBot:", error);
      alert("Failed to create AutoBot!");
    }
  };

  useEffect(() => {
    return () => {
      if (fetchInterval.current) clearInterval(fetchInterval.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 space-y-4 border rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold">Create AutoBot</h2>

      {cryptoData ? (
        <div className="text-left w-full space-y-2">
          <p><strong>Stock Symbol:</strong> {cryptoData.stock_symbol}</p>
          <p><strong>Stock Name:</strong> {cryptoData.stock_name}</p>
          <p><strong>Exchange:</strong> {cryptoData.exchange}</p>
          <p><strong>Current Price:</strong> ${cryptoData.btn.toFixed(2)}</p>
          <p><strong>Investment:</strong> ${cryptoData.investment}</p>
          <p><strong>Brokerage Fee:</strong> ${cryptoData.brokerage_fee}</p>
          <p><strong>Taxes:</strong> ${cryptoData.taxes}</p>
          <p><strong>Other Charges:</strong> ${cryptoData.other_charges}</p>
        </div>
      ) : (
        <p className="text-gray-500">Fetching data...</p>
      )}

      <Input 
        type="number" 
        placeholder="Min Price" 
        value={minPrice} 
        onChange={(e) => setMinPrice(e.target.value)} 
      />
      <Input 
        type="number" 
        placeholder="Max Price" 
        value={maxPrice} 
        onChange={(e) => setMaxPrice(e.target.value)} 
      />
      <Input 
        type="number" 
        placeholder="Grid Count" 
        value={gridCount} 
        onChange={(e) => setGridCount(e.target.value)} 
      />

        <Button 
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleSubmit}
        >
        Create AutoBot
        </Button>

    </div>
  );
};

export default AutoBot;
