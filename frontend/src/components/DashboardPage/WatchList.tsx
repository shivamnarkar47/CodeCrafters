import { request } from "@/lib/axiosRequest";
import { useEffect } from "react";

const WatchList = () => {
  const fetchWatchlist = () => {
    request({
      url: "favorites",
      method: "GET",
    }).then((res) => {
      console.log(res.data);
    });
  };
  useEffect(() => {
    fetchWatchlist();
  }, []);
  return <div className="">WatchList</div>;
};

export default WatchList;
