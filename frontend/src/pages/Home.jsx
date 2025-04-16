import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import AlbumFilter from '../components/AlbumFilter';
import ImageGrid from '../components/ImageGrid';
import './HomePage.css';

const Home = () => {
  const [allImages, setAllImages] = useState([]);
  const [albumsData, setAlbumsData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('All Images');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (window.ElectronAPI?.loadImages && window.electronAPI?.getAlbums) {
        const [images, albums] = await Promise.all([
          window.electronAPI.loadImages(),
          window.electronAPI.getAlbums()
        ]);
        setAllImages(images || []);
        setAlbumsData(albums || {});
      } else {
        console.error("Electron API not found. Check preload script.");
        setError("Application setup error.");
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load image or album data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const albumNamesForFilter = useMemo(
    () => ['All Images', ...Object.keys(albumsData)],
    [albumsData]
  );

  const filteredImages = useMemo(() => {
    const imageIdsInSelectedAlbum =
      selectedAlbum === 'All Images' ? null : albumsData[selectedAlbum] || [];
    return allImages.filter((image) => {
      const matchesAlbum =
        selectedAlbum === 'All Images' || imageIdsInSelectedAlbum.includes(image.id);
      const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesAlbum && matchesSearch;
    });
  }, [allImages, albumsData, searchTerm, selectedAlbum]);

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSelectAlbum = (album) => setSelectedAlbum(album);

  // Electron actions
  const handleAddToAlbum = useCallback(async (imageId) => {
    const targetAlbum = prompt("Enter album name to add to:", "New Album");
    if (targetAlbum && window.electronAPI?.addImageToAlbum) {
      try {
        const result = await window.electronAPI.addImageToAlbum({ imageId, albumName: targetAlbum });
        if (result.success) {
          setAlbumsData(result.albums);
          alert(`Image added to ${targetAlbum}`);
        } else {
          alert(`Failed to add image: ${result.error}`);
        }
      } catch (err) {
        console.error("Error adding image to album:", err);
        alert("An error occurred.");
      }
    }
  }, []);

  const handleDeleteImage = useCallback(async (imageId) => {
    if (window.electronAPI?.deleteImage) {
      try {
        const result = await window.electronAPI.deleteImage(imageId);
        if (result.success) {
          loadData(); // Refresh
        } else {
          alert(`Failed to delete image: ${result.error}`);
        }
      } catch (err) {
        console.error("Error deleting image:", err);
        alert("An error occurred during deletion.");
      }
    }
  }, [loadData]);

  // direct "editImage" from the main process
  const handleEditImage = useCallback(async (imageId) => {
    if (window.electronAPI?.editImage) {
      try {
        await window.electronAPI.editImage(imageId);
      } catch (err) {
        console.error("Error opening image for edit:", err);
        alert("Could not open image for editing.");
      }
    }
  }, []);

  if (isLoading) {
    return <div className="loading-message">Loading images...</div>;
  }
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="homepage-container">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search for Image by Title..."
      />
      <AlbumFilter
        albums={albumNamesForFilter}
        selectedAlbum={selectedAlbum}
        onSelectAlbum={handleSelectAlbum}
      />
      <ImageGrid
        images={filteredImages}
        onAddToAlbum={handleAddToAlbum}
        onDelete={handleDeleteImage}
        onEdit={handleEditImage}
      />
    </div>
  );
};

export default Home;
