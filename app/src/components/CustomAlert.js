import React from 'react';
import { View, Text, Modal, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStyles } from '../styles/CustomAlert.styles';
import { Colors } from '../theme/Colors';

const CustomAlert = ({ visible, type, title, message, onClose, buttons }) => {
    // 1. Detectar Tema
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = getStyles(isDark);
    const theme = isDark ? Colors.dark : Colors.light;

    // 2. Configurar Icono y Color según el tipo
    let iconName = "information-circle";
    let mainColor = theme.primary; // Azul por defecto

    if (type === 'success') {
        iconName = "checkmark-circle";
        mainColor = theme.success; // Verde del tema
    } else if (type === 'error') {
        iconName = "alert-circle";
        mainColor = theme.error;   // Rojo del tema
    } else if (type === 'warning') {
        iconName = "warning";
        mainColor = theme.warning; // Naranja del tema
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
                    {/* Icono Grande */}
                    <Ionicons name={iconName} size={60} color={mainColor} style={{ marginBottom: 10 }} />

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    {/* Área de Botones */}
                    <View style={styles.buttonContainer}>
                        {buttons && buttons.length > 0 ? (
                            buttons.map((btn, index) => {
                                // Lógica de estilo para botones especiales (ej: Cancelar/Borrar)
                                const isDestructive = btn.style === 'destructive';
                                const isOutline = btn.variant === 'outline';

                                // Color de fondo del botón
                                let btnBg = mainColor;
                                if (isDestructive) {
                                    // En Dark Mode usamos un rojo oscuro transparente, en Light un rojo pálido
                                    btnBg = isDark ? 'rgba(255, 69, 58, 0.2)' : '#FFEBEE';
                                } else if (isOutline) {
                                    btnBg = 'transparent';
                                }

                                // Color del texto del botón
                                let btnTextColor = 'white';
                                if (isDestructive) {
                                    btnTextColor = theme.error;
                                } else if (isOutline) {
                                    btnTextColor = mainColor;
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.btn,
                                            { backgroundColor: btnBg },
                                            isOutline && { borderWidth: 1, borderColor: mainColor }
                                        ]}
                                        onPress={() => {
                                            if (btn.onPress) btn.onPress();
                                            onClose();
                                        }}
                                    >
                                        <Text style={[styles.btnText, { color: btnTextColor }]}>
                                            {btn.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        ) : (
                            // Botón por defecto "Entendido"
                            <TouchableOpacity style={[styles.btn, { backgroundColor: mainColor }]} onPress={onClose}>
                                <Text style={[styles.btnText, { color: 'white' }]}>Entendido</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;