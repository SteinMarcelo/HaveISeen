import React, { createContext, useContext, useState } from "react";

type AuthContextData = {
  user: { id: string; username: string } | null;
  login: (token: string, id: string, username: string) => void;
  logout: () => void;
  isLoading: () => boolean;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  const login = (token: string, id: string, username: string) => {
    setUser({ id, username }); // Salva o id e o username do usuário

  };
  

  const logout = () => {
    setUser(null); // Limpa os dados do usuário
  };

  const isLoading = () => user === null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
