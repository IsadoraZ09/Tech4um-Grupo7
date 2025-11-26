import React from "react";
import Header from "./components/Header_login.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CardGrid from "./components/CardGrid.jsx";

export default function Dashboard_login() {
  return (
    <div className="layout">
      <Header />
      <SearchBar />
      <CardGrid />
    </div>
  );
}
