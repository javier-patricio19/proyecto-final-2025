import { useNavigate, useParams } from "react-router-dom";
import { EditarObservacion } from "../components/EditarObservacion";
import { toast } from 'react-toastify';

function EditarObservaciones(){
    const navigate = useNavigate();
    const {id} = useParams();

    const handleSuccess = (observacionActualizada) => {
        toast.success(`Observacion ${observacionActualizada.id} actualizada con éxito`);
        navigate("/verObservaciones");
    };

    const handleCancel = () => {
        navigate("/verObservaciones");
    };

    return(
        <div style={{padding: '20px'}}>
            <EditarObservacion
                observacionId={parseInt(id)}
                onSuccessCallback={handleSuccess}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default EditarObservaciones;