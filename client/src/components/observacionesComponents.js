import React from "react";
import { useDeleteObservacion } from '../hooks/observacionesHooks';

const tableStyle = { borderCollapse: 'collapse', width: '100%', marginTop: '15px' };
const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2' };
const buttonStyle = { padding: '5px 8px', fontSize: '0.8em' };

export const ListaObservaciones = ({ observaciones, loading, error, onEdit, onDataChangeCallback }) => {
    const { handleDelete } = useDeleteObservacion(onDataChangeCallback);

    if (loading) return <p>Cargando observaciones...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error.nessage}</p>;

    return (
        <div>
            <h2>Lista de Obsevaciones: {observaciones.length} elementos</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Fecha</th>
                        <th style={thStyle}>Observación</th>
                        <th style={thStyle}>estado</th>
                        <th style={thStyle}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {observaciones.map(item =>(
                        <tr key={item.id}>
                            <td style={thTdStyle}>{item.id}</td>
                            <td style={thTdStyle}>{new Date(item.fecha).toLocaleDateString()}</td>
                            <td style={thTdStyle}>{item.observacion_corta}</td>
                            <td style={thTdStyle}>{item.estado}</td>
                            <td style={thTdStyle}>
                                <button  onClick={() => onEdit(item)} style={{ ...buttonStyle, marginRight: '5px' }}>Editar</button>
                                <button  onClick={() => handleDelete(item.id)} style={{ ...buttonStyle, color: 'red' }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};