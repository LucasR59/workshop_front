import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Navigue from './navigue';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const Profile = () => {
    const params = useLocalSearchParams<{ username: string; created: string }>();
    const router = useRouter();

    const [Vuser, setVuser] = useState<number | null>(null);

    const userParams = {
        username: params.username || 'Unknown',
        created: params.created ? formatDate(params.created) : 'N/A',
    };

    const getUserId = async () => {
        try {
            const userIdString = await AsyncStorage.getItem('user_id');
            if (userIdString !== null) {
                const userId = Number(userIdString);
                console.log('User ID retrieved successfully:', userId);
                return userId;
            } else {
                console.log('No user ID found');
                return null;
            }
        } catch (e) {
            console.error('Error retrieving user ID:', e);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const retrievedUserId = await getUserId();
            setVuser(retrievedUserId);
        };

        fetchUserId();
    }, []); // Ne se déclenche qu'une seule fois lors du montage

    const handleDisconnect = () => {
        router.push('/');
    };

    return (
        <View style={styles.page}>
            <Text style={styles.title}>Profile</Text>

            <View style={styles.userInfo}>
                <Text style={styles.label}>User ID:</Text>
                <Text style={styles.value}>{Vuser !== null ? Vuser : 'Loading...'}</Text>

                <Text style={styles.label}>Username:</Text>
                <Text style={styles.value}>{userParams.username}</Text>

                <Text style={styles.label}>Created On:</Text>
                <Text style={styles.value}>{userParams.created}</Text>
            </View>

            <Navigue userParams={userParams} />

            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    userInfo: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 15,
    },
    disconnectButton: {
        marginTop: 20,
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    disconnectButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Profile;