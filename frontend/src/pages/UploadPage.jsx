// src/pages/UploadPage.jsx
import React, { useState } from 'react';
import './UploadPage.css';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [status, setStatus] = useState('');

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
        setStatus('');
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setStatus('No files selected!');
            return;
        }

        try {
            const filePaths = [];
            for (const file of selectedFiles) {
                if (file.path) {
                    filePaths.push(file.path);
                } else {
                    console.warn('No .path for file:', file.name);
                }
            }

            if (filePaths.length === 0) {
                setStatus('Could not resolve file paths in Electron. Check preload & security settings.');
                return;
            }

            setStatus('Uploading...');

            const result = await window.electronAPI.uploadImage(filePaths);
            if (result.success) {
                setStatus('Upload successful!');
            } else {
                setStatus(`Upload failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Error uploading:', error);
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-header">
                <button onClick={() => navigate(-1)} className="upload-back-button">← Back</button>
                <h2>Upload Images</h2>
            </div>
            <div className="upload-content">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="upload-file-input"
                    accept="image/*"
                />
                <button onClick={handleUpload} className="upload-submit-button">Upload</button>
            </div>
            {status && <div className="upload-status">{status}</div>}
        </div>
    );
};

export default UploadPage;
