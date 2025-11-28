import React, { useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CardGrid from "./components/CardGrid.jsx";
import ModalLogin from "./components/ModalLogin.jsx";
import { useAuth } from "./AuthContext.jsx";
import Header_login from "./components/Header_login.jsx";

export default function App() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="layout">
      {user ? <Header_login /> : <Header />}
      <SearchBar onSearch={handleSearch} />
      <CardGrid searchQuery={searchQuery} />
      <ModalLogin />
    </div>
  );
}