import { Link } from "react-router-dom"

const CryptoCTA = () => {
  return (
    <>
        <section className="text-gray-600 mt-12 border-y-2 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
                <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">Unlock Your Financial Potential with Crypto</h1>
                <Link to="/dashboard/explore/crypto">
                    <button className="flex-shrink-0 text-white bg-black border-0 py-2 px-8 focus:outline-none hover:bg-gray-800 hover:cursor-pointer rounded text-lg mt-10 sm:mt-0">Invest Now</button>
                </Link>
                </div>
            </div>
        </section>
    </>
  )
}

export default CryptoCTA