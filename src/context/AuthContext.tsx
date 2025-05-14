import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo login logic
      if (email === 'admin@example.com' && password === 'admin') {
        setUser({
          id: 1,
          name: 'John Doe',
          role: 'Project Manager',
          isAdmin: true
        });
        return true;
      } else if (email === 'employee@example.com' && password === 'employee') {
        setUser({
          id: 2,
          name: 'Michael Chen',
          role: 'Senior Developer',
          isAdmin: false
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: user !== null 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};