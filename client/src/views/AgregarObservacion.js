import { useNavigate } from "react-router-dom";
import { CrearObservacionForm } from "../components/observacionesComponents";

function AgregarObservacion() {
    const navigate = useNavigate();

    const handleSuccess = (nuevaObservacion) => {
        console.log("handleSuccess ejecutado. Navegando a ver-observaciones.");
        alert(`Observación creada con Exito.`);
        navigate("/verObservaciones");
    };

    return (
        <div style={{padding: '20 px'}}>
            <h1>Agregar Observación</h1>
            <CrearObservacionForm onSuccessCallback={handleSuccess} />
        </div>
    );
}

export default AgregarObservacion;