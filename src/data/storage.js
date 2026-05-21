import AsyncStorage from '@react-native-async-storage/async-storage';

// Save any data
export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Save error:', error);
    return false;
  }
};

// Load any data
export const loadData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Load error:', error);
    return null;
  }
};

// Delete data
export const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

// Clear all app data (factory reset)
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Clear error:', error);
    return false;
  }
};

// Get all keys
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('Get keys error:', error);
    return [];
  }
};
