import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Image, Text, TouchableHighlight, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Auth = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isButtonDisabled = !username || !password;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const storeData = async (userID: number) => {
    try {
      await AsyncStorage.setItem('user_id', userID.toString());
      console.log('User ID stored successfully:', userID);
    } catch (e) {
      console.error('Error saving user ID:', e);
    }
  };

  const handleButtonConnectPress = () => {
    axios.post('http://10.60.136.248:3000/user/login', {
      username: username,
      password: password,
    })
    .then(response => {
      const user = {
        user_id: response.data[0].id,
        username: response.data[0].username,
        created: response.data[0].createdAt,
      }
      console.log('user ' + user.user_id);
      
      storeData(user.user_id);
      
      router.push({ pathname: "/reservation", params: user });
      Alert.alert('Success!', 'You are logged in.');
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    })
    .finally(() => {
      setPassword('');
      setUsername('');
    });
  };

  const handleButtonCreatePress = () => {
    router.push('/create');
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Connexion</Text>
      
      <View style={styles.label}>
        <Text>Username</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#aaa"
        />
      </View>
      
      <View style={styles.label}>
        <Text>Password</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.passwordContainer}>
          <TextInput
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter Password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={toggleShowPassword}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#aaa"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <TouchableHighlight 
          style={[styles.valide, { marginRight: 10 }]} 
          onPress={handleButtonCreatePress}
          underlayColor="#ddd"
        >
          <Text style={styles.valideText}>Create User</Text>
        </TouchableHighlight>
        <TouchableHighlight 
          style={isButtonDisabled ? styles.disabled : styles.valide} 
          onPress={handleButtonConnectPress} 
          underlayColor="#ddd"
          disabled={isButtonDisabled}
        >
          <Text style={styles.valideText}>Connect</Text>
        </TouchableHighlight>
      </View>
      
      <View style={styles.imageContainer}>
        <Image source={require('../images/epsi.png')} style={styles.imageEPSI} />
        <Image source={require('../images/wis.png')} style={styles.imageWIS} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  container: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '80%',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#333',
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  label: {
    color: '#333',
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: width * 0.11,
  },
  valide: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: '#4a4a4a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  valideText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  icon: {
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  imageEPSI: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginRight: 10,
  },
  imageWIS: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
});

export default Auth;