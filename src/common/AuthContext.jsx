import { createContext, useContext, useState } from "react";
import { users } from "../mock/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("aspiro_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    localStorage.setItem("aspiro_user", JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    return safeUser;
  };

  const logout = () => {
    localStorage.removeItem("aspiro_user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
