import React, { createContext, useContext, useState } from "react";

type AuthContextData = {
  user: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: () => boolean;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (token: string) => {
    setUser(token); // Simulando o login com o token
  };

  const logout = () => {
    setUser(null); // Limpa o estado de autenticação
  };

  const isLoading = () => {
    return user === null; // Retorna true se ainda estiver aguardando autenticação
  };

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
