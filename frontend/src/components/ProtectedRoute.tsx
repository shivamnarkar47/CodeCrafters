import { useUserContext } from "@/context/ContextProvider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { user } = useUserContext();
    return user ? <Outlet /> : <Navigate to="/auth/" />;
  };


  export default ProtectedRoute