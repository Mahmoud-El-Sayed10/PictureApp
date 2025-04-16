import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './ImageCard.css';

const AddIcon = () => <span title="Add to Album">+</span>;
const DeleteIcon = () => <span title="Delete">🗑️</span>;
const EditIcon = () => <span title="Edit">✏️</span>;

const ImageCard = ({ image, onAddToAlbum, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleAddToAlbumClick = (e) => {
    e.stopPropagation();
    onAddToAlbum(image.id);
  };
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(image.id);
  };
  const handleEditClick = (e) => {
    e.stopPropagation();
    navigate(`/editor/${image.id}`);
  };

  return (
    <div
      className="image-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image.src} alt={image.title} className="image-card-thumbnail" loading="lazy" />
      {isHovered && (
        <div className="image-card-overlay">
          <div className="image-card-title">{image.title}</div>
          <div className="image-card-actions">
            <button onClick={handleAddToAlbumClick} className="image-action-button"><AddIcon /></button>
            <button onClick={handleDeleteClick} className="image-action-button"><DeleteIcon /></button>
            <button onClick={handleEditClick} className="image-action-button"><EditIcon /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
