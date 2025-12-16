import { useNavigate } from "react-router-dom";
import { CrearObservacionForm } from "../components/observacionesComponents";
import { toast } from 'react-toastify';

function AgregarObservacion() {
    const navigate = useNavigate();

    const handleSuccess = (nuevaObservacion) => {
        console.log("handleSuccess ejecutado. Navegando a ver-observaciones.");
        toast.success(`Observación creada con Exito.`);
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