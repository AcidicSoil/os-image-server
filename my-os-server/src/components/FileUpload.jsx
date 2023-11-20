import axios from 'axios';
import { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const MAX_SIZE = 10000000; // Example max size 10MB
  const ALLOWED_EXTENSIONS = ['.iso', '.wim', '.txt', '.pdf', '.rtf'];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (file.size > MAX_SIZE) {
      setErrorMessage('File is too large');
      return;
    }

    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      setErrorMessage('File type is not allowed');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post('http://localhost:3001/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
    } catch (error) {
      setErrorMessage('Error uploading file');
    }
  };

  return (
    <div>
      <h2>Upload OS Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default FileUpload;
