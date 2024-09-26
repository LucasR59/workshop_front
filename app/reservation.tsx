import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import Navigue from './navigue';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const Reservation = () => {
    const params = useLocalSearchParams();
    const created = params.created as string;
    const username = params.username as string;

    const userParams = {
        created: created,
        username: username,
    };

    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [Vuser, setVuser] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

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
    }, []); // Appelé une seule fois lors du premier rendu

    useEffect(() => {
        const fetchReservations = async () => {
            if (Vuser !== null) {
                try {
                    const response = await axios.get(`http://10.60.136.248:3000/items/getListItems`);
                    console.log('API Response:', response.data);

                    if (Array.isArray(response.data)) {
                        setReservations(response.data);
                    } else {
                        setReservations([]);
                        setError('Invalid data format received from API.');
                    }
                } catch (err) {
                    console.error('Error fetching reservations:', err);
                    setError('Failed to fetch reservations.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchReservations();
    }, [Vuser]); // Dépendance sur Vuser pour lancer la récupération des réservations

    const handleConfirmDate = (date: Date) => {
        setSelectedDate(date);
        setDatePickerVisibility(false);
        if (selectedItem) {
            handleReserve(selectedItem.id, date);
        }
    };

    const handleReserve = async (itemId: string, date: Date) => {
        try {
            console.log(formatDate(date.toISOString()));
            console.log(userParams);
            const response = await axios.post('http://10.60.136.248:3000/reservation/create', {
                user_id: Vuser,
                item_id: itemId,
                date: formatDate(date.toISOString()),
            });
            alert('Reservation successful: ' + response.data.message);
        } catch (err) {
            const errorMessage = axios.isAxiosError(err) && err.response
                ? err.response.data.message
                : 'An unknown error occurred';
            alert('Failed to reserve: ' + errorMessage);
        }
    };

    const showDatePicker = (item: any) => {
        setSelectedItem(item);
        setDatePickerVisibility(true);
    };

    return (
        <View style={styles.page}>
            {/* Titre du composant */}
            <Text style={styles.title}>Reservations</Text>

            {/* Conteneur défilant pour les réservations */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.message}>{error}</Text>
                ) : reservations && reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <View key={reservation.id} style={styles.reservation}>
                            <Text style={styles.reservationText}>{`Item: ${reservation.ListItem.libelle}`}</Text>
                            <Text style={styles.reservationText}>{`Quantity: 1`}</Text>
                            <Button title="Reserve" onPress={() => showDatePicker(reservation)} />
                        </View>
                    ))
                ) : (
                    <Text style={styles.message}>You have no reservations.</Text>
                )}
            </ScrollView>

            {/* Composant Navigue toujours visible en bas */}
            <Navigue userParams={userParams} />

            {/* Modal de sélection de date */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={() => setDatePickerVisibility(false)}
                date={selectedDate || new Date()}
            />
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
        marginBottom: 30,
        marginTop: 40,
        textAlign: 'center',
        paddingTop: 40,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Ajoute de l'espace pour que les réservations ne soient pas cachées par Navigue
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

export default Reservation;