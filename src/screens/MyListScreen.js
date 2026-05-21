import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyListScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    const stored = await AsyncStorage.getItem('currentUser');
    if (stored) {
      const userData = JSON.parse(stored);
      setFavorites(userData.favorites || []);
      setHistory(userData.watchHistory || []);
    }
  };

  const removeFavorite = async (id) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
    await updateUser({ favorites: newFavorites });
    Alert.alert('Berhasil', 'Dihapus dari favorit');
  };

  const clearHistory = async () => {
    Alert.alert(
      'Hapus Riwayat',
      'Yakin ingin menghapus semua riwayat tontonan?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          onPress: async () => {
            setHistory([]);
            await updateUser({ watchHistory: [] });
            Alert.alert('Berhasil', 'Riwayat dihapus');
          }
        }
      ]
    );
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => navigation.navigate('VideoPlayer', { content: item, type: item.type })}
    >
      <Text style={styles.historyIcon}>{item.image}</Text>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text style={styles.historySub}>Terakhir ditonton: {item.lastWatched || 'Episode 1'}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFavorite(item.id)}>
        <Text style={styles.deleteIcon}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHistory = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => navigation.navigate('VideoPlayer', { content: item.content, episode: item.episode })}
    >
      <Text style={styles.historyNumber}>{index + 1}</Text>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text style={styles.historySub}>Episode {item.episode} • {item.date}</Text>
      </View>
      <Text style={styles.resumeIcon}>▶️</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Daftar Saya</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            ❤️ Favorit ({favorites.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            📜 Riwayat ({history.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'favorites' ? (
        favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💔</Text>
            <Text style={styles.emptyText}>Belum ada favorit</Text>
            <Text style={styles.emptySub}>Tonton drama/anime dan tambahkan ke favorit</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavorite}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Belum ada riwayat</Text>
            <Text style={styles.emptySub}>Tonton episode apapun untuk mulai riwayat</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Hapus semua riwayat</Text>
            </TouchableOpacity>
            <FlatList
              data={history}
              renderItem={renderHistory}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#e91e63',
  },
  tabText: {
    color: '#888',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  historyNumber: {
    color: '#e91e63',
    fontSize: 16,
    fontWeight: 'bold',
    width: 35,
  },
  historyIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historySub: {
    color: '#888',
    fontSize: 12,
  },
  deleteIcon: {
    fontSize: 20,
    color: '#e91e63',
  },
  resumeIcon: {
    fontSize: 20,
    color: '#e91e63',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySub: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});
