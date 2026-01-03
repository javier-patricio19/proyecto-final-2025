import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getStyles } from '../styles/FormularioObservacion.styles';
import { useFormularioObservacion } from '../hooks/useFormularioObservacion';
import CustomAlert from '../components/CustomAlert';

const FormularioObservacionScreen = ({ route, navigation }) => {
    // 1. Tema Global
    const theme = useColorScheme();
    const isDark = theme === 'dark';
    const styles = getStyles(isDark);
    
    // Color del texto dentro del Picker (necesario para Android/iOS en dark mode)
    const pickerTextColor = isDark ? '#FFFFFF' : '#000000';

    // 2. Lógica del Hook
    const {
        form,
        listaElementos,
        fotos,
        alertConfig,
        hideAlert,
        handleChange,
        handleGuardar
    } = useFormularioObservacion(navigation, route.params);

    return (
        <View style={styles.container}>
            {/* Header con Fotos */}
            <View style={styles.photosHeader}>
                <ScrollView horizontal contentContainerStyle={styles.thumbScrollView}>
                    {fotos && fotos.map((uri, i) => (
                        <Image key={i} source={{uri}} style={styles.thumbHeader} />
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Título y Botón Volver */}
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Verifica los datos:</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backLink}>❮ Volver a Dictar</Text>
                    </TouchableOpacity>
                </View>
                
                {/* --- CAMPOS DEL FORMULARIO --- */}

                <Text style={styles.label}>Elemento:</Text>
                <View style={styles.inputContainer}>
                    <Picker
                        selectedValue={form.elementoId}
                        onValueChange={(v) => handleChange('elementoId', v)}
                        style={styles.picker}
                        dropdownIconColor={pickerTextColor}
                        itemStyle={{color: pickerTextColor}} // Para iOS
                    >
                        <Picker.Item label="-- Selecciona --" value="" color={pickerTextColor} />
                        {listaElementos.map((item) => (
                            <Picker.Item key={item.id} label={item.nombre} value={item.id} color={pickerTextColor} />
                        ))}
                    </Picker>
                </View>

                {/* Fila Doble: Cuerpo y Carril */}
                <View style={styles.row}>
                    <View style={styles.colLeft}>
                        <Text style={styles.label}>Cuerpo:</Text>
                        <View style={styles.inputContainer}>
                            <Picker 
                                selectedValue={form.cuerpo} 
                                onValueChange={v => handleChange('cuerpo', v)}
                                style={styles.picker}
                                dropdownIconColor={pickerTextColor}
                                itemStyle={{color: pickerTextColor}}
                            >
                                <Picker.Item label="--" value="" color={pickerTextColor}/>
                                <Picker.Item label="A" value="A" color={pickerTextColor}/>
                                <Picker.Item label="B" value="B" color={pickerTextColor}/>
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.colRight}>
                        <Text style={styles.label}>Carril:</Text>
                        <View style={styles.inputContainer}>
                            <Picker 
                                selectedValue={form.carril} 
                                onValueChange={v => handleChange('carril', v)}
                                style={styles.picker}
                                dropdownIconColor={pickerTextColor}
                                itemStyle={{color: pickerTextColor}}
                            >
                                <Picker.Item label="--" value="" color={pickerTextColor}/>
                                <Picker.Item label="1" value="1" color={pickerTextColor}/>
                                <Picker.Item label="2" value="2" color={pickerTextColor}/>
                                <Picker.Item label="3" value="3" color={pickerTextColor}/>
                                <Picker.Item label="Acot." value="Acotamiento" color={pickerTextColor}/>
                            </Picker>
                        </View>
                    </View>
                </View>

                <Text style={styles.label}>Kilómetro:</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        value={form.kilometro} 
                        onChangeText={t => handleChange('kilometro', t)}
                        placeholder="000+000"
                        placeholderTextColor="#999"
                        keyboardType="default"
                    />
                </View>

                <Text style={styles.label}>Observación:</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={[styles.input, {height: 80, textAlignVertical: 'top'}]} 
                        multiline 
                        value={form.observacion} 
                        onChangeText={t => handleChange('observacion', t)}
                        placeholder="Detalles del daño..."
                        placeholderTextColor="#999"
                    />
                </View>

                <Text style={styles.label}>Recomendación:</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={[styles.input, {height: 60, textAlignVertical: 'top'}]} 
                        multiline 
                        value={form.recomendacion} 
                        onChangeText={t => handleChange('recomendacion', t)}
                        placeholder="Acción sugerida..."
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
                    <Text style={styles.txtBtn}>GUARDAR DATOS</Text>
                </TouchableOpacity>
                
            </ScrollView>

            <CustomAlert 
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                buttons={alertConfig.buttons}
                onClose={hideAlert}
            />
        </View>
    );
};

export default FormularioObservacionScreen;