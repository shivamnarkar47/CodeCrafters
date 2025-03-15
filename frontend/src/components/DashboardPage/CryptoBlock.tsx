import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'


const CryptoBlock = () => {
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

    console.log(cryptoData)


  return (
    <>
    <div className="flex flex-col items-center justify-center">
        
        <div className="grid md:grid-cols-3 grid-cols-2 gap-10 items-center justify-center mt-5 ">
            {cryptoData.map((crypto:any, index) => (
            <Link to={`/dashboard/explore/crypto/${crypto.id}`} key={index} className="bg-gray-200 p-5 rounded-lg w-96 mt-5 cursor-pointer hover:shadow-lg">
                <h1 className="text-black text-lg font-bold font-Inter ">{crypto.name}</h1>
                <h2 className="text-gray-400 text-sm">{crypto.symbol}</h2>
                <h3 className="text-black text-lg font-bold">Rs. {crypto.current_price.toFixed(2)}</h3>
            </Link>
            ))}
        </div>
    </div>
    </>
  )
}

export default CryptoBlock