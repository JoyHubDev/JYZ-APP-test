import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const [dramas, setDramas] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('drama');
  const { user } = useAuth();

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    const stored = await AsyncStorage.getItem('contents');
    if (stored) {
      const data = JSON.parse(stored);
      setDramas(data.dramas || []);
      setAnimes(data.animes || []);
    } else {
      // Data default
      const defaultData = {
        dramas: [
          { id: '1', title: 'Bebas dari Bui Cinta', genre: 'Romance', totalEpisodes: 80, image: '🎭', views: '7.8M' },
          { id: '2', title: 'Sang Ahli yang Menyamar', genre: 'Action', totalEpisodes: 62, image: '🎬', views: '11.9M' },
          { id: '3', title: 'KEMBALI KE 2002', genre: 'Drama', totalEpisodes: 50, image: '📺', views: '19.1M' },
        ],
        animes: [
          { id: '1', title: 'Naruto', genre: 'Action', totalEpisodes: 220, image: '🍥', views: '50M' },
          { id: '2', title: 'One Piece', genre: 'Adventure', totalEpisodes: 1000, image: '🏴‍☠️', views: '80M' },
        ]
      };
      setDramas(defaultData.dramas);
      setAnimes(defaultData.animes);
      await AsyncStorage.setItem('contents', JSON.stringify(defaultData));
    }
  };

  const getCurrentList = () => {
    const list = activeTab === 'drama' ? dramas : animes;
    if (searchQuery) {
      return list.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VideoPlayer', { content: item, type: activeTab })}
    >
      <Text style={styles.cardImage}>{item.image}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardInfo}>{item.genre} • {item.totalEpisodes} eps</Text>
      <Text style={styles.cardViews}>👁️ {item.views} ditonton</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📺 JYZ APP</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Cari drama atau anime..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'drama' && styles.activeTab]}
          onPress={() => setActiveTab('drama')}
        >
          <Text style={[styles.tabText, activeTab === 'drama' && styles.activeTabText]}>Drama</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'anime' && styles.activeTab]}
          onPress={() => setActiveTab('anime')}
        >
          <Text style={[styles.tabText, activeTab === 'anime' && styles.activeTabText]}>Anime</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={getCurrentList()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 12,
    paddingHorizontal: 20,
    color: '#fff',
    marginBottom: 15,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
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
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    margin: 6,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  cardImage: {
    fontSize: 50,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardInfo: {
    color: '#888',
    fontSize: 10,
    textAlign: 'center',
  },
  cardViews: {
    color: '#e91e63',
    fontSize: 10,
    marginTop: 4,
  },
});
