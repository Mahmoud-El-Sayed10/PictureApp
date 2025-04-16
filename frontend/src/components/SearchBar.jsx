import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
    return (
        <div className="search-bar-container">
            <span className="search-icon">🔍</span> 
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={onSearchChange}
            />
        </div>
    );
};

export default SearchBar;
