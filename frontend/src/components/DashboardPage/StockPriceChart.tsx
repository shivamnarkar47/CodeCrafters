import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';

const StockPriceChart = ({ initialData }) => {
  const [data, setData] = useState(initialData || []);
  const [activeTab, setActiveTab] = useState('price');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const socketRef = useRef(null);

  // Set up WebSocket connection
  useEffect(() => {
    // Using the provided WebSocket endpoint
    const wsUrl = 'ws://localhost:8443/ws/market/';
    socketRef.current = new WebSocket(wsUrl);
    
    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socketRef.current.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData(newData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };
    
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    // Clean up WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  // Calculate price change percentage
  const getPriceChange = (stock) => {
    const currentPrice = parseFloat(stock.current_price);
    const openPrice = parseFloat(stock.open_price);
    return ((currentPrice - openPrice) / openPrice * 100).toFixed(2);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  const processChartData = () => {
    return data.map(stock => ({
      symbol: stock.symbol,
      current: parseFloat(stock.current_price),
      open: parseFloat(stock.open_price),
      high: parseFloat(stock.day_high),
      low: parseFloat(stock.day_low),
      buy: parseFloat(stock.buy_price),
      sell: parseFloat(stock.sell_price),
      range: parseFloat(stock.day_high) - parseFloat(stock.day_low),
      change: getPriceChange(stock),
      timestamp: stock.timestamp
    }));
  };

  const chartData = processChartData();

  // Custom tooltip that shows timestamp
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const stockData = data.find(item => item.symbol === label);
      return (
        <div className="bg-black bg-opacity-80 p-3 rounded-lg border border-gray-700">
          <p className="font-bold text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || '#fff' }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
          {stockData && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(stockData.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full border-none shadow-none">
      <CardHeader className="pb-2">4
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Market Snapshot</CardTitle>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Last updated: {formatTimestamp(lastUpdated)}</span>
          </div>
        </div>
        <CardDescription>
          Real-time stock data (30-second updates)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="price" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="price">Price Comparison</TabsTrigger>
            <TabsTrigger value="range">Trading Range</TabsTrigger>
            <TabsTrigger value="change">Price Change %</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price" className="pt-2">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="symbol" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="current" fill="#3b82f6" name="Current Price" />
                  <Line type="monotone" dataKey="open" stroke="#10b981" name="Open Price" strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="range" className="pt-2">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="symbol" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="range" fill="#8884d8" name="Price Range" />
                  <Area type="monotone" dataKey="high" stroke="#f59e0b" fill="#f59e0b33" name="Day High" />
                  <Area type="monotone" dataKey="low" stroke="#6366f1" fill="#6366f133" name="Day Low" />
                  <Line type="monotone" dataKey="current" stroke="#ef4444" name="Current" strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="change" className="pt-2">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="symbol" />
                  <YAxis unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="change" name="Price Change %">
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={parseFloat(entry.change) >= 0 ? '#10b981' : '#ef4444'} 
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {data.map((stock) => {
            const priceChange = getPriceChange(stock);
            const isPositive = parseFloat(priceChange) >= 0;
            
            return (
              <Card key={stock.symbol} className="p-3 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{stock.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {isPositive ? <ArrowUp size={12} className="inline mr-1" /> : <ArrowDown size={12} className="inline mr-1" />}
                    {Math.abs(parseFloat(priceChange))}%
                  </span>
                </div>
                <div className="mt-2 text-lg font-semibold">{formatPrice(stock.current_price)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="block">O: {formatPrice(stock.open_price)}</span>
                  <span className="block">H: {formatPrice(stock.day_high)} L: {formatPrice(stock.day_low)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Default export with sample data for initial render
const StockPriceChartWithData = () => {
  const sampleData = [
    {"symbol": "AAPL", "current_price": "2770.54", "open_price": "2800.80", "day_high": "2800.80", "day_low": "2739.05", "buy_price": "2773.31", "sell_price": "2767.77", "benchmark_name": "Sensex", "timestamp": "2025-03-16T05:05:01.614069+00:00"},
    {"symbol": "GOOGL", "current_price": "1279.42", "open_price": "1289.64", "day_high": "1292.31", "day_low": "1262.38", "buy_price": "1280.69", "sell_price": "1278.14", "benchmark_name": "Nifty Bank", "timestamp": "2025-03-16T05:05:01.625815+00:00"},
    {"symbol": "MSFT", "current_price": "654.52", "open_price": "654.96", "day_high": "659.91", "day_low": "648.46", "buy_price": "655.18", "sell_price": "653.87", "benchmark_name": "Nifty 50", "timestamp": "2025-03-16T05:05:01.635147+00:00"},
    {"symbol": "AMZN", "current_price": "1468.03", "open_price": "1476.89", "day_high": "1483.04", "day_low": "1451.64", "buy_price": "1469.50", "sell_price": "1466.56", "benchmark_name": "Midcap 100", "timestamp": "2025-03-16T05:05:01.643180+00:00"},
    {"symbol": "NFLX", "current_price": "847.75", "open_price": "861.75", "day_high": "881.13", "day_low": "845.75", "buy_price": "848.59", "sell_price": "846.90", "benchmark_name": "Midcap 100", "timestamp": "2025-03-16T05:05:01.652047+00:00"}
  ];
  
  return <StockPriceChart initialData={sampleData} />;
};

export default StockPriceChartWithData;