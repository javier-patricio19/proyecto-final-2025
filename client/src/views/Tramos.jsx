import { useState, useEffect, useRef } from 'react';
import { useFetchTramos } from '../hooks/tramosHook';
import { toast } from 'react-toastify';
import { usePageTitle } from "../hooks/usePageTitle";

// Componentes Hijos
import { ListaTramos } from '../components/tramos/ListaTramos';
import { AgregarTramo } from '../components/tramos/AgregarTramo';
import { EditarTramo } from '../components/tramos/EditarTramo';

// Importamos los estilos compartidos
import styles from '../styles/stylesGestion/ListaGestion.module.css';

function Tramos() {
  usePageTitle("Gestión de Tramos");
  const formRef = useRef(null); // Referencia para scroll automático

  const { tramos: fetchedTramos, loading, error } = useFetchTramos();
  const [listaTramos, setListaTramos] = useState([]);
  const [editingTramo, setEditingTramo] = useState(null);

  // Scroll al inicio al montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sincronizar estado local con datos del servidor
  useEffect(() => {
    if (fetchedTramos) {
      setListaTramos(fetchedTramos);
    }
  }, [fetchedTramos]);

  // Manejador centralizado de cambios (CRUD local)
  const handleDataChange = (payload) => {
    // CASO 1: Eliminar
    if (typeof payload === 'number' || typeof payload === 'string') {
      setListaTramos(prev => prev.filter(t => t.id !== payload));
      toast.info("Tramo eliminado correctamente.");
      return;
    }

    // CASO 2: Guardar/Editar
    if (typeof payload === 'object' && payload !== null) {
      const existe = listaTramos.some(t => t.id === payload.id);

      if (existe) {
        // Actualizar existente
        setListaTramos(prev => prev.map(t => t.id === payload.id ? payload : t));
        toast.success("Tramo actualizado con éxito.");
      } else {
        // Agregar nuevo
        setListaTramos(prev => [payload, ...prev]); 
        toast.success("Tramo agregado con éxito.");
      }
      
      setEditingTramo(null);
    }
  };

  const handleEditClick = (tramo) => {
    setEditingTramo(tramo);
    // UX: Scrollear hacia arriba donde está el formulario
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingTramo(null);
  };

  return (
    // Usamos la clase pageContainer (que ya incluye el padding responsive)
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>
        Gestión de Tramos
      </h1>

      {/* Sección del Formulario con clase para margen */}
      <div ref={formRef} className={styles.formSection}>
        {editingTramo ? (
          <EditarTramo 
            tramo={editingTramo} 
            onDataUpdatedCallback={handleDataChange}
            onCancel={handleCancelEdit}
          />
        ) : (
          <AgregarTramo onDataAddedCallback={handleDataChange} />
        )}
      </div>
      
      <hr className={styles.separator} />
      
      {/* Sección de Lista */}
      <div>
        <ListaTramos 
          tramos={listaTramos} 
          loading={loading} 
          error={error} 
          onEdit={handleEditClick} 
          onDataChangeCallback={handleDataChange}
        />
      </div>
    </div>
  );
}

export default Tramos;