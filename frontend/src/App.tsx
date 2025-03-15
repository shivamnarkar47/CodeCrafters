import { Button } from "@/components/ui/button"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/HomePage/Home"
import Investments from "./components/InvestmentPage/Investments"
import AuthPage from "./components/AuthPage/AuthPage"

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} index/>
      <Route path="/investments" element={<Investments/>} />
      <Route path="/auth" element={<AuthPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
