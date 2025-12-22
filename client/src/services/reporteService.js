import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { API_BASE_URL } from "../utils/config";

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const getImageFromURL = async (url) => {
    const cleanUrl = `${url}?nocache=${Date.now()}`;
    try {
        const response = await fetch(cleanUrl, {
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Accept': 'image/*'
            }
        });
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const blob = await response.blob();
        
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Error al convertir blob a base64"));
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn("Fallo crítico obteniendo imagen:", url, error);
        return null; 
    }

};

export const generarReportePDF = async (observaciones) => {
    const doc = new jsPDF();

    for (let i = 0; i < observaciones.length; i++) {
        const obs = observaciones[i];
        if (i > 0) doc.addPage();

        doc.setFontSize(18);
        doc.text("Reporte Técnico de Daños en Carretera", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Fecha de Reporte: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });

        autoTable(doc, {
            startY: 35,
            head: [['Campo', 'Información']],
            body: [
                ['ID de Registro', String(obs.id)],
                ['Estado Actual', String(obs.estado)],
                ['Ubicación', `KM ${obs.kilometro} - Cuerpo ${obs.cuerpo} - Carril ${obs.carril}`],
                ['Fecha Observación', new Date(obs.fecha).toLocaleDateString()],
                ['Descripción Corta', String(obs.observacion_corta)],
                ['Detalle Técnico', String(obs.observacion)],
                ['Recomendación', String(obs.recomendacion)],
            ],
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
        });

        let yPos = doc.lastAutoTable.finalY + 15;
        let xPos = 14;
        doc.setFontSize(14);
        const imgWidth = 60;
        const imgHeight = 45;

        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text("Evidencia Fotográfica:", 14, yPos);
        yPos += 8;

        if (obs.imagenes && obs.imagenes.length > 0) {

            for (const imgData of obs.imagenes) {
                const ruta = imgData.ruta.startsWith('/') ? imgData.ruta : `/${imgData.ruta}`;
                const fullUrl = `${SERVER_URL}${ruta}`;
                console.log("Procesando imagen:", fullUrl);
                const base64Img = await getImageFromURL(fullUrl);
                
                if (base64Img) {
                    if (xPos + imgWidth > 190) {
                        xPos = 14;
                        yPos += imgHeight + 5;
                    }
                    if (yPos + imgHeight > 275) {
                        doc.addPage();
                        yPos = 20;
                        xPos = 14;
                    }

                    try {
                        doc.addImage(base64Img, 'JPEG', xPos, yPos, imgWidth, imgHeight, undefined, 'FAST');
                        xPos += imgWidth + 5;
                    } catch (e) {
                        console.error("Error al insertar imagen en PDF:", e);
                    }
                } else {
                    doc.setDrawColor(200);
                    doc.rect(xPos, yPos, imgWidth, imgHeight);
                    doc.setFontSize(8);
                    doc.text("Imagen no disponible", xPos + 5, yPos + 22);
                    xPos += imgWidth + 5;
                }
            }
        } else {
            doc.setFontSize(10);
            doc.text("No se adjuntó evidencia fotográfica en este registro.", 14, yPos + 5);
        }
    }
    return doc;
};

export const obtenerPreviewPDF = async (observaciones) => {
    const doc = await generarReportePDF(observaciones);
    const blob = doc.output("blob");
    return URL.createObjectURL(blob);
};

export const descargarPDF = async (observaciones) => {
    const doc = await generarReportePDF(observaciones);
    const nombre = observaciones.length === 1 ? `Reporte_${observaciones[0].id}.pdf` : "Reporte_Grupal.pdf";
    doc.save(nombre);
};