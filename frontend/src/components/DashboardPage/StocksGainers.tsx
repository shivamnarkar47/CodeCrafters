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

const StocksTopGainers = () => {
    interface Stock {
        id: string;
        stock: string;
        open: number;
        current_price: number;
        profit_percentage: number;
    }

    const [stocksData, setStocksData] = useState<Stock[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStocksData = async () => {
            try {
                const response = await fetch('/data/stocks.json');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                const allStocks = data.benchmarks.flatMap((benchmark: any) => benchmark.stocks);

                // Calculate profit percentage from current_price and open
                const topGainers = allStocks
                    .map((stock: any) => {
                        const profit_percentage = ((stock.current_price - stock.open) / stock.open) * 100;
                        return { ...stock, profit_percentage };
                    })
                    .sort((a: any, b: any) => b.profit_percentage - a.profit_percentage)
                    .slice(0, 9);

                setStocksData(topGainers);
            } catch (error) {
                console.error("Error fetching stocks:", error);
            }
        };

        fetchStocksData();
    }, []);

    return (
        <div className="bg-background w-1/2 border-r-2 pr-4 mt-6">
            <h1 className="text-center font-bold text-3xl">TOP GAINERS</h1>
            <p className="text-center font-semibold text-lg text-gray-300 mb-12">( Last 24h )</p>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Profit (%)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocksData.map((stock, index) => (
                        <TableRow 
                            key={index} 
                            className="hover:cursor-pointer hover:bg-gray-100 transition duration-200"
                            onClick={() => navigate(`/dashboard/explore/stocks`)}
                        >
                            <TableCell className="font-semibold">{stock.stock}</TableCell>
                            <TableCell className={`text-right font-medium ${stock.profit_percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {stock.profit_percentage.toFixed(2)}%
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default StocksTopGainers;
