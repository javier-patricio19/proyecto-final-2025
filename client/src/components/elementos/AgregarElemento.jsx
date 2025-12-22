import React from 'react';
import { useCrearElemento } from '../../hooks/elementosHook';
import styles from '../../styles/stylesGestion/FormGestion.module.css';

export const AgregarElemento = ({ onDataAddedCallback }) => {
    const {
        tipo, setTipo,
        nombre, setNombre,
        descripcion, setDescripcion,
        encurso,
        error,
        handleSubmit,
    } = useCrearElemento(onDataAddedCallback);

    return (
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <h2 className={styles.header}>Nuevo Elemento</h2>
          
          <div className={styles.formRow}>
              <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo:</label>
                  <input 
                    type="text" 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)} 
                    className={styles.input} 
                    required 
                    placeholder="Ej. Señalamiento"
                  />
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre:</label>
                  <input 
                    type="text" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    className={styles.input} 
                    required 
                    placeholder="Ej. Preventiva Curva"
                  />
              </div>

              <div className={styles.formGroup}>
                  <label className={styles.label}>Descripción:</label>
                  <input 
                    type='text' 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    className={styles.input} 
                    required 
                    placeholder="Detalles adicionales"
                  />
              </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.btnSubmit} disabled={encurso}>
              {encurso ? 'Guardando...' : 'Agregar Elemento'}
            </button>
          </div>
          
          {error && <p className={styles.errorText}>Error: {error}</p>}
        </form>
      </div>
    );
};