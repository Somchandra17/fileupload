const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const uploadsDir = path.join(__dirname, 'server_uploads');

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing file' });
    }

    const oldPath = files.files.filepath;
    const newPath = path.join(uploadsDir, files.files.originalFilename); 

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving file' });
      }
      res.json({ message: 'File uploaded successfully' });
    });
  });
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' }); 
    } 

    res.download(filePath);
  });
});

app.get('/list-files', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Error reading directory' });
    } else {
      res.json({ files: files });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
