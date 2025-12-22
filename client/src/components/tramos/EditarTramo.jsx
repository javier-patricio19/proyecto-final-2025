import React, { useState, useEffect } from 'react';
import { useUpdateTramo } from '../../hooks/tramosHook';
import styles from '../../styles/stylesGestion/FormGestion.module.css';

export const EditarTramo = ({ tramo, onDataUpdatedCallback, onCancel }) => {
    const [inicio, setInicio] = useState(tramo.inicio);
    const [destino, setDestino] = useState(tramo.destino);
    
    const { encursoUpdate, errorUpdate, handleUpdateSubmit } = useUpdateTramo(onDataUpdatedCallback);

    useEffect(() => {
        setInicio(tramo.inicio);
        setDestino(tramo.destino);
    }, [tramo]);

    const onSubmit = (e) => {
        const data = { inicio, destino };
        handleUpdateSubmit(e, tramo.id, data);
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={onSubmit}>
                <h2 className={styles.header}>Editar Tramo ID: {tramo.id}</h2>
                
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Inicio:</label>
                        <input 
                            type="text" 
                            value={inicio} 
                            onChange={(e) => setInicio(e.target.value)} 
                            className={styles.input} 
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Destino:</label>
                        <input 
                            type='text' 
                            value={destino} 
                            onChange={(e) => setDestino(e.target.value)} 
                            className={styles.input} 
                            required 
                        />
                    </div>

                    <button type='submit' disabled={encursoUpdate} className={styles.btnSubmit}>
                        {encursoUpdate ? 'Actualizando...' : 'Guardar Cambios'}
                    </button>
                    <button type="button" onClick={onCancel} className={styles.btnCancel}>
                        Cancelar
                    </button>
                </div>


                {errorUpdate && <p className={styles.errorText}>{errorUpdate}</p>}
            </form>
        </div>
    );
};