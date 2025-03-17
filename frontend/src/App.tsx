// import { Button } from "@/components/ui/button"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Investments from "./components/InvestmentPage/Investments";
import Navbar from "./components/utilities/Navbar";
import { UserProvider } from "./context/ContextProvider";
// import Dashboard from "./components/DashboardPage/SideBar"
import SideBar from "./components/DashboardPage/SideBar";
// import { Sidebar } from "lucide-react"
import FinDashboard from "./components/DashboardPage/FinDashboard";
import { ThemeProvider } from "@/components/theme-provider";
import StocksBlock from "./components/DashboardPage/StocksBlock";
import BondsBlock from "./components/DashboardPage/BondsBlock";
import InsuranceBlock from "./components/DashboardPage/InsuranceBlock";
import WatchList from "./components/DashboardPage/WatchList";
import SignIn from "./components/AuthPage/SignIn";
import SignUp from "./components/AuthPage/SignUp";
import CryptoBlock from "./components/DashboardPage/CryptoBlock";
import CryptoBlockID from "./components/DashboardPage/CryptoBlockID";
import ProtectedRoute from "./components/ProtectedRoute";
import AutoBot from "./components/DashboardPage/AutoBot";
import Wallet from "./components/wallet-app";
import StocksBlockID from "./components/DashboardPage/StocksBlockID";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <UserProvider>
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} index />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<SideBar />}>
                  <Route index element={<FinDashboard />} />
                  <Route path="explore">
                    <Route path="stocks"  >
                      <Route index element={<StocksBlock />} />
                      <Route path=":id" element={<StocksBlockID/>} />
                      </Route>
                    <Route path="crypto">
                      <Route index element={<CryptoBlock />} />
                      <Route path=":id" element={<CryptoBlockID />} />
                    </Route>
                    
                    <Route path="bonds" element={<BondsBlock />} />
                    <Route path="insurance" element={<InsuranceBlock />} />
                  </Route>
                  <Route path="watchlist" element={<WatchList />} />
                  <Route path="investments" element={<Investments />} />
                  <Route path="autobot" element={<AutoBot />} />
                  <Route path="wallet" element={<Wallet />} />
                </Route>
              </Route>

              <Route path="/auth">
                <Route index element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
              </Route>
            </Routes>
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
