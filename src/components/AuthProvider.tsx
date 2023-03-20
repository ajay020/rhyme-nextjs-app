import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "@/common/config";

interface Props {
  children: React.ReactNode;
}

type BaseUser = {
  name: string;
  email: string;
  password: string;
};

type LocalUser = BaseUser & {
  _id: string;
  token: string;
};

interface ContextType {
  user: LocalUser | null;
  register: (data: BaseUser) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  error: string;
}

export const AuthContext = createContext<ContextType>({
  user: null,
  register: () => {},
  login: async () => {},
  logout: async () => {},
  loading: false,
  error: "",
});

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setUser(user);
    }
  }, []);

  const register = async (userData: BaseUser) => {
    setLoading(true);
    try {
      const { user, token } = await registerUser(userData);
      setUser(user);
      localStorage.setItem("user", JSON.stringify({ ...user, token }));
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { user, token } = await loginUser(email, password);
      if (token) {
        // set the user in state
        setUser(user);

        // save the token in local storage
        localStorage.setItem("user", JSON.stringify({ ...user, token }));

        // redirect the user to the home page
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // remove the token from local storage
    localStorage.removeItem("user");

    // remove the user from state
    setUser(null);

    // redirect the user to the login page
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

async function registerUser(userData: BaseUser) {
  const response = await fetch(BASE_URL + "/api/auth/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const {
    data: { user },
    token,
  } = await response.json();
  return { user, token };
}

async function loginUser(email: string, password: string) {
  const response = await fetch(BASE_URL + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const {
    data: { user },
    token,
  } = await response.json();
  return { user, token };
}
