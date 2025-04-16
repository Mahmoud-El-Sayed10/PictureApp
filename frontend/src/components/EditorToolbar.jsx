import React from 'react';
import './EditorToolbar.css';

const CropIcon = () => <span>✂️</span>;
const RotateLeftIcon = () => <span>🔄</span>;
const RotateRightIcon = () => <span>🔁</span>;
const WatermarkIcon = () => <span>💧</span>;
const BWIcon = () => <span>B&W</span>;

const EditorToolbar = ({ onCrop, onRotateLeft, onRotateRight, onWatermark, onBlackAndWhite }) => {
  return (
    <div className="editor-toolbar">
      <button onClick={onCrop} className="toolbar-button">
        <CropIcon /> <span className="toolbar-button-label">Crop</span>
      </button>
      <button onClick={onRotateLeft} className="toolbar-button">
        <RotateLeftIcon /> <span className="toolbar-button-label">Rotate Left</span>
      </button>
      <button onClick={onRotateRight} className="toolbar-button">
        <RotateRightIcon /> <span className="toolbar-button-label">Rotate Right</span>
      </button>
      <button onClick={onWatermark} className="toolbar-button">
        <WatermarkIcon /> <span className="toolbar-button-label">Add Watermark</span>
      </button>
      <button onClick={onBlackAndWhite} className="toolbar-button">
        <BWIcon /> <span className="toolbar-button-label">Black & White</span>
      </button>
    </div>
  );
};

export default EditorToolbar;
