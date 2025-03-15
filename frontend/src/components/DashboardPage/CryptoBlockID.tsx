//@ts-nocheck
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const CryptoBlockID = () => {
    const {id} = useParams();
    const [cryptoData, setCryptoData] = React.useState([])
    const fetchCryptoData = async () => {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
        const data = await response.json()
        setCryptoData(data)
        console.log(data)
    }
    useEffect(() => {
        fetchCryptoData()
    }
    , [])
  return (
    <>
    <div>

        <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-200 p-5 rounded-lg w-96 mt-5 cursor-pointer hover:shadow-lg">
                <h1 className="text-black text-lg font-bold">{cryptoData.name}</h1>
                <h2 className="text-gray-400 text-sm">{cryptoData.symbol}</h2>
                <h3 className="text-black text-lg font-bold">Rs.{cryptoData.market_data?.current_price.inr}</h3>
            </div>
        </div>



    </div>

    </>
  )
}

export default CryptoBlockID