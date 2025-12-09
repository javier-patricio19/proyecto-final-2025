import { useState, useEffect } from "react";
import { useUpdateElemento, useCrearElemento, useDeleteElemento } from "../hooks/elementosHook";

export const ListaElementos = ({ elementos, loading, error, onEdit, onDataChangeCallback }) => {
  const { deleting, handleDelete } = useDeleteElemento(onDataChangeCallback);
  if (loading) return <p>Cargando Elementos...</p>;
  if (error) return <p>Error al cargar: {error.message}</p>;

  const tableStyle = { borderCollapse: "collapse", width: "100%" };
  const thTdStyle = { border: "1px solid #ddd", padding: "8px", textAlign: "left" };
  const thStyle = { ...thTdStyle, backgroundColor: "#f2f2f2" };

  return (
    <div>
      <h2>Lista de Elementos ({elementos.length} elementos)</h2>
      {deleting && <p>eliminando elemento...</p>}

      {elementos.length === 0 ? (
        <p>No hay elementos registrados aún.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Descripción</th>
                <th style={thStyle}>Editar</th>
                <th style={thStyle}>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {elementos.map((item) => (
              <tr key={item.id}>
                <td style={thTdStyle}>{item.id}</td>
                <td style={thTdStyle}>{item.tipo}</td>
                <td style={thTdStyle}>{item.nombre}</td>
                <td style={thTdStyle}>{item.descripcion}</td>
                <td style={thTdStyle}>
                  <button onClick={() => onEdit(item)} style={{ marginRight: "5px" }} disabled={deleting}>
                    Editar
                  </button>
                </td>
                <td style={thTdStyle}>
                  <button onClick={() => handleDelete(item.id)} style={{ color: "red" }} disabled={deleting}>
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

export const AgregarElemento = ({ onDataAddedCallback }) => {
    const {
        tipo, setTipo,
        nombre, setNombre,
        descripcion, setDescripcion,
        encurso,
        error,
        handleSubmit,
    } = useCrearElemento(onDataAddedCallback);

    const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'flex-end' };
    const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
    const buttonStyle = { padding: '8px 12px' };

    return(
      <form onSubmit={handleSubmit}>
        <h1>Elementos</h1>
        <hr />
        <h2>Elemento Nuevo</h2>
        <div style={formGroupStyle}>
            <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Tipo:
                    <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle} required />
                </label>
            </div>

            <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Nombre:
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} required />
                </label>
            </div>

            <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Descripción:
                    <input type='text' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={inputStyle} required />
                </label>
            </div>
        </div>

        <button type="submit" style={buttonStyle} disabled={encurso}>
          {encurso ? 'Guardando...' : 'Agregar Elemento'}
        </button>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </form>
    );
};

export const EditarElemento = ({ elemento, onDataUpdatedCallback, onCancel }) => {
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
        const data = { tipo, nombre, descripcion };
        handleUpdateSubmit(e, elemento.id, data);
    };

    const formGroupStyle = { display: 'flex', gap: '15px', alignItems: 'flex-end' };
    const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
    const buttonStyle = { padding: '8px 12px' };

    return (
      <form onSubmit={onSubmit}>
        <h2>Editar Elemento ID: {elemento.id}</h2>
        <div style={formGroupStyle}>
            <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Tipo:
                    <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle} required />
                </label>
            </div>
            <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Nombre:
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={inputStyle} required />
                </label>
            </div>
            <div>
                <label style={{display: 'block', marginBottom: '5px'}}>
                    Descripción:
                    <input type='text' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={inputStyle} required />
                </label>
            </div>
        </div>

        <button type='submit' disabled={encursoUpdate} style={buttonStyle}>
            {encursoUpdate ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button type='button' onClick={onCancel} style={buttonStyle}>
            Cancelar
        </button>
        {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}
      </form>
    );
};

