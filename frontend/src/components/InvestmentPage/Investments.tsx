import { useEffect, useState } from "react";
import { request } from "@/lib/axiosRequest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Loader2, AlertCircle, FileSpreadsheet } from "lucide-react"; 

interface Portfolio {
  wallet_balance: number;
  beta: number;
  asset_value: number;
  last_updated: string;
}

interface Position {
  stock_name: string;
  stock_symbol: string;
  quantity: number;
  average_price: any;
  current_value: number;
}

const Investments = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sellData, setSellData] = useState<{ [key: string]: { quantity?: number } }>({});

  const fetchInvestments = async () => {
    try {
      const response = await request({ method: "GET", url: "portfolio" });
      setPortfolio(response.data.portfolio);
      setPositions(response.data.positions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleInputChange = (stockSymbol: string, value: number) => {
    setSellData((prev) => ({
      ...prev,
      [stockSymbol]: { quantity: value },
    }));
  };


  const downloadCSV = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "get-report",
        responseType: "blob",
      });

      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `portfolio-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError("Failed to download CSV. Try again.");
    }
  }

  const handleSell = async (stockSymbol: string, price_per_share: number) => {
    const { quantity } = sellData[stockSymbol] || {};

    if (!quantity) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    try {
      const response = await request({
        method: "POST",
        url: "stocks/sell",
        data: { stock_symbol: stockSymbol, quantity, price_per_share },
      });

      if (response.status === 200) {
        toast.success(`Successfully sold ${quantity} shares of ${stockSymbol}!`);
        setSellData((prev) => ({ ...prev, [stockSymbol]: {} }));
        setPositions((prev) => prev.filter((position) => position.stock_symbol !== stockSymbol));
        setPositions((prev) =>
          prev
            .map((position) =>
              position.stock_symbol === stockSymbol
                ? { ...position, quantity: position.quantity - quantity }
                : position
            )
            .filter((position) => position.quantity > 0)
        );
        
        setPortfolio((prev) =>
          prev
            ? {
                ...prev,
                asset_value: prev.asset_value - quantity * price_per_share,
              }
            : null
        );
        
      }
    } catch (error) {
      toast.error("Failed to sell stock. Try again.");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-red-500">
        <AlertCircle size={32} className="mb-2" />
        <p className="text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center  mb-6">
      <h2 className="text-3xl font-bold  pl-2 text-gray-900">Investment Portfolio</h2>
      <Button variant="default" size="sm" onPress={downloadCSV} className={"gap-2"}>
        <span>Download CSV</span> <FileSpreadsheet size={'13px'}/>
      </Button>
      </div>

      <Card className="mb-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Wallet Balance:</strong> <span className="text-green-600">${portfolio.wallet_balance}</span></p>
          <p><strong>Beta:</strong> {portfolio.beta}</p>
          <p><strong>Asset Value:</strong> <span className="text-blue-600">${portfolio.asset_value}</span></p>
          <p><strong>Last Updated:</strong> {new Date(portfolio.last_updated).toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Stock Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <p className="text-gray-500 text-center">No active investments.</p>
          ) : (
            <Table className="border rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-gray-100 text-gray-800">
                  <TableHead>Stock Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Avg Price ($)</TableHead>
                  <TableHead>Current Value ($)</TableHead>
                  <TableHead>Sell</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.stock_symbol} className="hover:bg-gray-50 transition">
                    <TableCell>{position.stock_name}</TableCell>
                    <TableCell className="text-gray-700 font-medium">{position.stock_symbol}</TableCell>
                    <TableCell>{position.quantity}</TableCell>
                    <TableCell>${position.average_price}</TableCell>
                    <TableCell className="text-green-600">${position.current_value}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          className="w-20 text-center border border-gray-300 rounded-md"
                          onChange={(e) => handleInputChange(position.stock_symbol, Number(e.target.value))}
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="px-4"
                          onPress={() => handleSell(position.stock_symbol, position.current_value)}
                        >
                          Sell
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;
