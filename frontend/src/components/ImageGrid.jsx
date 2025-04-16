import React from 'react';
import ImageCard from './ImageCard';
import './ImageGrid.css';

const ImageGrid = ({ images, onAddToAlbum, onDelete, onEdit }) => {
    if (!images || images.length === 0) {
        return <p className="image-grid-empty">No images found.</p>;
    }

    return (
        <div className="image-grid">
            {images.map((image) => (
                <ImageCard
                    key={image.id}
                    image={image}
                    onAddToAlbum={onAddToAlbum}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};

export default ImageGrid;
