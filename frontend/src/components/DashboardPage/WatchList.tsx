import { request } from "@/lib/axiosRequest";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const fetchWatchlist = () => {
    request({
      url: "favorites",
      method: "GET",
    }).then((res) => {
      console.log(res.data);
      setWatchlist(res.data);
    });
  };
  useEffect(() => {
    fetchWatchlist();
  }, []);
  return( <div className="flex flex-col  items-center h-full">
    <h1 className="text-2xl font-bold p-10 font-Inter">WatchList</h1>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stock Symbol</TableHead>
          <TableHead>Stock Name</TableHead>
          <TableHead>Exchange</TableHead>
          <TableHead>High 24h</TableHead>
          <TableHead>Low 24h</TableHead>
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
          </TableRow>
        ))}
        
      </TableBody>
    </Table>

  </div>);
};

export default WatchList;
