import { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // In a real app, you would validate credentials with your backend
    if (username && password) {
      const user = { username };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (username: string, password: string) => {
    // In a real app, you would create a new user in your backend
    if (username && password) {
      const user = { username };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
