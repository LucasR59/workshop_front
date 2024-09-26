import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Image, Text, TouchableHighlight, Alert, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');

const Create = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const isButtonDisabled = !username || !password;
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleButtonCreatePress = () => {
    axios.post('http://10.60.136.248:3000/user/create', {
        username: username,
        password: password,
      })
      .then(response => {
        console.log(response.data);
        Alert.alert('Success!', 'You have created your account.');
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

  const handleButtonBackPress = () => {
    router.push('/');
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Create</Text>
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
        <TextInput
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#aaa"
        />
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={24}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      </View>
      <View style={styles.imageContainer}>
        <TouchableHighlight 
          style={[styles.disabled, { marginRight: 10 }]} 
          onPress={handleButtonBackPress}
          underlayColor="#ddd"
        >
          <Text style={styles.valideText}>Back</Text>
        </TouchableHighlight>
        <TouchableHighlight 
          style={[isButtonDisabled ? styles.disabled : styles.valide, { marginRight: 10 }]} 
          onPress={handleButtonCreatePress} 
          underlayColor="#ddd"
        >
          <Text style={styles.valideText}>Create User</Text>
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
    position: 'absolute',
    right: 10,
    top: 20,
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

export default Create;
