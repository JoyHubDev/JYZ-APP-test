import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ForYouScreen({ navigation }) {
  const [trending, setTrending] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    const stored = await AsyncStorage.getItem('trending');
    if (stored) {
      setTrending(JSON.parse(stored));
    } else {
      // Data default
      const defaultTrending = [
        { id: '1', title: 'Bebas dari Bui Cinta', clip: '🎬 Cuplikan episode 1', views: '2.3M', image: '🎭' },
        { id: '2', title: 'Sang Ahli yang Menyamar', clip: '🎬 Cuplikan episode 5', views: '1.8M', image: '🎬' },
        { id: '3', title: 'KEMBALI KE 2002', clip: '🎬 Cuplikan spesial', views: '3.1M', image: '📺' },
        { id: '4', title: 'Naruto Shippuden', clip: '🎬 Cuplikan pertarungan', views: '5.2M', image: '🍥' },
        { id: '5', title: 'One Piece', clip: '🎬 Cuplikan Wano', views: '4.7M', image: '🏴‍☠️' },
        { id: '6', title: 'Mata Keberuntungan', clip: '🎬 Cuplikan exclusive', views: '1.2M', image: '👁️' },
      ];
      setTrending(defaultTrending);
      await AsyncStorage.setItem('trending', JSON.stringify(defaultTrending));
    }
  };

  const renderClip = ({ item }) => (
    <TouchableOpacity 
      style={styles.clipCard}
      onPress={() => navigation.navigate('VideoPlayer', { content: item, type: 'clip' })}
    >
      <View style={styles.clipImageContainer}>
        <Text style={styles.clipImage}>{item.image}</Text>
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
      </View>
      <Text style={styles.clipTitle}>{item.title}</Text>
      <Text style={styles.clipDescription}>{item.clip}</Text>
      <Text style={styles.clipViews}>👁️ {item.views}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔥 Untukmu</Text>
      <Text style={styles.subheader}>Cuplikan terpopuler hari ini</Text>
      
      <FlatList
        data={trending}
        renderItem={renderClip}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
  },
  subheader: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  clipCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  clipImageContainer: {
    height: 200,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clipImage: {
    fontSize: 60,
  },
  playOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
  },
  clipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 12,
    paddingBottom: 5,
  },
  clipDescription: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  clipViews: {
    fontSize: 12,
    color: '#e91e63',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
