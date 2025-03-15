import { Button } from "@/components/ui/button"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/HomePage/Home"
import Investments from "./components/InvestmentPage/Investments"
import AuthPage from "./components/AuthPage/AuthPage"
import Navbar from "./components/utilities/Navbar"
import { UserProvider } from "./context/ContextProvider"
import Dashboard from "./components/DashboardPage/Dashboard"

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>

          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} index />
            <Route path="/:uid/dashboard" element={<Dashboard />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </UserProvider>

      </BrowserRouter>
    </>
  )
}

export default App
