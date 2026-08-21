import React, { createContext, useContext, useState, type ReactNode,  } from 'react';

// 🔄 Expandimos los roles permitidos en el sistema a tus 2 tipos reales
export type UserRole = 1 | 2;

//interfaz aceptada para el usuario logeado
interface User {
  idUsuario: string;
  // Usuario: string;
  idPerfil:number;
  role: UserRole;
  nombreCompleto: string;
}

// interfaz para el AuthContext
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};