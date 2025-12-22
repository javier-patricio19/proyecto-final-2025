import React from 'react';
import { useDeleteElemento } from '../../hooks/elementosHook';
import styles from '../../styles/stylesGestion/ListaGestion.module.css';

export const ListaElementos = ({ elementos, loading, error, onEdit, onDataChangeCallback }) => {
  const { deleting, handleDelete } = useDeleteElemento(onDataChangeCallback);

  if (loading) return <p className={styles.loading}>Cargando Elementos...</p>;
  if (error) return <p className={styles.error}>Error al cargar: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h2>Lista de Elementos ({elementos.length})</h2>
      {deleting && <p className={styles.loading}>Eliminando elemento...</p>}

      {elementos.length === 0 ? (
        <p className={styles.loading}>No hay elementos registrados aún.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th style={{width: '180px'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {elementos.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.tipo}</td>
                <td>{item.nombre}</td>
                <td>{item.descripcion}</td>
                
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