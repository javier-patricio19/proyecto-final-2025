import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomAlert = ({ visible, type, title, message, onClose, buttons }) => {
    let iconName = "information-circle";
    let color = "#007AFF";

    if (type === 'success') {
        iconName = "checkmark-circle";
        color = "#4CAF50"; // Verde
    } else if (type === 'error') {
        iconName = "alert-circle";
        color = "#F44336"; // Rojo
    } else if (type === 'warning') {
        iconName = "warning";
        color = "#FF9800"; // Naranja
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    {/* Icono Grande arriba */}
                    <Ionicons name={iconName} size={60} color={color} style={{ marginBottom: 10 }} />

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Área de Botones */}
                    <View style={styles.buttonContainer}>
                        {buttons && buttons.length > 0 ? (
                            buttons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.btn, 
                                        btn.style === 'destructive' ? { backgroundColor: '#FFEBEE' } : { backgroundColor: color },
                                        btn.variant === 'outline' ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: color } : {}
                                    ]}
                                    onPress={() => {
                                        if (btn.onPress) btn.onPress();
                                        onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.btnText,
                                        btn.style === 'destructive' ? { color: '#D32F2F' } : { color: 'white' },
                                        btn.variant === 'outline' ? { color: color } : {}
                                    ]}>
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity style={[styles.btn, { backgroundColor: color }]} onPress={onClose}>
                                <Text style={styles.btnText}>Entendido</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: Dimensions.get('window').width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 10, 
        flexWrap: 'wrap'
    },
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        minWidth: 100,
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 5
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default CustomAlert;