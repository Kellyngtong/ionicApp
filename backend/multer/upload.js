const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Creamos un directorio público para imágenes: backend/public/images
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');

// Crear carpeta public/images si no existe (recursive por seguridad)
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Genera un nombre único con fecha/hora y extensión original
function generateFilename(originalName) {
  const now = new Date();
  const iso = now.toISOString().replace(/[:.]/g, '-');
  const unique = `${iso}-${Date.now()}`;
  return unique + path.extname(originalName);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicImagesDir);
  },
  filename: function (req, file, cb) {
    cb(null, generateFilename(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      // Don't throw an error here - mark validation on the request and reject the file
      req.fileValidationError = 'Tipo de archivo no permitido';
      cb(null, false);
    }
  },
});

module.exports = upload;
