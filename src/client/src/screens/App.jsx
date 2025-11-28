import React, { useState } from "react";
import Header from "../components/Header.jsx";
import SearchBar from "../components/HomeScreen/SearchBar.jsx";
import CardGrid from "../components/HomeScreen/CardGrid.jsx";
import ModalLogin from "../components/ModalLogin.jsx";

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="layout">
      {<Header />}
      <SearchBar onSearch={handleSearch} />
      <CardGrid searchQuery={searchQuery} />
      <ModalLogin />
    </div>
  );
}