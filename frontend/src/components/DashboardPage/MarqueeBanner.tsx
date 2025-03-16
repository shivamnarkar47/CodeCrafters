import React, { useEffect, useState } from 'react';

const MarqueeBanner: React.FC = () => {
  interface Stock {
    benchmark: string;
    open: number;
    current_price: number;
  }

  const [marketData, setMarketData] = useState<{ title: string; value: string }[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/data/stocks.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const benchmarks = ["Nifty 50", "Nifty Bank", "Sensex"];

        const calculatedData = benchmarks.map((benchmark) => {
          const benchmarkData = data.benchmarks.find((b: any) => b.benchmark === benchmark);
          const stocks = benchmarkData ? benchmarkData.stocks : [];
          if (stocks.length === 0) return { title: benchmark, value: "--" };

          const avgPercentageChange =
            stocks.reduce((sum: number, stock: Stock) => {
              return sum + ((stock.current_price - stock.open) / stock.open) * 100;
            }, 0) / stocks.length;

          return {
            title: benchmark,
            value: `${avgPercentageChange.toFixed(2)}%`,
          };
        });

        setMarketData(calculatedData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <>
      <div className="text-5xl mt-12 pb-8 text-center font-bold">TODAY'S MARKET</div>
      <div className="overflow-hidden w-full flex border-b-2 pb-8 justify-evenly py-4">
        <div className="flex animate-marquee whitespace-nowrap gap-6">
          {marketData.map((card) => (
            <div
              key={card.title}
              className="border border-gray-200 bg-white text-black px-6 py-4 rounded-lg shadow-sm min-w-[200px] text-center"
            >
              <h2 className="text-3xl font-semibold">{card.title}</h2>
              <p className={`text-xl font-bold mt-4 ${parseFloat(card.value) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MarqueeBanner;
