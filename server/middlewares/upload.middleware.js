import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), 'images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFiltrer = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error("Error: Tipo de archivo no soportado. Solo se permiten imágenes."));
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFiltrer,
    limits: { fieldSize: 5 * 1024 * 1024 }
});