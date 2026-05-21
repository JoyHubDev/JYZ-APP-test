import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VideoPlayerScreen({ route, navigation }) {
  const { content, type } = route.params;
  const { user, updateUser } = useAuth();
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [showAd, setShowAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);
  const [watchCount, setWatchCount] = useState(0);

  useEffect(() => {
    loadEpisodes();
    loadWatchCount();
    setupBackHandler();
  }, []);

  const setupBackHandler = () => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
  };

  const loadEpisodes = async () => {
    const stored = await AsyncStorage.getItem(`episodes_${content.id}`);
    if (stored) {
      setEpisodes(JSON.parse(stored));
    } else {
      // Generate episodes 1 to totalEpisodes
      const total = content.totalEpisodes || 80;
      const eps = [];
      for (let i = 1; i <= total; i++) {
        eps.push({
          number: i,
          title: `Episode ${i}`,
          duration: '~45 menit',
        });
      }
      setEpisodes(eps);
      await AsyncStorage.setItem(`episodes_${content.id}`, JSON.stringify(eps));
    }
  };

  const loadWatchCount = async () => {
    if (user) {
      setWatchCount(user.watchCount || 0);
    }
  };

  const addToHistory = async () => {
    const newHistory = {
      id: content.id,
      title: content.title,
      episode: currentEpisode,
      image: content.image,
      type: type,
      date: new Date().toLocaleDateString(),
    };
    
    const currentHistory = user.watchHistory || [];
    const filtered = currentHistory.filter(h => h.id !== content.id);
    const updatedHistory = [newHistory, ...filtered].slice(0, 50);
    
    await updateUser({ watchHistory: updatedHistory });
  };

  const addToWatchCount = async () => {
    const newCount = watchCount + 1;
    setWatchCount(newCount);
    await updateUser({ watchCount: newCount });
    
    // Show ad every 3 episodes for non-premium
    if (!user?.isPremium && newCount % 3 === 0) {
      showInterstitialAd();
    }
  };

  const showInterstitialAd = () => {
    Alert.alert(
      '📺 Iklan',
      'Iklan akan muncul selama 5 detik...\n\nSetelah menonton 3 episode, Anda perlu menonton iklan.',
      [
        { 
          text: 'Tonton Iklan', 
          onPress: () => {
            setShowAd(true);
            setAdCountdown(5);
            const timer = setInterval(() => {
              setAdCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(timer);
                  setShowAd(false);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }
        }
      ]
    );
  };

  const handlePlayEpisode = async (epNumber) => {
    // Premium check for skipping episodes
    if (!user?.isPremium && epNumber > currentEpisode + 1) {
      Alert.alert(
        '🔒 Episode Terkunci',
        'Anda harus menonton episode sebelumnya secara berurutan.\n\nAtau upgrade ke Premium untuk akses semua episode!',
        [
          { text: 'OK', style: 'cancel' },
          { text: 'Jadi Premium', onPress: () => navigation.navigate('Profile') }
        ]
      );
      return;
    }

    // Check if episode is already watched
    if (epNumber > currentEpisode) {
      setCurrentEpisode(epNumber);
      await addToHistory();
      await addToWatchCount();
    } else {
      setCurrentEpisode(epNumber);
    }

    // Simulate video playing
    Alert.alert(
      '▶️ Memutar Video',
      `${content.title}\nEpisode ${epNumber}\n\nMode: ${user?.isPremium ? 'PREMIUM (Tanpa Iklan)' : 'Free (Iklan tiap 3 episode)'}`,
      [{ text: 'Putar', onPress: () => console.log('Playing') }]
    );
  };

  const canAccessEpisode = (epNumber) => {
    if (user?.isPremium) return true;
    return epNumber <= currentEpisode || epNumber === currentEpisode + 1;
  };

  const renderEpisode = (ep) => {
    const isLocked = !canAccessEpisode(ep.number);
    
    return (
      <TouchableOpacity
        key={ep.number}
        style={[
          styles.episodeCard,
          currentEpisode === ep.number && styles.activeEpisode,
          isLocked && styles.lockedEpisode,
        ]}
        onPress={() => handlePlayEpisode(ep.number)}
        disabled={isLocked && ep.number > currentEpisode + 1}
      >
        <Text style={styles.episodeNumber}>EP {ep.number}</Text>
        <Text style={styles.episodeTitle}>{ep.title}</Text>
        <Text style={styles.episodeDuration}>{ep.duration}</Text>
        {isLocked && ep.number > currentEpisode + 1 && (
          <Text style={styles.lockIcon}>🔒</Text>
        )}
        {user?.isPremium && (
          <Text style={styles.premiumIcon}>💎</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (showAd) {
    return (
      <View style={styles.adContainer}>
        <Text style={styles.adTitle}>📺 Iklan</Text>
        <Text style={styles.adText}>Video akan diputar setelah iklan</Text>
        <View style={styles.adCountdown}>
          <Text style={styles.adCountdownText}>{adCountdown} detik</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Text style={styles.videoPlaceholder}>🎬</Text>
        <Text style={styles.nowPlaying}>
          {content.title} - Episode {currentEpisode}
        </Text>
        {!user?.isPremium && (
          <Text style={styles.adInfo}>
            Iklan akan muncul setiap 3 episode
          </Text>
        )}
        {user?.isPremium && (
          <Text style={styles.premiumInfo}>
            💎 Mode Premium - Bebas iklan & akses semua episode
          </Text>
        )}
      </View>

      <ScrollView style={styles.episodeList}>
        <Text style={styles.episodeListTitle}>
          Daftar Episode ({episodes.length})
          {!user?.isPremium && (
            <Text style={styles.lockInfo}> • Episode terkunci: 🔒</Text>
          )}
        </Text>
        {episodes.map(renderEpisode)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: 250,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  videoPlaceholder: {
    fontSize: 60,
    marginBottom: 15,
  },
  nowPlaying: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  adInfo: {
    color: '#ff9800',
    fontSize: 12,
    marginTop: 5,
  },
  premiumInfo: {
    color: '#ffd700',
    fontSize: 12,
    marginTop: 5,
  },
  episodeList: {
    flex: 1,
    padding: 15,
  },
  episodeListTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  lockInfo: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: 'normal',
  },
  episodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a11a1a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  activeEpisode: {
    backgroundColor: '#e91e63',
  },
  lockedEpisode: {
    backgroundColor: '#2a2a2a',
    opacity: 0.6,
  },
  episodeNumber: {
    color: '#fff',
    fontWeight: 'bold',
    width: 60,
  },
  episodeTitle: {
    color: '#fff',
    flex: 1,
  },
  episodeDuration: {
    color: '#888',
    fontSize: 12,
    width: 70,
    textAlign: 'right',
  },
  lockIcon: {
    color: '#ff4444',
    marginLeft: 10,
  },
  premiumIcon: {
    color: '#ffd700',
    marginLeft: 10,
  },
  adContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adTitle: {
    color: '#ff9800',
    fontSize: 32,
    marginBottom: 20,
  },
  adText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 30,
  },
  adCountdown: {
    backgroundColor: '#333',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  adCountdownText: {
    color: '#fff',
    fontSize: 24,
  },
});
