import React, { useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import CardGrid from './components/CardGrid.jsx';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="layout">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <CardGrid searchQuery={searchQuery} />
    </div>
  );
}