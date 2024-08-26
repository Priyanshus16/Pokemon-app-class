import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonListView from './View/PokemonListView';
import PokemonDetailView from './View/PokemonDetailView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonListView />} />
        <Route path="/pokemon/:id" element={<PokemonDetailView />} />
      </Routes>
    </Router>
  );
};

export default App;
