import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, ScrollView, TouchableOpacity, 
    Image, StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import db from '../database/db'; 
import CustomAlert from '../components/CustomAlert';
import { guardarObservacionService } from '../utils/VoiceLogic';

const FormularioDictadoScreen = ({ route, navigation }) => {
    // Recibimos los datos PRE-PROCESADOS desde VoiceScreen
    const { tramoId, fotos, coords, datosDetectados } = route.params;

    const [listaElementos, setListaElementos] = useState([]);
    
    // Alertas
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({ type: 'info', title: '', message: '', buttons: [] });

    // Inicializamos el formulario con lo que nos mandó la pantalla anterior
    const [form, setForm] = useState({
        elementoId: datosDetectados.elementoId || '', 
        kilometro: datosDetectados.kilometro || '',
        cuerpo: datosDetectados.cuerpo || '',    
        carril: datosDetectados.carril || '',    
        observacion: datosDetectados.observacion || '',
        recomendacion: datosDetectados.recomendacion || '',
        estado: 'Regular'
    });

    useEffect(() => {
        const cargarElementos = async () => {
            try {
                const resultados = await db.getAllAsync('SELECT * FROM elementos ORDER BY nombre ASC');
                setListaElementos(resultados);
            } catch (e) {
                console.error("Error cargando elementos", e);
            }
        };
        cargarElementos();

        // Aviso si no se detectó elemento
        if (!datosDetectados.elementoId) {
            setTimeout(() => {
                showCustomAlert('warning', 'Atención', 'No detecté el nombre del elemento. Selecciónalo manualmente.');
            }, 500);
        }
    }, []);

    const showCustomAlert = (type, title, message, buttons = []) => {
        setModalConfig({ type, title, message, buttons });
        setModalVisible(true);
    };

    const handleGuardar = async () => {
        if (!form.cuerpo || !form.carril) {
            showCustomAlert('error', 'Faltan datos', 'Por favor selecciona Cuerpo y Carril.');
            return;
        }

        try {
            await guardarObservacionService(form, fotos, coords, tramoId);
            
            showCustomAlert(
                'success', 
                '¡Excelente!', 
                'Observación guardada.\n¿Qué deseas hacer?',
                [
                    { text: "Finalizar", style: "destructive", onPress: () => navigation.popToTop() },
                    { text: "Continuar", onPress: () => navigation.navigate('DetalleTramo', { tramoId }) }
                ]
            );
        } catch (error) {
            showCustomAlert('error', 'Error', error.message);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: '#f9f9f9'}}>
            <View style={{backgroundColor: '#000', paddingVertical: 10}}>
                <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 10}}>
                    {fotos && fotos.map((uri, i) => (
                        <Image key={i} source={{uri}} style={styles.thumbHeader} />
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={{padding: 20}}>
                <View style={styles.headerRow}>
                    <Text style={styles.header}>Verifica los datos:</Text>
                    {/* Botón para volver a intentar dictar */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{color: '#007AFF'}}>❮ Volver a Dictar</Text>
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.label}>Elemento:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={form.elementoId}
                        onValueChange={(v) => setForm({...form, elementoId: v})}
                    >
                        <Picker.Item label="-- Selecciona --" value="" />
                        {listaElementos.map((item) => (
                            <Picker.Item key={item.id} label={item.nombre} value={item.id} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.row}>
                    <View style={{flex: 1, marginRight: 5}}>
                        <Text style={styles.label}>Cuerpo:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={form.cuerpo} onValueChange={v => setForm({...form, cuerpo: v})}>
                                <Picker.Item label="-- --" value="" />
                                <Picker.Item label="A" value="A" />
                                <Picker.Item label="B" value="B" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{flex: 1, marginLeft: 5}}>
                        <Text style={styles.label}>Carril:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={form.carril} onValueChange={v => setForm({...form, carril: v})}>
                                <Picker.Item label="-- --" value="" />
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                                <Picker.Item label="Acotamiento" value="Acotamiento" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <Text style={styles.label}>Kilómetro:</Text>
                <TextInput style={styles.input} value={form.kilometro} onChangeText={t => setForm({...form, kilometro:t})}/>

                <Text style={styles.label}>Observación:</Text>
                <TextInput style={[styles.input, {height: 80}]} multiline value={form.observacion} onChangeText={t => setForm({...form, observacion:t})}/>

                <Text style={styles.label}>Recomendación:</Text>
                <TextInput style={[styles.input, {height: 60}]} multiline value={form.recomendacion} onChangeText={t => setForm({...form, recomendacion:t})}/>

                <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
                    <Text style={styles.txtBtn}>GUARDAR DATOS</Text>
                </TouchableOpacity>
                
                <View style={{height: 50}}/>
            </ScrollView>

            <CustomAlert 
                visible={modalVisible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    thumbHeader: { width: 60, height: 60, borderRadius: 5, marginRight: 8, borderWidth: 1, borderColor: '#555' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    header: { fontSize: 18, fontWeight: 'bold' },
    label: { fontSize: 12, fontWeight: 'bold', color: '#555', marginTop: 10, marginBottom: 5 },
    pickerContainer: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, justifyContent: 'center' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16 },
    row: { flexDirection: 'row' },
    btnGuardar: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
    txtBtn: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default FormularioDictadoScreen;