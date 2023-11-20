import { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/files');
      setFiles(response.data);
      setError('');
    } catch (error) {
      setError('Error fetching files');
      console.error('Error fetching files:', error);
    }
  };

  const downloadFile = (filename) => {
    try {
      window.open(`http://localhost:3001/api/files/download/${filename}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Error downloading file');
    }
  };

  const deleteFile = async (filename) => {
    try {
      await axios.delete(`http://localhost:3001/api/files/delete/${filename}`);
      fetchFiles(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Error deleting file');
    }
  };

  return (
    <div>
      <h2>Uploaded Files</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {files.map(file => (
          <li key={file}>
            <span onClick={() => downloadFile(file)} style={{ cursor: 'pointer' }}>
              {file}
            </span>
            <button onClick={() => deleteFile(file)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
