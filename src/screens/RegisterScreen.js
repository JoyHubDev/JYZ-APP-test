import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!displayName || !username || !password || !phone) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Error', 'Password minimal 4 karakter');
      return;
    }

    const success = await register(displayName, username, password, phone);
    if (success) {
      Alert.alert('Berhasil', 'Akun berhasil dibuat!');
      // Langsung login, tidak perlu kembali
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📝 Daftar Akun</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nama lengkap"
          placeholderTextColor="#999"
          value={displayName}
          onChangeText={setDisplayName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nomor HP"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Daftar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginLink}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e91e63',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#e91e63',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#e91e63',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});
