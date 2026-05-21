import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// ADMIN CREDENTIALS (WAJIB PERSIS)
const ADMIN_USERNAME = 'JoyManuelajajir';
const ADMIN_PASSWORD = 'JoyManuelajajir2121';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadUser();
    loadAllUsers();
  }, []);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAdmin(userData.username === ADMIN_USERNAME);
    }
  };

  const loadAllUsers = async () => {
    const stored = await AsyncStorage.getItem('allUsers');
    if (stored) {
      setAllUsers(JSON.parse(stored));
    } else {
      setAllUsers([]);
    }
  };

  const register = async (displayName, username, password, phone) => {
    // Cek username sudah ada?
    const existing = allUsers.find(u => u.username === username);
    if (existing) {
      alert('Username sudah dipakai!');
      return false;
    }
    if (username === ADMIN_USERNAME) {
      alert('Username tidak tersedia');
      return false;
    }

    const newUser = {
      displayName,
      username,
      password,
      phone,
      isPremium: false,
      watchHistory: [],
      favorites: [],
      watchCount: 0, // untuk hitung iklan
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...allUsers, newUser];
    await AsyncStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
    setAllUsers(updatedUsers);
    setUser(newUser);
    setIsAdmin(false);
    return true;
  };

  const login = async (username, password) => {
    // Cek admin khusus
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser = {
        displayName: 'Admin JYZ',
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        phone: '000',
        isPremium: true,
        watchHistory: [],
        favorites: [],
        watchCount: 0,
        isAdmin: true
      };
      await AsyncStorage.setItem('currentUser', JSON.stringify(adminUser));
      setUser(adminUser);
      setIsAdmin(true);
      return true;
    }

    // Cek user biasa
    const found = allUsers.find(u => u.username === username && u.password === password);
    if (found) {
      await AsyncStorage.setItem('currentUser', JSON.stringify(found));
      setUser(found);
      setIsAdmin(false);
      return true;
    }

    alert('Username atau password salah!');
    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setUser(null);
    setIsAdmin(false);
  };

  const updateUser = async (newData) => {
    const updated = { ...user, ...newData };
    
    // Update di allUsers
    const updatedUsers = allUsers.map(u => 
      u.username === user.username ? updated : u
    );
    
    await AsyncStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
    setUser(updated);
    setAllUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAdmin, register, login, logout, updateUser, allUsers 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
