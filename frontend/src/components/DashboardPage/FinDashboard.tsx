import MarqueeBanner from "./MarqueeBanner"
import CryptoTopGainers from "./CryptoTopGainers"
import CryptoCTA from "./CryptoCTA"
import StocksTopGainers from "./StocksGainers"
import StocksTopLoser from "./StocksLoser"

const FinDashboard = () => {
  return (
    <div> 
      <MarqueeBanner />
      <div className="flex pt-8">
        <StocksTopGainers />
        <StocksTopLoser />
      </div>
      <CryptoCTA />
      <CryptoTopGainers />
    </div>
  )
}

export default FinDashboard