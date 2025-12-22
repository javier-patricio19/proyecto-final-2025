import React from 'react';
import { useDeleteTramo } from '../../hooks/tramosHook';
import styles from '../../styles/stylesGestion/ListaGestion.module.css';

export const ListaTramos = ({ tramos, loading, error, onEdit, onDataChangeCallback }) => {
  const { deleting, handleDelete } = useDeleteTramo(onDataChangeCallback);

  if (loading) return <p className={styles.loading}>Cargando Tramos...</p>;
  if (error) return <p className={styles.error}>Error al cargar: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h2>Lista de Tramos ({tramos.length})</h2>
      {deleting && <p className={styles.loading}>Eliminando elemento...</p>}

      {tramos.length === 0 ? (
        <p className={styles.loading}>No hay tramos registrados aún.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Inicio</th>
              <th>Destino</th>
              <th style={{width: '150px'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tramos.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.inicio}</td>
                <td>{item.destino}</td>
                <td className={styles.actionsCell}>
                  <button 
                    onClick={() => onEdit(item)} 
                    className={`${styles.btnAction} ${styles.btnEdit}`} 
                    disabled={deleting}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className={`${styles.btnAction} ${styles.btnDelete}`} 
                    disabled={deleting}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};