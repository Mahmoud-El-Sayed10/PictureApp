// src/pages/EditorPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import EditorToolbar from '../components/EditorToolbar';
import './EditorPage.css';

const EditorPage = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cropperInstance, setCropperInstance] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [pendingActions, setPendingActions] = useState([]);
  const imageRef = useRef(null);

  const addAction = useCallback((action) => {
    setPendingActions((prev) => {
      const newActions = [...prev];
      newActions.push(action);
      return newActions;
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    if (window.electronAPI?.getImagePathForEditor) {
      window.electronAPI.getImagePathForEditor(imageId)
        .then(result => {
          if (result.success) {
            setImageUrl(result.path);
          } else {
            setError(result.error || 'Image not found.');
          }
        })
        .catch(err => {
          console.error("Error fetching image path:", err);
          setError('Could not load image.');
        })
        .finally(() => setIsLoading(false));
    } else {
      setError('Electron API not available.');
      setIsLoading(false);
    }
    return () => {
      cropperInstance?.destroy();
    };
  }, [imageId, cropperInstance]);

  useEffect(() => {
    if (imageUrl && imageRef.current && !cropperInstance && !isLoading) {
      const cropper = new Cropper(imageRef.current, {
        aspectRatio: NaN,
        viewMode: 1,
        autoCrop: false,
        dragMode: 'move',
        background: false,
      });
      setCropperInstance(cropper);
    }
  }, [imageUrl, isLoading, cropperInstance]);

  const handleCrop = () => {
    if (!cropperInstance) return;
    if (isCropping) {
      const cropData = cropperInstance.getData(true);
      addAction({
        type: 'crop',
        value: { x: cropData.x, y: cropData.y, width: cropData.width, height: cropData.height }
      });
      cropperInstance.clear().crop();
      setIsCropping(false);
    } else {
      cropperInstance.crop();
      setIsCropping(true);
    }
  };

  const handleRotateLeft = () => {
    if (!cropperInstance) return;
    cropperInstance.rotate(-90);
    addAction({ type: 'rotate', value: -90 });
  };

  const handleRotateRight = () => {
    if (!cropperInstance) return;
    cropperInstance.rotate(90);
    addAction({ type: 'rotate', value: 90 });
  };

  const handleBlackAndWhite = () => {
    addAction({ type: 'bw' });
    alert("Black & White toggled (will apply on save)");
  };

  const handleWatermark = () => {
    const text = prompt("Enter watermark text:", "© My App");
    if (text !== null) {
      addAction({ type: 'watermark', value: text });
      alert(`Watermark "${text}" will be applied on save.`);
    }
  };

  const handleApplyChanges = async () => {
    if (pendingActions.length === 0) {
      alert("No changes to apply.");
      return;
    }
    if (window.electronAPI?.saveEditedImage) {
      setIsLoading(true);
      try {
        const result = await window.electronAPI.saveEditedImage({ imageId, actions: pendingActions });
        if (result.success) {
          setImageUrl(result.newSrc);
          setPendingActions([]);
          cropperInstance?.reset();
          alert("Changes saved successfully!");
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (err) {
        console.error("Error saving image:", err);
        alert("An error occurred while saving.");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Save functionality not available.");
    }
  };

  const handleRevertChanges = () => {
    cropperInstance?.reset();
    cropperInstance?.clear();
    setPendingActions([]);
    setIsCropping(false);
    alert("Reverted unsaved changes.");
  };

  if (isLoading && !imageUrl) {
    return <div className="loading-message">Loading Editor...</div>;
  }
  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="editor-top-bar">
        <button onClick={() => navigate(-1)} className="editor-button back-button">← Back</button>
        <div className="editor-main-actions">
          <button onClick={handleApplyChanges} className="editor-button apply-button" disabled={isLoading || pendingActions.length === 0}>
            {isLoading ? 'Saving...' : 'Apply Changes'}
          </button>
          <button onClick={handleRevertChanges} className="editor-button revert-button" disabled={isLoading}>
            Revert Changes
          </button>
        </div>
      </div>

      <div className="editor-image-container">
        <img ref={imageRef} src={imageUrl} alt="Editable" key={imageUrl} style={{ maxWidth: '100%' }} />
        {isLoading && <div className="editor-saving-overlay">Saving...</div>}
      </div>

      <EditorToolbar
        onCrop={handleCrop}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onWatermark={handleWatermark}
        onBlackAndWhite={handleBlackAndWhite}
      />
    </div>
  );
};

export default EditorPage;
