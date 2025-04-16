import React from 'react';
import './AlbumFilter.css';

const defaultAlbums = ['All Images', 'Family', 'Trips', 'Misc'];

const AlbumFilter = ({ albums = defaultAlbums, selectedAlbum, onSelectAlbum }) => {
    return (
        <div className="album-filter-container">
            <h3 className="album-filter-title">Albums</h3>
            <div className="album-filter-buttons">
                {albums.map((album) => (
                    <button
                        key={album}
                        className={`album-filter-button ${selectedAlbum === album ? 'active' : ''}`}
                        onClick={() => onSelectAlbum(album)}
                    >
                        {album}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AlbumFilter;
