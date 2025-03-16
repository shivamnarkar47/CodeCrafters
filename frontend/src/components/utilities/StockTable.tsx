
import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"; 
import { useNavigate } from 'react-router-dom';

const StocksTable = () => {
    interface Stock {
        id: string;
        stock: string;
        current_price: number;
        open: number;
        day_low: number;
        day_high: number;
    }

    const [stocksData, setStocksData] = useState<Stock[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchLocalData = async () => {
            try {
                const response = await fetch('/data/stocks.json')
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                
                const data = await response.json();
                const allStocks = data.benchmarks?.flatMap((benchmark: any) => benchmark.stocks) || [];
                setStocksData(allStocks);
                console.log("Fetched Data:", allStocks);
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };

        fetchLocalData();
    }, []); 

    return (
        <div className="bg-background">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Day Low</TableHead>
                        <TableHead className="text-right">Day High</TableHead>
                        <TableHead className="text-right">Open</TableHead>
                        <TableHead className="text-right">Current Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocksData.map((stock, index) => (
                        <TableRow 
                        key={index} 
                        className="hover:cursor-pointer hover:bg-gray-100 transition duration-200"
                        onClick={() => navigate(`/dashboard/explore/stocks/${stock.id}`)}
                    >
                        <TableCell className="font-semibold">{stock.stock}</TableCell>
                        <TableCell className="text-right text-red-600">Rs {stock.day_low.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-green-500">Rs {stock.day_high.toFixed(2)}</TableCell>
                        <TableCell className="text-right">Rs {stock.open.toFixed(2)}</TableCell>
                        <TableCell
                            className={`font-medium text-right ${
                                stock.current_price < stock.open ? "text-red-600" : "text-green-600"
                            }`}
                        >
                            Rs {stock.current_price.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default StocksTable;
