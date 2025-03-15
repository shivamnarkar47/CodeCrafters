import { request } from "@/lib/axiosRequest";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserProps = {
  username: string;
  email: string;
  userid: number;
  is_superuser: boolean;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
} | null;

type LoginProps = {
  email: string;
  password: string;
};

const User = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  setOrdersData: () => {},
  orders: [],
} as {
  user: UserProps;
  login: (user: LoginProps) => void;
  logout: () => void;
});

export { User };

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps>(null);
  const navigate = useNavigate();
  async function login(values: LoginProps) {
    await request({
      method: "POST",
      url: "login",
      data: values,
      headers: { "Content-Type": "application/json" },
    })
      .then((response: any) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.access}`;
      })
      .catch((error) => {
        console.log(error.message);
      });

    await request({
      method: "GET",
      url: "user",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
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
