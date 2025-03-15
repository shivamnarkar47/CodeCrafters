// import { Button } from "@/components/ui/button"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/HomePage/Home"
import Investments from "./components/InvestmentPage/Investments"
import Signup from "./components/AuthPage/Signup"
import Navbar from "./components/utilities/Navbar"
import { UserProvider } from "./context/ContextProvider"
// import Dashboard from "./components/DashboardPage/SideBar"
import SideBar from "./components/DashboardPage/SideBar"
// import { Sidebar } from "lucide-react"
import FinDashboard from "./components/DashboardPage/FinDashboard"
import { ThemeProvider } from "@/components/theme-provider"
import StocksBlock from "./components/DashboardPage/StocksBlock"
import BondsBlock from "./components/DashboardPage/BondsBlock"
import InsuranceBlock from "./components/DashboardPage/InsuranceBlock"
import WatchList from "./components/DashboardPage/WatchList"


function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

        <BrowserRouter>
          <UserProvider>

            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} index />
              <Route path="/dashboard" element={<SideBar />}>
                <Route index element={<FinDashboard />} />
                <Route path="explore" >
                <Route path="stocks" element={<StocksBlock />} />
                <Route path="bonds" element={<BondsBlock />} />
                <Route path="Insurance" element={<InsuranceBlock />} />
                </Route>
                <Route path="watchlist" element={<WatchList />} />
                <Route path="investments" element={<Investments />} />



              </Route>

              <Route path="/auth" element={<Signup />} />
            </Routes>
          </UserProvider>

        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
