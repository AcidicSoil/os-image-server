const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const directoryPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, directoryPath),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully');
});

router.get('/', (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send('Unable to scan files');
    }
    res.send(files);
  });
});

router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(directoryPath, filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send({ message: "File not found" });
    }
    res.download(filePath, filename);
  });
});

// Delete file endpoint
router.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  console.log(`Attempting to delete file at path: ${filePath}`);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send({ message: "File not found" });
  }

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(500).send({ message: "Could not delete the file. " + err });
    } else {
      res.send({ message: 'File successfully deleted' });
    }
  });
});

module.exports = router;
