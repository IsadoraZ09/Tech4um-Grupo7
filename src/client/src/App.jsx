import React, { useState } from "react";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CardGrid from "./components/CardGrid.jsx";
import Dashboard_login from "./Dashboard_login.jsx";
import ModalLogin from "./components/ModalLogin.jsx";
import { useAuth } from "./AuthContext.jsx";

export default function App() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (user) return <Dashboard_login />;

  return (
    <div className="layout">
      <Header />
      <SearchBar />
      <CardGrid />
      <ModalLogin />
    </div>
  );
}
