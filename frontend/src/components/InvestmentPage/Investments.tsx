// import { useEffect, useState } from "react";
// import { request } from "@/lib/axiosRequest";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const Investments = () => {
//   const [portfolio, setPortfolio] = useState(null);
//   const [positions, setPositions] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInvestments = async () => {
//       try {
//         const response = await request({ method: "GET", url: "portfolio" });
//         setPortfolio(response.data.portfolio);
//         setPositions(response.data.positions);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     fetchInvestments();
//   }, []);

//   const handleSell = (stockSymbol) => {
//     alert(`Sell order placed for ${stockSymbol}`);
//     // You can later replace this with an API call to sell the stock
//   };

//   if (error) return <div className="text-red-500   text-center mt-4">Error: {error}</div>;
//   if (!portfolio) return <div className="text-center mt-4">Loading...</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Investments</h2>

//       {/* Portfolio Summary */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Portfolio Overview</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p><strong>Wallet Balance:</strong> ${portfolio.wallet_balance}</p>
//           <p><strong>Beta:</strong> {portfolio.beta}</p>
//           <p><strong>Asset Value:</strong> ${portfolio.asset_value}</p>
//           <p><strong>Last Updated:</strong> {new Date(portfolio.last_updated).toLocaleString()}</p>
//         </CardContent>
//       </Card>

//       {/* Stock Positions Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Stock Positions</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {positions.length === 0 ? (
//             <p className="text-gray-500">No active investments.</p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Stock Name</TableHead>
//                   <TableHead>Symbol</TableHead>
//                   <TableHead>Quantity</TableHead>
//                   <TableHead>Avg Price ($)</TableHead>
//                   <TableHead>Current Value ($)</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {positions.map((position, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{position.stock_name}</TableCell>
//                     <TableCell>{position.stock_symbol}</TableCell>
//                     <TableCell>{position.quantity}</TableCell>
//                     <TableCell>{position.average_price}</TableCell>
//                     <TableCell>{position.current_value}</TableCell>
//                     <TableCell>
//                       <Button variant="destructive" className={"text-white px-4"} size="sm" onClick={() => handleSell(position.stock_symbol)}>
//                         Sell
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Investments;

import { useEffect, useState } from "react";
import { request } from "@/lib/axiosRequest";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const Investments = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);
  const [sellData, setSellData] = useState({}); // Stores user input for selling stocks

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await request({ method: "GET", url: "portfolio" });
        setPortfolio(response.data.portfolio);
        setPositions(response.data.positions);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInvestments();
  }, []);

  // Handle input changes for selling shares
  const handleInputChange = (stockSymbol, field, value) => {
    setSellData((prev) => ({
      ...prev,
      [stockSymbol]: { ...prev[stockSymbol], [field]: value },
    }));
  };

  // Handle stock sell
  const handleSell = async (stockSymbol,price_per_share ) => {
    const { quantity} = sellData[stockSymbol];

    if (!quantity ) {
      console.log("Please enter both quantity .");
      return;
    }

    try {
      const response = await request({
        method: "POST",
        url: "stocks/sell",
        data: { stock_symbol: stockSymbol, quantity, price_per_share },
      });
     if(response.status == 200){
      console.log(response.data);
      toast.success(`Successfully sold ${quantity} shares of ${stockSymbol}!`);
     }
      setSellData((prev) => ({ ...prev, [stockSymbol]: {} }));
      console.log(`Successfully sold ${quantity} shares of ${stockSymbol}!`);
      setPositions((prev) => prev.filter((position) => position.stock_symbol !== stockSymbol));
      console.log(`Successfully sold ${quantity} shares of ${stockSymbol}!`);
    } catch (error) {
      console.log("Failed to sell stock. Try again. Error : "+error);
    }
  };

  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  if (!portfolio) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Investments</h2>

      {/* Portfolio Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Wallet Balance:</strong> ${portfolio.wallet_balance}</p>
          <p><strong>Beta:</strong> {portfolio.beta}</p>
          <p><strong>Asset Value:</strong> ${portfolio.asset_value}</p>
          <p><strong>Last Updated:</strong> {new Date(portfolio.last_updated).toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Stock Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <p className="text-gray-500">No active investments.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={position.stock_symbol}>
                    <TableCell>{position.stock_name}</TableCell>
                    <TableCell>{position.stock_symbol}</TableCell>
                    <TableCell>{position.quantity}</TableCell>
                    <TableCell>{position.average_price}</TableCell>
                    <TableCell>{position.current_value}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Qty"
                        className="w-20 mr-2"
                        onChange={(e) => handleInputChange(position.stock_symbol, "quantity", Number(e.target.value))}
                      />
                    
                      <Button
                        variant="destructive"
                        size="sm"
                        onPress={()=>handleSell(position.stock_symbol,position.current_value)}
                      >
                        Sell
                      </Button>
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
