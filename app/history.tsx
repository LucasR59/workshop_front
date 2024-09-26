import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import Navigue from './navigue';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const History = () => {
    const params = useLocalSearchParams<{ username: string; created: string }>();

    const userParams = {
        username: params.username || 'Unknown',
        created: params.created ? formatDate(params.created) : 'N/A',
    };

    const [reservations, setReservations] = useState<any[]>([]);
    const [Vuser, setVuser] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
    }, []); // Ce useEffect ne s'exécute qu'une seule fois

    useEffect(() => {
        const fetchReservations = async (retrievedUserId: number | null) => {
            if (retrievedUserId !== null) {
                try {
                    const response = await axios.post(`http://10.60.136.248:3000/reservation/user/${retrievedUserId}`);
                    console.log('API Response:', response.data);

                    if (Array.isArray(response.data)) {
                        setReservations(response.data);
                    } else {
                        setReservations([]);
                        setError('Unexpected data format received from the API.');
                    }
                } catch (err) {
                    console.error('Error fetching reservations:', err);
                    setError('Failed to fetch reservations.');
                } finally {
                    setLoading(false);
                }
            } else {
                setReservations([]);
                setError('User ID is not available.');
                setLoading(false);
            }
        };

        if (Vuser !== null) { // Assurez-vous que Vuser est défini avant d'appeler fetchReservations
            const timer = setTimeout(() => {
                fetchReservations(Vuser);
            }, 1000); // Attendez 1 seconde avant de lancer la fonction

            return () => clearTimeout(timer); // Nettoyez le timer si le composant est démonté
        }
    }, [Vuser]); // Cette useEffect se déclenche lorsque Vuser change

    return (
        <View style={styles.page}>
            {/* Titre toujours visible */}
            <Text style={styles.title}>History</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.message}>{error}</Text>
                ) : reservations && reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <View key={reservation.id} style={styles.reservation}>
                            <Text style={styles.reservationText}>{`Reservation ID: ${reservation.id}`}</Text>
                            <Text style={styles.reservationText}>{`Start Date: ${formatDate(reservation.date_debut)}`}</Text>
                            <Text style={styles.reservationText}>{`End Date: ${formatDate(reservation.date_fin)}`}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.message}>You have no reservations.</Text>
                )}
            </ScrollView>

            {/* Navigue toujours visible en bas */}
            <Navigue userParams={userParams} />
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 50,
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#fff', // Optionnel : couleur de fond pour le titre
    },
    scrollContainer: {
        paddingBottom: 80, // Espace en bas pour éviter que le contenu soit caché par Navigue
    },
    reservation: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    reservationText: {
        fontSize: 16,
        color: '#333',
    },
    message: {
        fontSize: 18,
        color: '#ff0000',
        textAlign: 'center',
    },
});

export default History;