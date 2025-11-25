import React from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import CardGrid from './components/CardGrid.jsx';

export default function App() {
  const cards = [
    { title: 'product-development-stuff', author: 'Nome do criador', content: 'O que temos de bom nessa sala, pessoal? Bora falar de programação, criação de coisas legais e projetos pessoais.' },
    { title: 'gente-maneira-discutindo-tema-maneiro', content: 'Um Nome • 70 pessoas' },
    { title: 'Thinking about...', content: 'Um Nome • 70 pessoas' },
    { title: '#segurança', content: 'Um Nome • 70 pessoas' },
    { title: 'Designers_na_firma', content: 'Lucas Gomes • 55 pessoas' },
    { title: 'Manda um nome maneiro para esse 4um', content: 'Um Nome • 40 pessoas' },
    { title: 'gamegamesome!', content: 'Um Nome • 70 pessoas' },
    { title: 'E as férias?..', content: 'Um Nome • 70 pessoas' },
    { title: 'Referências e Boas práticas', content: 'Um Nome • 70 pessoas' },
  ];

  return (
    <div className="layout">
      <Header />
      <SearchBar />
      <CardGrid items={cards} />
    </div>
  );
}