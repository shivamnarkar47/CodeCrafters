import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

interface CryptoData {
    id: string;
    name: string;
    image: string;
    current_price: number;
}

const TopGainers = () => {
    const [cryptoData, setCryptoData] = React.useState<CryptoData[]>([])

    const fetchCryptoData = async () => {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        const data = await response.json()
        setCryptoData(data.sort((a: any, b: any) => b.current_price - a.current_price).slice(0, 9))
    }

    useEffect(() => {
        fetchCryptoData()
    }, [])

    const navigate = useNavigate();

    return (
    <>  
        <h1 className="text-center font-bold text-3xl mt-18">TOP CRYPTO GAINS</h1>
        <p className="text-center font-bold text-gray-300 text-lg mb-12">( Last 24h )</p>
        <section className="text-gray-600 body-font">
            <div className="container px-5 pb-24 mx-auto">
                <div className="flex flex-wrap -m-2">
                    {cryptoData.map((crypto, index) => (
                        <div key={index}  onClick={()=>navigate(`/dashboard/explore/crypto/${crypto.id}`)} className="p-2 hover:cursor-pointer lg:w-1/3 md:w-1/2 w-full">
                            <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src={crypto.image} />
                                <div className="flex-grow">
                                    <h2 className="text-gray-900 title-font font-medium">{crypto.name}</h2>
                                    <p className="text-gray-500">${crypto.current_price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>    
            </div>
        </section>
    </>
  )
}

export default TopGainers