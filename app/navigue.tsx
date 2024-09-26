import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const Navigue = ({ userParams }: { userParams: { username: string, created: string } }) => {
    const router = useRouter();

    const handleButtonRoutePress = (route: string) => {
        router.push({
            pathname: `./${route}`,
            params: userParams
        });
    }

    return (
        <View style={styles.footer}>
            <TouchableOpacity 
                style={styles.footerButton} 
                onPress={() => handleButtonRoutePress('profile')}
            >
                <FontAwesome name="user" size={20} color="#000" />
                <Text style={styles.footerText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.footerButton} 
                onPress={() => handleButtonRoutePress('reservation')}
            >
                <FontAwesome name="calendar" size={20} color="#000" />
                <Text style={styles.footerText}>Reservation</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.footerButton} 
                onPress={() => handleButtonRoutePress('history')}
            >
                <FontAwesome name="history" size={20} color="#000" />
                <Text style={styles.footerText}>History</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#f8f8f8',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    footerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 18,
        color: '#333',
    },
});

export default Navigue;
