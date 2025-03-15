import { request } from "@/lib/axiosRequest";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserProps = {
  
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
} | null;


const User = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  setOrdersData: () => {},
  orders: [],
} as {
  user: UserProps;
  login: () => void;
  logout: () => void;
});

export { User };

export function resetAllTokens() {
  axios.defaults.headers.common["Authorization"] = null;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function setAccessToken(token: string) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("access", token);
}

export  function setRefreshToken(token: string) {
  localStorage.setItem("refresh", token);
}


export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps>(null);
  const navigate = useNavigate();
  async function login() {
    await request({
      method: "GET",
      url: "profile",

      headers: { "Content-Type": "application/json" },
    })
      .then((response: any) => {
       setUser(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
      });

    
  }

  function logout() {
    setUser(null);
  }

  return (
    <User.Provider value={{ user, login, logout }}>{children}</User.Provider>
  );
}

export function useUserContext() {
  const { user, login, logout } = useContext(User);

  return { user, login, logout };
}
