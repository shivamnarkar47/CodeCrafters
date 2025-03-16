import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMoneyBillWave, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { request } from '@/lib/axiosRequest';
import { Button } from '../ui/button';
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Label } from "@/components/ui/field"
// import { Input, TextField } from "@/components/ui/textfield"
import { NumberField, NumberFieldInput, NumberFieldSteppers } from "../ui/numberfield"
const formatCurrency = (value: any) => {
    if (!value) return 'N/A';
    if (value >= 1e9) return `₹ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `₹ ${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `₹ ${(value / 1e3).toFixed(2)}K`;
    return `₹${value.toFixed(2)}`;
};

const CryptoBlockID = () => {
    const { id } = useParams();
    const [cryptoData, setCryptoData] = useState<any>(null);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
                const data = await response.json();
                setCryptoData(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };
        fetchCryptoData();
    }, [id]);

    const postWatchList = () => {
        request({
            url: "favorites",
            method: "POST",
            data: {
                stock_symbol: cryptoData.symbol,
                stock_name: cryptoData.name,
                exchange: "crypto",
                high_24h: cryptoData.market_data.high_24h.inr,
                low_24h: cryptoData.market_data.low_24h.inr,


            }
        }).then((res) => {
            console.log(res.data)
            navigate('/dashboard/watchlist')
        })
    }

    const buyCrypto = () => {
        request({
            method: "POST",
            url: "transactions",
            data: {
                stock_symbol: cryptoData.symbol,
                stock_name: cryptoData.name,
                exchange: "crypto",
                price: cryptoData.market_data.current_price.inr*quantity,
                quantity: quantity,
                transaction_type: "buy"
            }
        }).then((res) => {
            console.log(res.data)

        })
    }

    const [quantity, setQuantity] = useState(1);


    if (!cryptoData) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 pt-12 pb-24 mx-auto">
                <div className="flex flex-col justify-between text-center w-full mb-10 ">
                    <div className="flex justify-between items-center px-16 pb-6">
                        <div className="flex items-center gap-2 text-center ">
                            <img src={cryptoData.image?.large} className='w-10' alt="" />
                            <h1 className="text-3xl font-bold dark:text-gray-100 text-gray-900">{cryptoData.name}</h1>
                        </div>
                        <div className="flex gap-4 items-center">
                            <Button className='bg-blue-300 px-8 rounded-full font-semibold h-10 hover:cursor-pointer' onPress={postWatchList}>ADD TO WATCHLIST</Button>
                            {/* <Button className='bg-green-400 px-8 rounded-full font-bold h-10 hover:cursor-pointer'>BUY</Button> */}
                            <DialogTrigger>
                                <Button className={"bg-green-400 px-8 dark:text-white text-white rounded-full font-bold h-10 hover:cursor-pointer"} variant="default">BUY</Button>
                                <DialogOverlay>
                                    <DialogContent className="sm:max-w-[425px]">
                                        {() => (
                                            <>
                                                <DialogHeader>
                                                    <DialogTitle>Invest in your future :)</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <NumberField defaultValue={10} minValue={1}>
                                                        <Label className="p-2 ">Quantity</Label>
                                                        <FieldGroup className={'my-4'}>
                                                            <NumberFieldInput onChange={(e) => { setQuantity(Number(e.target.value)) }} />
                                                            <NumberFieldSteppers />
                                                        </FieldGroup>
                                                    </NumberField>
                                                </div>
                                                <DialogFooter>
                                                    <Button   onPress={buyCrypto} className={'bg-green-600 dark:bg-green-400 uppercase font-bold cursor-pointer'}>
                                                        Buy Now
                                                    </Button>
                                                </DialogFooter>
                                            </>
                                        )}
                                    </DialogContent>
                                </DialogOverlay>
                            </DialogTrigger>
                        </div>
                    </div>
                    <p className="lg:w-[90%] dark:text-white text-gray-800 mx-auto leading-relaxed text-justify text-base">{cryptoData.description?.en}</p>
                </div>
                <div className="flex flex-wrap lg:w-[90%] mx-auto -m-4 text-center">
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                            <FaChartLine className="text-yellow-500 w-12 h-12 mb-3 inline-block" />
                            <h2 className="title-font font-medium text-3xl text-gray-900">{cryptoData.market_cap_rank}</h2>
                            <p className="leading-relaxed">Market Cap Rank</p>
                        </div>
                    </div>
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                            <FaMoneyBillWave className="text-indigo-500 w-12 h-12 mb-3 inline-block" />
                            <h2 className="title-font font-medium text-3xl dark:text-white/40 text-gray-900">{formatCurrency(cryptoData.market_data?.current_price.inr)}</h2>
                            <p className="leading-relaxed">Current Price</p>
                        </div>
                    </div>
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                            <FaArrowUp className="text-green-500 w-12 h-12 mb-3 inline-block" />
                            <h2 className="title-font font-medium text-3xl dark:text-white text-gray-900">{formatCurrency(cryptoData.market_data?.high_24h.inr)}</h2>
                            <p className="leading-relaxed dark:text-white/40 ">24h High</p>
                        </div>
                    </div>
                    <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                        <div className="border-2 border-gray-200 px-4 py-6 rounded-lg">
                            <FaArrowDown className="text-red-500 w-12 h-12 mb-3 inline-block" />
                            <h2 className="title-font font-medium text-3xl text-gray-900">{formatCurrency(cryptoData.market_data?.low_24h.inr)}</h2>
                            <p className="leading-relaxed">24h Low</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CryptoBlockID;
