import React, { useEffect } from 'react'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table";


const CryptoTable = () => {
        const [cryptoData, setCryptoData] = React.useState([])
    
        const fetchCryptoData = async () => {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            const data = await response.json()
            setCryptoData(data)
        }
    
        useEffect(() => {
            fetchCryptoData()
    
        }
        , [])
    

    return (
      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Crypto Name</TableHead>
              <TableHead>Current Value</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Day High</TableHead>
              <TableHead className="text-right">Day Low</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptoData.map((crypto:any, index:any)  => (
              <TableRow key={index} className='hover:cursor-pointer'>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      className="rounded-full"
                      src={crypto.image}
                      width={40}
                      height={40}
                      alt={crypto.name}
                    />
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <span className="mt-0.5 text-xs text-muted-foreground">{crypto.username}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>USD {crypto.current_price}</TableCell>
                <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                <TableCell>{crypto.high_24h}</TableCell>
                <TableCell className="text-right">{crypto.low_24h}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
}
  
export default CryptoTable