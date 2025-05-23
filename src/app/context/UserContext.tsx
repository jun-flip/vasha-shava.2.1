'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Order } from '../../types';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  addToFavorites: (itemId: number) => void;
  removeFromFavorites: (itemId: number) => void;
  getOrderHistory: () => Order[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Загрузка данных пользователя из localStorage при монтировании
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Сохранение данных пользователя в localStorage при изменении
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // TODO: Реализовать реальную аутентификацию
    const mockUser: User = {
      id: '1',
      name: 'Тестовый пользователь',
      email,
      loyaltyPoints: 0,
      favoriteItems: [],
      orderHistory: []
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Partial<User>) => {
    // TODO: Реализовать реальную регистрацию
    const mockUser: User = {
      id: '1',
      name: userData.name || 'Новый пользователь',
      email: userData.email || '',
      loyaltyPoints: 0,
      favoriteItems: [],
      orderHistory: []
    };
    setUser(mockUser);
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const addToFavorites = (itemId: number) => {
    if (user) {
      const updatedFavorites = [...(user.favoriteItems || []), itemId];
      setUser({ ...user, favoriteItems: updatedFavorites });
    }
  };

  const removeFromFavorites = (itemId: number) => {
    if (user) {
      const updatedFavorites = (user.favoriteItems || []).filter(id => id !== itemId);
      setUser({ ...user, favoriteItems: updatedFavorites });
    }
  };

  const getOrderHistory = () => {
    return user?.orderHistory || [];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateProfile,
        addToFavorites,
        removeFromFavorites,
        getOrderHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 