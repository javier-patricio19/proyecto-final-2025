import React, { useState, useEffect, useRef } from 'react';
import { useUpdateElemento } from '../../hooks/elementosHook';
import styles from '../../styles/stylesGestion/FormGestion.module.css';

export const EditarElemento = ({ elemento, onDataUpdatedCallback, onCancel }) => {
  const topRef = useRef(null);
  
      useEffect(() => {
          setTimeout(() => {
              if (topRef.current) {
                  topRef.current.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start'
                  });
              }
          }, 100);
      }, [elemento.id]);
    
  const [tipo, setTipo] = useState(elemento.tipo);
    const [nombre, setNombre] = useState(elemento.nombre);
    const [descripcion, setDescripcion] = useState(elemento.descripcion);

    const { encursoUpdate, errorUpdate, handleUpdateSubmit } = useUpdateElemento(onDataUpdatedCallback);

    useEffect(() => {
        setTipo(elemento.tipo);
        setNombre(elemento.nombre);
        setDescripcion(elemento.descripcion);
    }, [elemento]);

    const onSubmit = (e) => {
      e.preventDefault();
        const data = { tipo, nombre, descripcion };
        handleUpdateSubmit(e, elemento.id, data);
    };

    return (
      <div ref={topRef} className={styles.formContainer} tabIndex={-1}>
        <form onSubmit={onSubmit}>
          <h2 className={styles.header}>Editar Elemento ID: {elemento.id}</h2>
          
          <div className={styles.formRow}>
              <div className={styles.formGroup}>
                  <label className={styles.label}>Tipo:</label>
                  <input 
                    type="text" 
                    value={tipo} 
                    onChange={(e) => setTipo(e.target.value)} 
                    className={styles.input} 
                    required 
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
                  />
              </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type='submit' disabled={encursoUpdate} className={styles.btnSubmit}>
                {encursoUpdate ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
            <button type='button' onClick={onCancel} className={styles.btnCancel}>
                Cancelar
            </button>
          </div>
          
          {errorUpdate && <p className={styles.errorText}>{errorUpdate}</p>}
        </form>
      </div>
    );
};