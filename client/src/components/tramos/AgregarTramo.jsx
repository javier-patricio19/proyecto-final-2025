import React from 'react';
import { useFormTramos } from '../../hooks/tramosHook';
import styles from '../../styles/stylesGestion/FormGestion.module.css';

export const AgregarTramo = ({ onDataAddedCallback }) => {
  const {
    inicio, setInicio,
    destino, setDestino,
    encurso,
    error,
    handleSubmit,
  } = useFormTramos(onDataAddedCallback);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.header}>Nuevo Tramo</h2>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Inicio de tramo:</label>
            <input 
              type="text" 
              value={inicio} 
              onChange={(e) => setInicio(e.target.value)} 
              className={styles.input} 
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Destino de tramo:</label>
            <input 
              type='text' 
              value={destino} 
              onChange={(e) => setDestino(e.target.value)} 
              className={styles.input} 
              required
            />
          </div>

          <button type='submit' disabled={encurso} className={styles.btnSubmit}>
            {encurso ? 'Guardando...' : 'Guardar Tramo'}
          </button>
        </div>
        
        {error && <p className={styles.errorText}>{error}</p>}
      </form>
    </div>
  );
};