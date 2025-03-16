import { request } from "@/lib/axiosRequest";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Trash2 } from "lucide-react";  // Import delete icon

interface WatchlistItem {
  id: number;
  stock_symbol: string;
  stock_name: string;
  exchange: string;
  high_24h: number;
  low_24h: number;
}

const WatchList = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  const fetchWatchlist = () => {
    request({
      url: "favorites",
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      console.log(res.data);
      setWatchlist(res.data);
    });
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const deleteWatchlist = (stock_symbol: string) => {
    request({
      url: `favorites`,
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ stock_symbol: stock_symbol }),
    }).then((res) => {
      console.log(res.data);
      fetchWatchlist();
    });
  };

  return (
    <div className="flex flex-col items-center h-full">
      <h1 className="text-2xl font-bold p-10 font-Inter">WatchList</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stock Symbol</TableHead>
            <TableHead>Stock Name</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>High 24h</TableHead>
            <TableHead>Low 24h</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.stock_symbol}</TableCell>
              <TableCell>{item.stock_name}</TableCell>
              <TableCell>{item.exchange}</TableCell>
              <TableCell>Rs. {item.high_24h}</TableCell>
              <TableCell>Rs. {item.low_24h}</TableCell>
              <TableCell>
                <button
                  className="hover:cursor-pointer text-red-600 text-center hover:text-black transition duration-200"
                  onClick={() => deleteWatchlist(item.stock_symbol)}
                >
                  <Trash2 size={20} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WatchList;
