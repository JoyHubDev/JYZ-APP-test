import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useAuth();
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const handleBuyPremium = () => {
    Alert.alert(
      'Premium Membership',
      '💎 Premium Member:\n\n• Nonton tanpa iklan\n• Akses semua episode langsung\n• Bisa loncat episode\n• Kualitas HD\n\nHarga: Rp 49.000/bulan\n\nBeli sekarang?',
      [
        { text: 'Nanti', style: 'cancel' },
        { 
          text: 'Beli', 
          onPress: async () => {
            // Simulasi pembayaran
            await updateUser({ isPremium: true });
            Alert.alert('Berhasil', 'Selamat! Anda sekarang premium member 🎉');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.displayName}>{user?.displayName || user?.username}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        {user?.isPremium ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>💎 PREMIUM</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.premiumButton} onPress={handleBuyPremium}>
            <Text style={styles.premiumButtonText}>✨ Jadi Premium ✨</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nomor HP</Text>
          <Text style={styles.infoValue}>{user?.phone || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bergabung sejak</Text>
          <Text style={styles.infoValue}>{user?.createdAt?.split('T')[0] || '-'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🔔 Notifikasi</Text>
          <Switch
            value={notificationEnabled}
            onValueChange={setNotificationEnabled}
            trackColor={{ false: '#333', true: '#e91e63' }}
            thumbColor={notificationEnabled ? '#fff' : '#888'}
          />
        </View>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🌙 Tema Gelap</Text>
          <Text style={styles.menuStatus}>Aktif</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>📱 Kualitas Video</Text>
          <Text style={styles.menuStatus}>Otomatis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lainnya</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>❓ Pusat Bantuan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>📜 Syarat & Ketentuan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🔒 Privasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>ℹ️ Tentang Aplikasi</Text>
          <Text style={styles.versionText}>Versi 1.0.0</Text>
        </TouchableOpacity>
      </View>

      {user?.isAdmin && (
        <TouchableOpacity 
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminPanel')}
        >
          <Text style={styles.adminButtonText}>🛠️ Panel Admin</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>JYZ APP © 2024</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 50,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  username: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  premiumButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  premiumButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  premiumBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  premiumBadgeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  infoLabel: {
    color: '#888',
  },
  infoValue: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  menuStatus: {
    color: '#888',
  },
  versionText: {
    color: '#888',
    fontSize: 12,
  },
  adminButton: {
    backgroundColor: '#9c27b0',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#333',
    marginHorizontal: 15,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 12,
    marginTop: 30,
    marginBottom: 20,
  },
});
