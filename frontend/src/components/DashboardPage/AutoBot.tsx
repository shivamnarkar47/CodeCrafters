import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/axiosRequest";
import StockPriceChartWithData from "./StockPriceChart";

const AutoBot = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    minPrice: "",
    maxPrice: "",
    gridCount: "",
  });
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const fetchInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin`
        );
        const data = await response.json();
        setCryptoData({
          stock_symbol: "AAPL",
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
      const response = await request({ url: "api/grid-trading/bot", method: "GET" });
      const result = await response.data;
      console.log("API Response:", result);
      setResults(result);
    } catch (error) {
      console.error("Error fetching submission response:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.minPrice || !formData.maxPrice || !formData.gridCount) {
      alert("Please fill all fields!");
      return;
    }
    if (!cryptoData) {
      alert("Fetching crypto data, please wait...");
      return;
    }

    const data = {
      ...cryptoData,
      min_price: parseFloat(formData.minPrice),
      max_price: parseFloat(formData.maxPrice),
      grid_count: parseInt(formData.gridCount, 10),
    };

    console.log("Submitting Data:", data);

    try {
      const response = await request({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        url: "api/grid-trading/bot",
        data: JSON.stringify(data),
      });

      const result = await response.data;
      console.log("AutoBot Created:", result);
      alert("AutoBot created successfully!");
      setIsFetching(true);

      if (fetchInterval.current) clearInterval(fetchInterval.current);
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
    <>
      <div className="w-full">
        <StockPriceChartWithData />
      </div>
      <div className="flex px-6 flex-col items-center py-6 space-y-4 rounded-lg w-full">
        <div className="text-2xl font-bold w-full text-left">Create AutoBot</div>
        {cryptoData ? (
          <div className="text-left w-full space-y-2">
            {Object.entries(cryptoData).map(([key, value]) => (
              <p key={key} className="flex border-t-2 py-2 w-full">
                <div className="pl-4 capitalize font-medium text-gray-400">{key.replace("_", " ")}:</div>
                <span className="ml-2 font-semibold">{typeof value === "number" ? `$${value.toFixed(2)}` : value}</span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Fetching data...</p>
        )}
        <div className="w-full">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={formData.minPrice}
              onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={formData.maxPrice}
              onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
              />
            </div>
            <Input
            className="w-[18%] my-2"
              type="number"
              placeholder="Grid Count"
              value={formData.gridCount}
              onChange={(e) => setFormData({ ...formData, gridCount: e.target.value })}
              />
          <Button className="w-[18%] bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmit}>
            Create AutoBot
          </Button>
        </div>
      </div>
    </>
  );
};

export default AutoBot;